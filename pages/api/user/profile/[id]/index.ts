// Fetch the profile of a user based on their ID
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma'; // Adjust the path to your Prisma instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  // Validate the ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  try {
    // Fetch only the user's name by ID
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure the ID is parsed as an integer
      select: {
        name: true, // Only fetch the name field
      },
    });

    // If user is not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's name
    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
