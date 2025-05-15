import React, { useState, useEffect } from 'react'

/**
 * Displays a countdown to `targetTimestamp`. Hides itself if not Live.
 *
 * @param {number} targetTimestamp – UNIX time (seconds) stage ends
 * @param {string} saleStatus      – 'Coming Soon' | 'Live' | 'Ended' | 'TBA'
 */
export function CountdownTimer({ targetTimestamp, saleStatus }) {
  // Only show timer if sale is Live
  if (saleStatus !== 'Live') return null

  const calcMsLeft = () => {
    const diff = targetTimestamp * 1000 - Date.now()
    return diff > 0 ? diff : 0
  }

  const [msLeft, setMsLeft] = useState(calcMsLeft())

  useEffect(() => {
    if (msLeft === 0) return
    const id = setInterval(() => {
      const tl = calcMsLeft()
      setMsLeft(tl)
      if (tl === 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [targetTimestamp, msLeft])

  const totalSec = Math.floor(msLeft / 1000)
  const days    = Math.floor(totalSec / 86400)
  const hours   = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  return (
    <div className="timer-container">
      <h3>Time Left This Stage</h3>
      <div className="timer">
        {msLeft > 0
          ? `${days}d ${hours}h ${minutes}m ${seconds}s`
          : `Stage ended`}
      </div>
    </div>
  )
}
