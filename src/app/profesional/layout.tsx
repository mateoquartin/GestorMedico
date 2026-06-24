import { redirect } from 'next/navigation'
import { getCurrentUser, userHasRole } from '@/lib/auth'
import ProfesionalLayoutShell from '@/components/ui/profesional-layout-shell'

export default async function ProfesionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.roles.length === 0) {
    redirect('/error')
  }
  if (!userHasRole(user.roles, 'PROFESIONAL')) redirect('/error')

  return (
    <ProfesionalLayoutShell user={user}>
      {children}
    </ProfesionalLayoutShell>
  )
}
