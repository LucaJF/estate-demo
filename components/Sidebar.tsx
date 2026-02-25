'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase'
import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  Plug,
  LogOut,
  Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: `/${locale}`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/clients`, label: t('clients'), icon: Users },
    { href: `/${locale}/properties`, label: t('properties'), icon: Home },
    { href: `/${locale}/integrations`, label: t('integrations'), icon: Plug },
  ]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
    router.refresh()
  }

  function toggleLocale() {
    const newLocale = locale === 'en' ? 'zh' : 'en'
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <aside
      className="w-60 min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #1B2B4B 0%, #152238 100%)' }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-lg font-semibold text-white">EstateTools</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== `/${locale}` && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'sidebar-link',
                isActive && 'active'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <button
          onClick={toggleLocale}
          className="sidebar-link w-full text-left"
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          {locale === 'en' ? '中文' : 'English'}
        </button>
        <button
          onClick={handleSignOut}
          className="sidebar-link w-full text-left"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {t('signOut')}
        </button>
      </div>
    </aside>
  )
}
