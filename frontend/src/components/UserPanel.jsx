import React, { useState } from 'react'
import AuthModal from './AuthModal'

export default function UserPanel({ user, onLogin }){
  const [showAuth, setShowAuth] = useState(false)
  
  return (
    <>
      <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl shadow-xl p-6 sticky top-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gold-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">My Account</h3>
        </div>
        
        {user ? (
          <div className="space-y-4">
            <div className="bg-primary-700/50 rounded-xl p-4 border border-primary-600/50">
              <div className="text-primary-300 text-sm mb-1">Balance</div>
              <div className="text-3xl font-bold text-gold-400">${user.balance?.toFixed(2) || '0.00'}</div>
            </div>
            
            <div className="bg-primary-700/50 rounded-xl p-4 border border-primary-600/50">
              <div className="text-primary-300 text-sm mb-1">Active Bets</div>
              <div className="text-white font-semibold text-xl">0</div>
            </div>

            <div className="space-y-2">
              <button className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-primary-900 font-semibold rounded-xl transition-all duration-200">
                Deposit
              </button>
              <button className="w-full py-3 bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 border border-primary-600">
                History
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('eg_token')
                  localStorage.removeItem('eg_user')
                  window.location.reload()
                }}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all duration-200 border border-red-500/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-primary-300 mb-4">Sign in to view your balance and betting history</p>
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-primary-900 font-semibold rounded-xl transition-all duration-200"
            >
              Login / Register
            </button>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLogin={onLogin}
      />
    </>
  )
}