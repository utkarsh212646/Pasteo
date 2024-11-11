import { connectToDatabase } from '@/lib/mongodb'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase()
      const pastes = db.collection('pastes')

      const { content, language, expiration, customLink } = req.body

      // Generate a unique ID or use the custom link
      const id = customLink || crypto.randomBytes(4).toString('hex')

      // Check if the custom link already exists
      if (customLink) {
        const existingPaste = await pastes.findOne({ _id: id })
        if (existingPaste) {
          return res.status(400).json({ error: 'Custom link already exists' })
        }
      }

      // Calculate expiration date
      let expirationDate = null
      if (expiration !== 'never') {
        const expirationMap = { '1h': 3600, '1d': 86400, '1w': 604800 }
        expirationDate = new Date(Date.now() + expirationMap[expiration] * 1000)
      }

      // Insert the new paste
      const result = await pastes.insertOne({
        _id: id,
        content,
        language,
        expiration: expirationDate,
        createdAt: new Date(),
      })

      res.status(201).json({ id: result.insertedId })
    } catch (error) {
      console.error('Error saving paste:', error)
      res.status(500).json({ error: 'Failed to save paste' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
