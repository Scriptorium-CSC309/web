import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from "@/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from 'http2';
// Helper function to authenticate using JWT (ChatGPT)
const authenticate = (req: NextApiRequest): JwtPayload | null => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
  
    // Verify the JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        if (typeof decoded === 'object' && 'id' in decoded) {
          return decoded as JwtPayload & { id: number };
        }
        return null;
      } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
      }
    };
  export default async function createBlogPost(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  
    const user = authenticate(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
  
    const { title, description, content, tags = [] } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
        //create a blog post and link it to the user
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          description,
          content,
          postedAt: new Date(),
          user: { connect: { id: user.id } },
          tags: {
            connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
                })),
            },
        },
        include: { tags: true },
        });
         res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    }