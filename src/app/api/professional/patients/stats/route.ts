import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    if (!professionalId || !dateFrom || !dateTo) {
      return NextResponse.json({ 
        error: 'Faltan parámetros requeridos: professionalId, dateFrom, dateTo' 
      }, { status: 400 })
    }

    // Verificar que el usuario tiene acceso a estos datos
    // Si el usuario no es profesional, debe ser gerente
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id }
    })
    const hasAccess = user.id === professionalId || userRoles.some((r: { role: string }) => r.role === 'GERENTE')
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const startDate = new Date(dateFrom)
    const endDate = new Date(dateTo)
    endDate.setHours(23, 59, 59, 999) // Incluir todo el día final

    // Obtener todos los pacientes únicos del profesional en el período con sus datos completos
    const pacientesStats = await prisma.patient.findMany({
      where: {
        appointments: {
          some: {
            profesionalId: professionalId,
            fecha: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        dni: true,
        fechaNacimiento: true,
        genero: true,
        ciudad: true,
        appointments: {
          where: {
            profesionalId: professionalId,
            fecha: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
            fecha: true,
            estado: true,
          },
        },
      },
    })

    // Procesar datos para incluir estadísticas adicionales
    const pacientesConStats = pacientesStats.map(paciente => {
      const totalVisitas = paciente.appointments.length
      
      return {
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        dni: paciente.dni,
        fechaNacimiento: paciente.fechaNacimiento,
        genero: paciente.genero,
        ciudad: paciente.ciudad || 'Sin especificar',
        totalVisitas,
        ultimaVisita: paciente.appointments.length > 0 
          ? paciente.appointments.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].fecha
          : null,
      }
    })

    // Estadísticas generales
    const totalPacientes = pacientesConStats.length
    const totalVisitas = pacientesConStats.reduce((acc, p) => acc + p.totalVisitas, 0)
    const promedioVisitas = totalPacientes > 0 ? totalVisitas / totalPacientes : 0

    // Distribución por género
    const distribucionGenero = pacientesConStats.reduce((acc, p) => {
      acc[p.genero] = (acc[p.genero] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Distribución por ciudad
    const distribucionCiudad = pacientesConStats.reduce((acc, p) => {
      const ciudad = p.ciudad || 'Sin especificar'
      acc[ciudad] = (acc[ciudad] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calcular edades
    const edades = pacientesConStats.map(p => {
      const today = new Date()
      const birthDate = new Date(p.fechaNacimiento)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    })

    const edadPromedio = edades.length > 0 ? edades.reduce((acc, age) => acc + age, 0) / edades.length : 0

    return NextResponse.json({
      pacientes: pacientesConStats,
      estadisticas: {
        totalPacientes,
        totalVisitas,
        promedioVisitas,
        edadPromedio,
        distribucionGenero,
        distribucionCiudad,
        rangoEdades: {
          minima: Math.min(...edades),
          maxima: Math.max(...edades)
        }
      },
      periodo: {
        desde: dateFrom,
        hasta: dateTo
      }
    })

  } catch (error) {
    console.error('Error al obtener estadísticas de pacientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
