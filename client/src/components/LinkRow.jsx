export default function LinkRow({ link, onDelete, onSelect, isSelected }) {
  const shortUrl = `http://localhost:4000/${link.shortCode}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(shortUrl);
  }

  return (
    <tr
      className={`border-b hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={() => onSelect(link.id)}
    >
      <td className="py-2 px-3 text-sm text-gray-600 truncate max-w-[200px]">
        {link.originalUrl}
      </td>
      <td className="py-2 px-3 text-sm font-mono text-blue-600">{link.shortCode}</td>
      <td className="py-2 px-3 text-sm text-gray-500">{link._count?.clicks ?? 0}</td>
      <td className="py-2 px-3 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
          className="text-xs text-blue-600 hover:underline"
        >
          Copy
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(link.id); }}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
