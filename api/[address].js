// api/proofs/[address].js

import proofs from '../../data/proofs.json'  // whatever path your proofs.json lives

export default function handler(req, res) {
  const { address } = req.query
  const proof = proofs[address.toLowerCase()] || []
  return res.status(200).json({ proof })
}
