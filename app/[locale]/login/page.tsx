'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase'
import { Building2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // For demo: try sign up if sign in fails
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }
    }
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, #0e1926 0%, #1B2B4B 50%, #2d4f8e 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-xl font-semibold text-white">EstateTools</span>
        </div>

        <div>
          <blockquote className="text-white/80 text-lg leading-relaxed italic font-serif mb-6">
            "The right tools don't just save time — they help you close more deals and build lasting client relationships."
          </blockquote>
          <div className="flex gap-6 mt-8">
            {[
              { label: 'Active Agents', value: '2,400+' },
              { label: 'Deals Tracked', value: '$1.2B+' },
              { label: 'Time Saved / Week', value: '8 hrs' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gold-500">{stat.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/30 text-xs">
          © 2025 EstateTools. Built for real estate professionals.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F7F8FA]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-navy-700">EstateTools</span>
          </div>

          <div className="card p-8">
            <h1 className="font-serif text-2xl font-semibold text-navy-700 mb-1">{t('title')}</h1>
            <p className="text-sm text-gray-500 mb-8">{t('subtitle')}</p>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="label">{t('email')}</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@example.com"
                  required
                />
              </div>

              <div>
                <label className="label">{t('password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors disabled:opacity-60"
              >
                {loading ? t('signingIn') : t('signIn')}
              </button>
            </form>

            <p className="mt-6 text-xs text-center text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              {t('demoHint')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
