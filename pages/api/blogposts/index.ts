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
 *     summary: Retrieve Blog Posts
 *     description: Fetches a list of blog posts with optional filters for pagination, search, tags, and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter blog posts by title, content, or description.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: List of tags to filter blog posts.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [valued, controversial]
 *         description: Sort by valued (upvotes) or controversial (upvotes and downvotes).
 *     responses:
 *       200:
 *         description: A list of blog posts with pagination data.
 *         content:
 *           application/json:
 *             example:
 *               posts: [
 *                 {
 *                   id: 1,
 *                   title: "My First Blog Post",
 *                   description: "A description of my blog post.",
 *                   content: "Full content of my blog post.",
 *                   postedAt: "2024-11-03T10:00:00Z",
 *                   tags: ["tech", "news"],
 *                   user: { id: 5, username: "user1" }
 *                 }
 *               ]
 *               total: 1
 *               page: 1
 *               pageSize: 10
 *       400:
 *         description: Bad Request - Invalid pagination or filtering parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid parameters: page must be at least 1."
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 *   post:
 *     summary: Create a New Blog Post
 *     description: Allows authenticated users to create a new blog post with title, description, content, and tags.
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
 *             title: "New Blog Post"
 *             description: "An overview of the new post"
 *             content: "Here is the full content of the new blog post."
 *             tags: ["news", "update"]
 *     responses:
 *       200:
 *         description: Blog post created successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               title: "New Blog Post"
 *               description: "An overview of the new post"
 *               content: "Here is the full content of the new blog post."
 *               postedAt: "2024-11-05T12:00:00Z"
 *               tags: ["news", "update"]
 *       400:
 *         description: Bad Request - Missing required fields.
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required fields"
 *       401:
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
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
