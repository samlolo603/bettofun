import React from 'react'

export default function OddsList({ odds, loading }){
  if (loading) return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-xl p-6 mb-6">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-primary-700 rounded w-3/4"></div>
          <div className="h-4 bg-primary-700 rounded"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-gold-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-white">Live Matches</h2>
        <span className="ml-auto flex items-center gap-2 text-gold-400 text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live
        </span>
      </div>
      <ul className="space-y-3">
        {odds.length === 0 ? (
          <li className="text-primary-300 p-4 text-center bg-primary-800/50 rounded-xl">
            No matches available at the moment
          </li>
        ) : odds.map(o=> (
          <li key={o.matchId} className="flex justify-between items-center p-4 bg-primary-700/50 hover:bg-primary-700 rounded-xl transition-all duration-200 border border-primary-600/50 hover:border-gold-500/50 cursor-pointer group">
            <div className="flex-1">
              <div className="font-semibold text-white text-lg group-hover:text-gold-400 transition-colors">{o.teams}</div>
              <div className="text-primary-300 text-sm mt-1">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(o.start).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-400">{o.odds}x</div>
              <div className="text-primary-400 text-xs">Odds</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}