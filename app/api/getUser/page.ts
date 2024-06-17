import { auth } from '@/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   // Your logic to retrieve the session user data
   const session = await auth() // Example: Assuming the user object is stored in the session

   if (!session?.user) {
      return res.status(401).json({ error: 'User not authenticated' })
   }

   return res.status(200).json({ session })
}
