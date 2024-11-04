import type {NextApiResponse } from "next";
import prisma from "@/prisma";
import { AuthenticatedRequest } from "@/src/auth/utils";
import { withAuth } from "@/src/auth/middleware";

/**
 * @swagger
 * /api/blogposts/{id}/reports:
 *   post:
 *     summary: Report a Blog Post
 *     description: Allows an authenticated user to report a blog post by its ID with an explanation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               explanation:
 *                 type: string
 *                 description: Reason for reporting the blog post
 *           example:
 *             explanation: "This post contains inappropriate content."
 *     responses:
 *       200:
 *         description: Blog post reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reported successfully"
 *       400:
 *         description: Bad Request (Missing required fields)
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal Server Error
 */


const reportBlogPost = withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // Only allow POST method
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;
    const { explanation } = req.body;
    const reporterId = Number(req.user.userId);

    // Validate blog post ID and explanation
    if (!id || !explanation) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if the blog post exists
        const blogPost = await prisma.blogPost.findUnique({
            where: { id: Number(id) },
        });
        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }

        // Create a report
        await prisma.blogPostReport.create({
            data: {
                reporterId,
                blogPostId: Number(id),
                explanation,
                reportedAt: new Date(),
            },
        });

        res.status(200).json({ message: "Reported successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
export default reportBlogPost;
