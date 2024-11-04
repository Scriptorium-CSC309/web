import type { NextApiRequest, NextApiResponse } from "next";
import hideCommentHandler from "@/src/comments/[id]/hide-comment";

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: Hide a Comment
 *     description: Hides a specific comment by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to hide
 *     responses:
 *       200:
 *         description: Comment hidden successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment hidden successfully"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 */

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        return hideCommentHandler(req, res);
    } else {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
