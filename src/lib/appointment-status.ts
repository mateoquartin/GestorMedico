import { AppointmentStatus } from '@prisma/client'

type StatusVisualMeta = {
  label: string
  badgeClass: string
  solidClass: string
}

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, StatusVisualMeta> = {
  [AppointmentStatus.PROGRAMADO]: {
    label: 'Programado',
    badgeClass: 'border border-sky-200 bg-sky-100 text-sky-800',
    solidClass: 'border border-sky-400 bg-sky-300 text-slate-900',
  },
  [AppointmentStatus.CONFIRMADO]: {
    label: 'Confirmado',
    badgeClass: 'border border-teal-200 bg-teal-100 text-teal-800',
    solidClass: 'border border-teal-400 bg-teal-300 text-teal-900',
  },
  [AppointmentStatus.EN_SALA_DE_ESPERA]: {
    label: 'En sala de espera',
    badgeClass: 'border border-amber-200 bg-amber-100 text-amber-800',
    solidClass: 'border border-amber-300 bg-amber-200 text-amber-900',
  },
  [AppointmentStatus.COMPLETADO]: {
    label: 'Completado',
    badgeClass: 'border border-emerald-500 bg-emerald-500 text-white',
    solidClass: 'border border-emerald-600 bg-emerald-600 text-white',
  },
  [AppointmentStatus.CANCELADO]: {
    label: 'Cancelado',
    badgeClass: 'border border-rose-500 bg-rose-500 text-white',
    solidClass: 'border border-rose-600 bg-rose-600 text-white',
  },
  [AppointmentStatus.NO_ASISTIO]: {
    label: 'No asistió',
    badgeClass: 'border border-gray-300 bg-gray-200 text-gray-700',
    solidClass: 'border border-gray-400 bg-gray-300 text-gray-800',
  },
}

export function getStatusLabel(status: AppointmentStatus) {
  return APPOINTMENT_STATUS_META[status].label
}

