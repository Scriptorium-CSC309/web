import type { NextApiRequest, NextApiResponse } from "next";
import hideCommentHandler from "@/src/comments/[id]/hide-comment";

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: Hide a Comment
 *     description: Hides or reveals a specific comment by its ID. Only accessible to authenticated users with admin privileges.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to hide or reveal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isHidden:
 *                 type: boolean
 *                 description: Set to true to hide the comment, false to reveal it.
 *           example:
 *             isHidden: true
 *     responses:
 *       200:
 *         description: Comment visibility updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment visibility set successfully"
 *       400:
 *         description: Bad Request - Invalid input or missing fields.
 *         content:
 *           application/json:
 *             example:
 *               error: "isHidden is required and must be a boolean"
 *       404:
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Comment not found"
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
    if (req.method === "PATCH") {
        return hideCommentHandler(req, res);
    } else {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
