import React from 'react'

export default function Navbar({ user }){
  return (
    <header className="bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-primary-900 font-bold text-xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Easy<span className="text-gold-400">Game</span>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-primary-800/50 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                <span className="text-primary-900 font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-medium">{user.name}</span>
            </div>
          ) : (
            <button className="bg-gold-500 hover:bg-gold-400 text-primary-900 font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}