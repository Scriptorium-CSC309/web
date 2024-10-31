import prisma from "@/prisma";
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { withAuth } from '@/src/auth/middleware';

//authenticate user using the middleware
interface AuthenticatedRequest extends NextApiRequest {
  user: {
    userId: string;
    isAdmin: boolean;
  }
}

  const createBlogPost= async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { title, description, content, tags = [] } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      //Cast userID to number before adding to prisma since middleware is defined as string
      const userId = Number(req.user.userId);

        //create a blog post and link it to the user
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          description,
          content,
          postedAt: new Date(),
          user: { connect: { id: Number(req.user.userId)} },
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
  };
  export default withAuth(createBlogPost as NextApiHandler);     
