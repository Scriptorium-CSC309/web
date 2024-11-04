import { AuthenticatedRequest } from "@/src/auth/utils";
import getBlogPostsInteractor from "@/src/blogposts/get-blogposts";
import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import {withAuth} from "@/src/auth/middleware";
import { isAuthenticatedRequest } from "@/src/utils";

/**
 * @swagger
 * /api/blogposts:
 *   get:
 *     summary: Get Blog Posts
 *     description: Fetches a list of blog posts with optional filters.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["tech", "news"]
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         example: "My Blog Post Title"
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         example: "Some content"
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogPosts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Create a Blog Post
 *     description: Creates a new blog post and saves it to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             title: "My New Blog Post"
 *             description: "An overview of my new post"
 *             content: "Here is the detailed content of my blog post."
 *             tags: ["tech", "news"]
 *     responses:
 *       200:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Bad Request (Missing required fields)
 *       500:
 *         description: Internal Server Error
 */


const addBlogPost = withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const { title, description, content, tags } = req.body;
    
    // Check for missing fields
    if (!title || !description || !content || !tags) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const userId = Number(req.user.userId);

        if (isNaN(userId)) {
            console.error("Invalid user ID:", userId);
            return res.status(400).json({ error: "Invalid user ID" });
        }
        // Create tags if they don't exist or connect if it does exist
        const BlogTagPromises = tags.map((tag: string) => {
            return prisma.blogPostTag.upsert({ 
                where: { name: tag },
                update: {},
                create: { name: tag },
            });
        }
        );
        const tagRecords = await Promise.all(BlogTagPromises);

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
                    connect: tagRecords.map((tag) => ({ id: tag.id })),
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
        return getBlogPostsInteractor(req, res);
    } else if (req.method === "POST") {
        await addBlogPost(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default handler;
