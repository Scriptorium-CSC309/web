import type { NextApiRequest, NextApiResponse } from "next";
import reportCommentHandler from "@/src/comments/[id]/report-comment";

/**
 * @swagger
 * /api/comments/{id}/reports:
 *   post:
 *     tags: [Comments]
 *     summary: Report a Comment
 *     description: Allows an authenticated user to report a comment by its ID, providing an explanation for the report.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to report.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               explanation:
 *                 type: string
 *                 description: Reason for reporting the comment (minimum 10 characters).
 *           example:
 *             explanation: "This comment contains inappropriate language."
 *     responses:
 *       201:
 *         description: Comment reported successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment reported successfully"
 *       400:
 *         description: Bad Request - Missing or invalid fields (e.g., explanation too short).
 *         content:
 *           application/json:
 *             example:
 *               error: "Explanation is required and must be at least 10 characters long"
 *       404:
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Comment not found"
 *       409:
 *         description: Conflict - Comment already reported by the user.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have already reported this comment"
 *       500:
 *         description: Internal Server Error - Unexpected failure.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return reportCommentHandler(req, res);
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
