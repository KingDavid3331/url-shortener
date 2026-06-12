import { useEffect, useState } from 'react';
import { apiFetch, clearToken } from '../api/client';
import LinkRow from '../components/LinkRow';
import AnalyticsChart from '../components/AnalyticsChart';

export default function Dashboard({ onLogout }) {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { loadLinks(); }, []);

  async function loadLinks() {
    const data = await apiFetch('/links');
    setLinks(data);
  }

  async function handleShorten(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    try {
      await apiFetch('/links', { method: 'POST', body: JSON.stringify({ originalUrl: url }) });
      setUrl('');
      loadLinks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await apiFetch(`/links/${id}`, { method: 'DELETE' });
    if (selectedId === id) { setSelectedId(null); setAnalytics(null); }
    loadLinks();
  }

  async function handleSelect(id) {
    setSelectedId(id);
    const data = await apiFetch(`/links/${id}/analytics`);
    setAnalytics(data);
  }

  function handleLogout() {
    clearToken();
    onLogout();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">URL Shortener</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
          Log Out
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
        <form onSubmit={handleShorten} className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            Shorten
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Your Links</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 uppercase">
                  <th className="pb-2 px-3">Original URL</th>
                  <th className="pb-2 px-3">Code</th>
                  <th className="pb-2 px-3">Clicks</th>
                  <th className="pb-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <LinkRow
                    key={link.id}
                    link={link}
                    onDelete={handleDelete}
                    onSelect={handleSelect}
                    isSelected={selectedId === link.id}
                  />
                ))}
              </tbody>
            </table>
            {links.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No links yet.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              {analytics ? 'Analytics' : 'Select a link to view analytics'}
            </h2>
            {analytics && <AnalyticsChart {...analytics} />}
          </div>
        </div>
      </main>
    </div>
  );
}
