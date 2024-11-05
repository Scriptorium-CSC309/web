import type { NextApiRequest, NextApiResponse } from "next";
import getInnapropriateCommentsInteractor from "@/src/comments/inappropriate/get-innappropriate-comments";

/**
 * @swagger
 * /api/comments/inappropriate:
 *   get:
 *     summary: Get Inappropriate Comments
 *     description: Retrieves a list of comments marked as inappropriate, including a count of reports for each comment. Only accessible to authenticated users with admin privileges.
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
 *         description: The number of items per page.
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *         description: Sort order for comments based on the report count.
 *         example: "desc"
 *     responses:
 *       200:
 *         description: A list of inappropriate comments with pagination data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       postedAt:
 *                         type: string
 *                         format: date-time
 *                       userId:
 *                         type: integer
 *                       postId:
 *                         type: integer
 *                       isHidden:
 *                         type: boolean
 *                       upvotes:
 *                         type: integer
 *                       downvotes:
 *                         type: integer
 *                       reportCount:
 *                         type: integer
 *                         description: Number of reports for the comment.
 *                 total:
 *                   type: integer
 *                   description: Total number of inappropriate comments.
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                 pageSize:
 *                   type: integer
 *                   description: Number of comments per page.
 *             example:
 *               comments: [
 *                 {
 *                   id: 1,
 *                   content: "Inappropriate comment example",
 *                   postedAt: "2024-11-05T10:00:00Z",
 *                   userId: 5,
 *                   postId: 10,
 *                   isHidden: false,
 *                   upvotes: 2,
 *                   downvotes: 3,
 *                   reportCount: 5
 *                 },
 *                 {
 *                   id: 2,
 *                   content: "Another inappropriate comment",
 *                   postedAt: "2024-11-05T11:15:00Z",
 *                   userId: 6,
 *                   postId: 12,
 *                   isHidden: true,
 *                   upvotes: 4,
 *                   downvotes: 1,
 *                   reportCount: 3
 *                 }
 *               ]
 *               total: 20
 *               page: 1
 *               pageSize: 10
 *       400:
 *         description: Bad Request - Invalid query parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid page or pageSize value"
 *       401:
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       403:
 *         description: Forbidden - Admin access required.
 *         content:
 *           application/json:
 *             example:
 *               error: "Forbidden: Admin access required"
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */


function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return getInnapropriateCommentsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
