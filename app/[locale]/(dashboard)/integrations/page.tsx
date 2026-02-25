import { getTranslations } from 'next-intl/server'
import { Mail, Calendar, CheckCircle2, Lock, Inbox, Clock } from 'lucide-react'

export default async function IntegrationsPage() {
  const t = await getTranslations('integrations')

  const mockEmails = [
    { from: 'james.m@email.com', subject: 'Re: 245 Park Ave showing', time: '10:32 AM', read: false },
    { from: 'sarah.chen@email.com', subject: 'Question about the Brooklyn listing', time: '9:15 AM', read: true },
    { from: 'r.davis@email.com', subject: 'Offer update — Upper West Side', time: 'Yesterday', read: true },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy-700">{t('title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Gmail */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-gray-800">{t('gmail.name')}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 max-w-md">{t('gmail.description')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-amber-50 text-amber-600">{t('gmail.comingSoon')}</span>
                  <button disabled className="btn-primary opacity-50 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    {t('gmail.connect')}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Read-only access</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-log emails as activities</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No data stored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-gray-800">{t('calendar.name')}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 max-w-md">{t('calendar.description')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-amber-50 text-amber-600">{t('calendar.comingSoon')}</span>
                  <button disabled className="btn-primary opacity-50 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    {t('calendar.connect')}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sync showings automatically</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Follow-up reminders</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Read-only access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview mock email feed */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Inbox className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-700">{t('preview.title')}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">{t('preview.subtitle')}</p>

        <div className="space-y-2">
          {mockEmails.map((email, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                email.read ? 'border-gray-100 bg-white' : 'border-navy-100 bg-navy-50/30'
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${email.read ? 'bg-gray-200' : 'bg-navy-700'}`} />
              <div className="flex-1 min-w-0">
                <span className={`text-sm truncate block ${email.read ? 'text-gray-600' : 'font-medium text-gray-800'}`}>
                  {email.subject}
                </span>
                <span className="text-xs text-gray-400 truncate block">{email.from}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {email.time}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-400">Connect Gmail above to see your real client emails here</p>
        </div>
      </div>
    </div>
  )
}
