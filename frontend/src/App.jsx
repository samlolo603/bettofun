import React, { useState, useEffect } from 'react'
import OddsList from './components/OddsList'
import BettingForm from './components/BettingForm'
import UserPanel from './components/UserPanel'
import Navbar from './components/Navbar'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function App(){
  const [odds, setOdds] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    axios.get(`${API}/odds`)
      .then(r=>setOdds(r.data.data))
      .catch(err=>console.error('Failed to load odds:', err))
      .finally(()=>setLoading(false));
    const saved = localStorage.getItem('eg_token')
    if(saved){
      // optionally fetch user profile
    }
  },[])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto p-4">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <OddsList odds={odds} loading={loading} />
            <BettingForm api={API} odds={odds} />
          </div>
          <aside>
            <UserPanel user={user} />
          </aside>
        </section>
      </main>
    </div>
  )
}
