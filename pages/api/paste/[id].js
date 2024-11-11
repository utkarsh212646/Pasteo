import { connectToDatabase } from '@/lib/mongodb'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query

    try {
      const { db } = await connectToDatabase()
      const pastes = db.collection('pastes')

      const paste = await pastes.findOne({ _id: id })

      if (!paste) {
        return res.status(404).json({ error: 'Paste not found' })
      }

      // Check if the paste has expired
      if (paste.expiration && new Date() > new Date(paste.expiration)) {
        await pastes.deleteOne({ _id: id })
        return res.status(404).json({ error: 'Paste has expired' })
      }

      res.status(200).json(paste)
    } catch (error) {
      console.error('Error fetching paste:', error)
      res.status(500).json({ error: 'Failed to fetch paste' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
