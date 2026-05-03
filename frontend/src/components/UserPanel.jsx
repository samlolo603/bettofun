import React from 'react'

export default function UserPanel({ user }){
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold">User Panel</h3>
      {user ? (
        <div>
          <div className="mt-2">Name: {user.name}</div>
          <div className="mt-1">Balance: ${user.balance?.toFixed(2) || 0}</div>
        </div>
      ) : (
        <div className="mt-2">Sign in to view balance and history.</div>
      )}
    </div>
  )
}
