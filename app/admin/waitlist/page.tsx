import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

type WaitlistEntry = {
  email: string
  timestamp: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function WaitlistAdminPage() {
  const filePath = path.join(process.cwd(), 'data', 'waitlist.json')
  let entries: WaitlistEntry[] = []
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    entries = JSON.parse(raw)
  } catch {
    // file doesn't exist yet — show empty state
  }
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="min-h-screen bg-[#fefcf8] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-[#a07850] mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl text-[#2c1f0e]">Waitlist</h1>
          <p className="mt-1 font-sans text-sm text-[#7a6651]">
            {entries.length} {entries.length === 1 ? 'person' : 'people'} signed up
          </p>
        </div>

        <div className="rounded-[0.8rem] border border-[#e8ddd0] overflow-hidden">
          {sorted.length === 0 ? (
            <div className="px-6 py-10 text-center font-sans text-sm text-[#a07850]">
              No signups yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8ddd0] bg-[#f7f1e8]">
                  <th className="px-5 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-[#7a6651]">
                    Email
                  </th>
                  <th className="px-5 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wider text-[#7a6651]">
                    Signed up (PT)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry, i) => (
                  <tr
                    key={entry.email}
                    className={`${i !== sorted.length - 1 ? 'border-b border-[#e8ddd0]' : ''} hover:bg-[#fdf8f2] transition-colors`}
                  >
                    <td className="px-5 py-3.5 font-sans text-sm text-[#2c1f0e]">
                      <a
                        href={`mailto:${entry.email}`}
                        className="hover:text-[#a07850] transition-colors"
                      >
                        {entry.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-right font-sans text-sm text-[#7a6651] tabular-nums">
                      {formatDate(entry.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
