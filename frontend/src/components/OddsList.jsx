import React from 'react'

export default function OddsList({ odds, loading }){
  if (loading) return <div className="bg-white rounded shadow p-4 mb-4"><p className="text-slate-500">Loading odds...</p></div>

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="font-semibold mb-2">Live Odds</h2>
      <ul className="space-y-2">
        {odds.length === 0 ? (
          <li className="text-slate-500 p-2">No odds available</li>
        ) : odds.map(o=> (
          <li key={o.matchId} className="flex justify-between items-center p-2 border rounded">
            <div>
              <div className="font-medium">{o.teams}</div>
              <div className="text-xs text-slate-500">Starts: {new Date(o.start).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{o.odds}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
