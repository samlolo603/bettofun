import React, { useState } from 'react'
import axios from 'axios'

export default function BettingForm({ api, odds }){
  const [matchId, setMatchId] = useState('')
  const [stake, setStake] = useState('')
  const [oddsVal, setOddsVal] = useState('')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState(null)

  function onMatchChange(e){
    const id = e.target.value
    setMatchId(id)
    const selected = odds.find(o=>o.matchId===id)
    if(selected) setOddsVal(String(selected.odds))
    else setOddsVal('')
  }

  async function place(e){
    e.preventDefault()
    setMsg(null)
    try{
      const token = localStorage.getItem('eg_token')
      const resp = await axios.post(`${api}/bets`, { matchId, stake: Number(stake), odds: Number(oddsVal) }, { headers: { Authorization: `Bearer ${token}` }})
      setMsg('Bet placed successfully!')
      setMsgType('success')
      setStake('')
      setMatchId('')
      setOddsVal('')
    }catch(err){
      setMsg(err?.response?.data?.message || 'Error placing bet')
      setMsgType('error')
    }
  }

  const potentialWin = stake && oddsVal ? (Number(stake) * Number(oddsVal)).toFixed(2) : '0.00'

  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-gold-500 rounded-full"></div>
        <h3 className="text-2xl font-bold text-white">Place Your Bet</h3>
      </div>
      
      <form onSubmit={place} className="space-y-4">
        <div>
          <label className="block text-primary-200 text-sm mb-2">Select Match</label>
          <select 
            className="w-full p-4 bg-primary-700/50 border border-primary-600/50 rounded-xl text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
            value={matchId} 
            onChange={onMatchChange}
          >
            <option value="" className="bg-primary-900">Choose a match...</option>
            {odds.map(o=> <option key={o.matchId} value={o.matchId} className="bg-primary-900">{o.teams} - {o.odds}x</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-primary-200 text-sm mb-2">Stake Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400 font-semibold">$</span>
            <input 
              className="w-full p-4 pl-8 bg-primary-700/50 border border-primary-600/50 rounded-xl text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none placeholder-primary-500"
              placeholder="0.00" 
              value={stake} 
              onChange={e=>setStake(e.target.value)} 
              type="number"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-primary-200 text-sm mb-2">Odds</label>
          <input 
            className="w-full p-4 bg-primary-700/30 border border-primary-600/30 rounded-xl text-gold-400 font-bold" 
            placeholder="0.00" 
            value={oddsVal} 
            readOnly 
          />
        </div>

        <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-xl p-4 border border-gold-500/30">
          <div className="flex justify-between items-center">
            <span className="text-primary-200">Potential Win:</span>
            <span className="text-2xl font-bold text-gold-400">${potentialWin}</span>
          </div>
        </div>

        <button 
          className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-900 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Place Bet
        </button>
        
        {msg && (
          <div className={`p-4 rounded-xl text-center font-medium ${msgType === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {msg}
          </div>
        )}
      </form>
    </div>
  )
}