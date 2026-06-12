import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsChart({ data, totalClicks, topReferrers }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Total Clicks</p>
        <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {topReferrers.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Top Referrers</p>
          <ul className="space-y-1">
            {topReferrers.map((r) => (
              <li key={r.referrer} className="flex justify-between text-sm">
                <span className="text-gray-600">{r.referrer}</span>
                <span className="font-medium text-gray-900">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
