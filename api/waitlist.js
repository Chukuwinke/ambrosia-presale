// api/waitlist.js
import Airtable from 'airtable'

const BASE_ID    = process.env.AIRTABLE_BASE_ID
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME
const API_KEY    = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN

// Configure Airtable with your PAT
Airtable.configure({ apiKey: API_KEY })
const base = Airtable.base(BASE_ID)

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
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({ error: 'Invalid address or email' })
    }

    // 1) Check for existing record by Email OR Address
    const filter = `OR({Email}='${email}',{Address}='${address}')`
    const existing = await base(TABLE_NAME)
      .select({ filterByFormula: filter, maxRecords: 1 })
      .firstPage()

    if (existing.length > 0) {
      console.log('⚠️ Waitlist signup attempted but user already exists:', { address, email })
      return res.status(200).json({ already: true })
    }

    // 2) If not found, create new waitlist record
    await base(TABLE_NAME).create([
      { fields: { Address: address, Email: email } }
    ])
    console.log('📥 New waitlist signup:', { address, email })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('❌ waitlist handler error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
