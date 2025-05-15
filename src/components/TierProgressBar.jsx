import React from 'react'

/**
 * Renders a per-stage progress bar matching your original CSS.
 *
 * @param {number} totalSold     – cumulative tokens sold so far
 * @param {number[]} caps        – array of cumulative caps per stage
 * @param {number} saleStart     – UNIX timestamp when current stage starts
 * @param {string} saleStatus    – 'Coming Soon' | 'Live' | 'Ended' | 'TBA'
 */
export function TierProgressBar({ totalSold, caps, saleStart, saleStatus }) {
  // Only show bar if sale is Live
  if (saleStatus !== 'Live') return null

  // Find current stage index
  const stageIndex = caps.findIndex(cap => totalSold <= cap)
  const currentCap = caps[stageIndex] || caps[caps.length - 1]
  const prevCap    = stageIndex > 0 ? caps[stageIndex - 1] : 0

  // In-stage sold and percent
  const inStageSold = Math.max(0, Math.min(totalSold - prevCap, currentCap - prevCap))
  const inStageMax  = currentCap - prevCap
  const pct         = inStageMax > 0 ? (inStageSold / inStageMax) * 100 : 0

  return (
    <div className="presale-progress">
      <div className="progress-header">
        <h3>Stage {stageIndex + 1}</h3>
        <h3>{pct.toFixed(0)}%</h3>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
    </div>
  )
}
