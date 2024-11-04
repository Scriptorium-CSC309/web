import type { NextApiRequest, NextApiResponse } from "next";
import voteOnCommentInteractor from "@/src/comments/[id]/vote-on-comments"

/**
 * @swagger
 * /api/comments/{id}/vote:
 *   post:
 *     summary: Vote on a Comment
 *     description: Allows a user to upvote or downvote a comment by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteType:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: The type of vote (upvote or downvote)
 *           example:
 *             voteType: "upvote"
 *     responses:
 *       200:
 *         description: Vote registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote registered successfully"
 *       400:
 *         description: Bad Request (Missing or invalid vote type)
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
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
