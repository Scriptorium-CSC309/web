import createCommentsInteractor from "@/src/comments/create-comments";
import getCommentsInteractor from "@/src/comments/get-comments";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get Comments
 *     description: Retrieves a list of comments with optional filters for pagination.
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
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 * 
 *   post:
 *     summary: Create a Comment
 *     description: Creates a new comment on a specified blog post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: integer
 *                 description: ID of the blog post to comment on
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *           example:
 *             postId: 1
 *             content: "This is a comment on the blog post."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad Request (Missing required fields)
 *       500:
 *         description: Internal Server Error
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
