import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export default function WaitlistModal({ isOpen, onClose, address }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'already' | 'success' | 'error' | 'loading'
  const [message, setMessage] = useState('')
  const dialogRef = useRef(null)

  // move focus to dialog when opened
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus()
    else {
      setEmail('')
      setStatus(null)
      setMessage('')
    }
  }, [isOpen])

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, email })
      })
      const json = await res.json()
      if (json.already) {
        setStatus('already')
        setMessage('You’re already on the waitlist.')
      } else {
        setStatus('success')
        setMessage('✅ You’ve joined the waitlist!')
      }
    } catch (err) {
      setStatus('error')
      setMessage(`❌ ${err.message}`)
    }
  }

  if (!isOpen) return null
  return (
    <div
      className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
        className="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-11/12 max-w-md"
        ref={dialogRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >×</button>
        <h2 id="waitlist-title" className="text-xl font-semibold mb-4">
          Join the Pantheon
        </h2>

        {status === 'loading' && (
          <p className="text-gray-600">Submitting…</p>
        )}

        {(status === null || status === 'error') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              disabled={status === 'loading'}
            >
              Submit
            </button>
          </form>
        )}

        {status && status !== 'loading' && (
          <p className={`mt-4 text-center ${status === 'success' ? 'text-green-600' : status === 'already' ? 'text-yellow-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

WaitlistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired
}
