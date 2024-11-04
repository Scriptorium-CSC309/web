import createCommentsInteractor from "@/src/comments/create-comments";
import getCommentsInteractor from "@/src/comments/get-comments";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get Comments
 *     description: Retrieves a list of comments for a specific blog post with optional pagination and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of comments per page.
 *         example: 10
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to retrieve comments for.
 *         example: 1
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [valued, controversial]
 *         description: Sorting option based on upvotes (valued) or both upvotes and downvotes (controversial).
 *     responses:
 *       200:
 *         description: A list of comments with pagination information.
 *         content:
 *           application/json:
 *             example:
 *               comments: [
 *                 {
 *                   id: 1,
 *                   content: "This is a comment on the blog post.",
 *                   postedAt: "2024-11-05T10:00:00Z",
 *                   user: {
 *                     id: 5,
 *                     name: "User Name",
 *                     email: "user@example.com"
 *                   },
 *                   upvotes: 5,
 *                   downvotes: 2
 *                 },
 *                 {
 *                   id: 2,
 *                   content: "Another insightful comment.",
 *                   postedAt: "2024-11-05T12:30:00Z",
 *                   user: {
 *                     id: 6,
 *                     name: "Another User",
 *                     email: "anotheruser@example.com"
 *                   },
 *                   upvotes: 3,
 *                   downvotes: 1
 *                 }
 *               ]
 *               total: 2
 *               page: 1
 *               pageSize: 10
 *       400:
 *         description: Bad Request - Invalid query parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid parameters: postId is required"
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 * 
 *   post:
 *     summary: Create a Comment
 *     description: Allows an authenticated user to create a new comment on a specified blog post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: integer
 *                 description: ID of the blog post to comment on.
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *           example:
 *             postId: 1
 *             content: "This is a comment on the blog post."
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comment created successfully"
 *       400:
 *         description: Bad Request - Missing required fields or validation errors.
 *         content:
 *           application/json:
 *             example:
 *               error: "content is required"
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Post not found"
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */



function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return createCommentsInteractor(req, res);
    } else if (req.method === "GET") {
        return getCommentsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
