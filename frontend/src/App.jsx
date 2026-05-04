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
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    
    if (token && userParam) {
      localStorage.setItem('eg_token', token)
      localStorage.setItem('eg_user', userParam)
      try {
        setUser(JSON.parse(userParam))
      } catch(e) {}
      window.history.replaceState({}, document.title, '/')
    }
  },[])

  useEffect(()=>{
    const fetchOdds = async () => {
      try {
        const r = await axios.get(`${API}/odds`)
        setOdds(r.data.data || [])
      } catch(err) {
        console.error('Failed to load odds:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOdds()
    
    const savedUser = localStorage.getItem('eg_user')
    if(savedUser){
      try {
        setUser(JSON.parse(savedUser))
      } catch(e) {
        localStorage.removeItem('eg_user')
      }
    }
  },[])

  function handleLogin(userData) {
    setUser(userData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950">
      <Navbar user={user} onLogin={handleLogin} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OddsList odds={odds} loading={loading} />
            <BettingForm api={API} odds={odds} />
          </div>
          <aside className="lg:col-span-1">
            <UserPanel user={user} onLogin={handleLogin} />
          </aside>
        </div>
      </main>

      <footer className="border-t border-primary-800 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-primary-400 text-sm">
          <p>&copy; 2026 EasyGame. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}