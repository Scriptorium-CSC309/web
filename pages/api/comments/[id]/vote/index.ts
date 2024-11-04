import type { NextApiRequest, NextApiResponse } from "next";
import voteOnCommentInteractor from "@/src/comments/[id]/vote-on-comments"

/**
 * @swagger
 * /api/comments/{id}/vote:
 *   post:
 *     summary: Vote on a Comment
 *     description: Allows an authenticated user to upvote or downvote a specific comment by its ID. Changing an existing vote is supported.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to vote on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: Type of vote (upvote or downvote).
 *           example:
 *             type: "upvote"
 *     responses:
 *       200:
 *         description: Vote registered or updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment upvoted successfully"
 *                 upvotes:
 *                   type: integer
 *                   example: 5
 *                 downvotes:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Bad Request - Invalid vote type or attempt to vote the same way again.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have already upvoted this comment"
 *       403:
 *         description: Forbidden - Voting is not allowed on hidden comments.
 *         content:
 *           application/json:
 *             example:
 *               error: "You cannot vote on hidden comments"
 *       404:
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Comment not found"
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */


function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return voteOnCommentInteractor(req, res);
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
