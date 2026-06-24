'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

import ProfesionalSidebar from '@/components/ui/profesional-sidebar'
import ProfesionalTopbar from '@/components/ui/profesional-topbar'
import type { UserWithRoles } from '@/lib/auth'

interface ProfesionalLayoutShellProps {
  user: UserWithRoles
  children: React.ReactNode
}

export default function ProfesionalLayoutShell({ user, children }: ProfesionalLayoutShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!isMobileSidebarOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileSidebarOpen])

  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  const userRole = user.roles.includes('PROFESIONAL') ? 'PROFESIONAL' : user.roles[0]

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Sidebar escritorio */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <ProfesionalSidebar userRole={userRole} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProfesionalTopbar
          userName={user.name}
          userEmail={user.email}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Sidebar móvil */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMobileSidebarOpen}
        onClick={closeMobileSidebar}
      >
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80%] overflow-y-auto bg-white shadow-lg transition-transform duration-200 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Menú profesional</p>
            <button
              type="button"
              onClick={closeMobileSidebar}
              className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ProfesionalSidebar
            userRole={userRole}
            onNavigate={closeMobileSidebar}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
