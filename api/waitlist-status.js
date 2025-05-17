// api/waitlist-status.js
import Airtable from 'airtable'

const BASE_ID    = process.env.AIRTABLE_BASE_ID
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME
const API_KEY    = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN

Airtable.configure({ apiKey: API_KEY })
const base = Airtable.base(BASE_ID)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { address } = req.body
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid address' })
  }
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `{Address}='${address}'`,
        maxRecords: 1
      })
      .firstPage()
    return res.status(200).json({ already: records.length > 0 })
  } catch (err) {
    console.error('❌ waitlist-status error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
