import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma'; // Path to your Prisma client

/**
 * Handles fetching a blog post by ID and responding to the client.
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 */
 async function getBlogPostById(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid blogpost ID' });
    }

    try {
        const blogPost = await prisma.blogPost.findUnique({
            where: {
                id: Number(id), // Ensure `id` is a number; adjust based on your schema
            },
            include: {
                user: true, // Include user relation
                comments: true, // Include comments relation if applicable
                tags: true, // Include tags if it's a relation
            },
        });

        if (!blogPost) {
            return res.status(404).json({ error: 'Blogpost not found' });
        }

        return res.status(200).json(blogPost);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
export default getBlogPostById;