# 🏥 CareLink - Sistema de Gestión de Turnos Clínicos

Sistema académico para la gestión integral de turnos médicos en clínicas, desarrollado por un equipo de 7 estudiantes como proyecto universitario.

## 📋 Descripción del Proyecto

CareLink es una aplicación web moderna que permite:
- **Gestión de Pacientes**: Registro, historial y datos médicos
- **Agenda Médica**: Calendario de turnos y disponibilidad de médicos  
- **Sistema de Turnos**: Reserva, confirmación y seguimiento de citas
- **Panel Administrativo**: Gestión de usuarios, reportes y configuración
- **Notificaciones**: Recordatorios por email y SMS (futuro)

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **Prisma** - ORM moderno para bases de datos
- **PostgreSQL** - Base de datos relacional
- **Docker** - Contenerización y desarrollo

## 📋 Requisitos previos

- Node.js 20+
- npm o yarn
- Docker y docker-compose

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd carelink-clinic-management
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Inicia la base de datos con Docker:
```bash
docker-compose up -d
```

5. Ejecuta las migraciones de Prisma:
```bash
npm run prisma:migrate
npm run prisma:generate
```

6. (Opcional) Ejecuta el seed:
```bash
npm run db:seed
```

## 🏃‍♂️ Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

Credenciales de prueba (seed):

- Profesional: ana.cardiologa@carelink.com / admin1234
- Mesa de entrada: mesa@carelink.com / admin1234
- Gerente: gerente@carelink.com / admin1234


## 📁 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run prisma:migrate` - Ejecuta las migraciones de Prisma
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:studio` - Abre Prisma Studio
- `npm run db:seed` - Ejecuta el seed de la base de datos

## 🗃️ Base de datos

El proyecto utiliza PostgreSQL con Prisma como ORM. La configuración de Docker incluye una instancia de PostgreSQL lista para desarrollo.

## 📝 Estructura del proyecto

```
carelink/
├── src/
│   ├── app/                 # App Router de Next.js
│   ├── components/          # Componentes reutilizables
│   └── lib/                 # Utilidades y configuración
├── prisma/                  # Esquemas y migraciones de Prisma
├── public/                  # Archivos estáticos
└── docker-compose.yml       # Configuración de Docker
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Agrega los cambios que haras commit (`git add .` (el punto agrega todos los cambios))
4. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.