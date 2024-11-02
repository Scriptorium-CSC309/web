import { AuthenticatedRequest } from "@/src/auth/utils";
import getBlogPostsInteractor from "@/src/blogposts/get-blogposts";
import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import {withAuth} from "@/src/auth/middleware";

const addBlogPost = withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const { title, description, content, tags } = req.body;
    
    // Check for missing fields
    if (!title || !description || !content || !tags) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const userId = Number(req.user.userId);
        console.log("userId from req.user:", userId);  // Debugging log

        if (isNaN(userId)) {
            console.error("Invalid user ID:", userId);
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const blogpost = await prisma.blogPost.create({
            data: {
                title,
                description,
                content,
                postedAt: new Date(),
                user: {
                    connect: { id: userId }
                },
                tags: {
                    create: tags.map((tag: string) => ({ name: tag })),
                },
            },
        });

        res.status(200).json(blogpost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        getBlogPostsInteractor(req, res);
    } else if (req.method === "POST") {
        await addBlogPost(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default handler;
