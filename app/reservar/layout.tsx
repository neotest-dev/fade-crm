import type { Metadata } from 'next'
import Link from 'next/link'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import { Scissors, LogIn } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FADE Barber Shop — Reserva tu cita',
  description: 'Reserva tu cita en FADE Barber Shop. Servicios de barberia premium.',
}

export default function ReservarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header publico */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-sm border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/reservar" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#c8a55a] to-[#a88a3e] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_12px_rgba(200,165,90,0.4)] transition-shadow">
              <Scissors size={15} className="text-[#0a0a0a]" />
            </div>
            <div>
              <p className="text-[#c8a55a] font-[family-name:var(--font-display)] text-lg leading-none tracking-wider">FADE</p>
              <p className="text-[8px] text-[#555] uppercase tracking-[0.2em] font-[family-name:var(--font-body)]">Barber Shop</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {[
              { href: '/reservar', label: 'Inicio' },
              { href: '/reservar/servicios', label: 'Servicios' },
              { href: '/reservar/cita', label: 'Reservar' },
              { href: '/reservar/productos', label: 'Productos' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#c8a55a] transition-colors rounded-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c8a55a] border border-[#c8a55a]/30 hover:border-[#c8a55a] hover:bg-[#c8a55a]/5 px-3 py-1.5 rounded-sm transition-all">
                  <LogIn size={13} />
                  Ingresar
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-sm',
                  },
                }}
              />
            </Show>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex border-t border-[#1a1a1a] overflow-x-auto">
          {[
            { href: '/reservar', label: 'Inicio' },
            { href: '/reservar/servicios', label: 'Servicios' },
            { href: '/reservar/cita', label: 'Reservar' },
            { href: '/reservar/productos', label: 'Productos' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#555] hover:text-[#c8a55a] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-14 sm:pt-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#333] text-[11px] uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} FADE Barber Shop
          </p>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25d366] text-[11px] font-bold uppercase tracking-widest hover:text-[#20ba5a] transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </footer>
    </div>
  )
}
