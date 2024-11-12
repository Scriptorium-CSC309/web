import type {NextApiResponse } from "next";
import prisma from "@/prisma";
import { AuthenticatedRequest } from "@/src/auth/utils";
import { withAuth } from "@/src/auth/middleware";

/**
 * @swagger
 * /api/blogposts/{id}/reports:
 *   post:
 *     summary: Report a Blog Post
 *     description: Allows an authenticated user to report a blog post by its ID, providing an explanation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the blog post to report.
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
 *         description: Bad Request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden: Admin access required"
 *       404:
 *         description: Not Found - Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Blog post not found"
 *       500:
 *         description: Internal Server Error - Unexpected failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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

        // Check if the user has already reported this blog post
        const existingReport = await prisma.blogPostReport.findFirst({
            where: {
                reporterId,
                blogPostId: Number(id),
            },
        });

        if (existingReport) {
            return res
                .status(409)
                .json({ error: "You have already reported this blog post" });
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

        res.status(201).json({ message: "Blog post reported successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
export default reportBlogPost;
