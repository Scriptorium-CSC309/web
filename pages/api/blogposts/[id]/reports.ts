import type { NextApiRequest, NextApiResponse } from "next";
import reportBlogPostHandler from "@/src/blogposts/[id]/report-blogpost";

/**
 * @swagger
 * /api/blogposts/{id}/reports:
 *   post:
 *     tags: [blogposts]
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
 *                 description: Reason for reporting the blog post (minimum 10 characters)
 *           example:
 *             explanation: "This post contains inappropriate content."
 *     responses:
 *       201:
 *         description: Blog post reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog post reported successfully"
 *       400:
 *         description: Bad Request - Missing or invalid fields (e.g., explanation too short)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Explanation must be at least 10 characters long"
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
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Blog post not found"
 *       409:
 *         description: Conflict - Blog post already reported by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You have already reported this blog post"
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

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return reportBlogPostHandler(req, res);
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
