import React, { useState } from 'react'
import axios from 'axios'

export default function BettingForm({ api, odds }){
  const [matchId, setMatchId] = useState('')
  const [stake, setStake] = useState('')
  const [oddsVal, setOddsVal] = useState('')
  const [msg, setMsg] = useState(null)

  function onMatchChange(e){
    const id = e.target.value
    setMatchId(id)
    const selected = odds.find(o=>o.matchId===id)
    if(selected) setOddsVal(String(selected.odds))
    else setOddsVal('')
  }

  async function place(e){
    e.preventDefault()
    try{
      const token = localStorage.getItem('eg_token')
      const resp = await axios.post(`${api}/bets`, { matchId, stake: Number(stake), odds: Number(oddsVal) }, { headers: { Authorization: `Bearer ${token}` }})
      setMsg('Bet placed!')
    }catch(err){
      setMsg(err?.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Place a Bet</h3>
      <form onSubmit={place} className="space-y-2">
        <select className="w-full p-2 border rounded" value={matchId} onChange={onMatchChange}>
          <option value="">Select match</option>
          {odds.map(o=> <option key={o.matchId} value={o.matchId}>{o.teams} ({o.odds})</option>)}
        </select>
        <input className="w-full p-2 border rounded" placeholder="Stake" value={stake} onChange={e=>setStake(e.target.value)} />
        <input className="w-full p-2 border rounded bg-slate-50" placeholder="Odds" value={oddsVal} readOnly />
        <button className="px-4 py-2 bg-sky-600 text-white rounded">Place Bet</button>
        {msg && <div className="text-sm text-slate-600">{msg}</div>}
      </form>
    </div>
  )
}
