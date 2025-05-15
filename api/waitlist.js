// api/waitlist.js
import Airtable from 'airtable'

// Configure Airtable with your new PAT
Airtable.configure({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
})
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)


export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { address, email } = req.body

    // Basic validation
    if (
      typeof address !== 'string' ||
      !/^0x[a-fA-F0-9]{40}$/.test(address) ||
      typeof email !== 'string' ||
      !email.includes('@')
    ) {
      return res.status(400).json({ error: 'Invalid address or email' })
    }

    // Persist to Airtable using PAT
    await base(process.env.AIRTABLE_TABLE_NAME).create([
      { fields: { Address: address, Email: email } }
    ])
    
    console.log('📥 New waitlist signup:', { address, email })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('❌ waitlist handler error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
