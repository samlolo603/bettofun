import React from 'react'

export default function Navbar({ user }){
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Easy Game</h1>
        <nav>
          {user ? <span>Hi, {user.name}</span> : <a href="#" className="text-sm text-sky-600">Sign in</a>}
        </nav>
      </div>
    </header>
  )
}
