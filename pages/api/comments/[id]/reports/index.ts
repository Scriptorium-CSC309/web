import type { NextApiRequest, NextApiResponse } from "next";
import reportCommentHandler from "@/src/comments/[id]/report-comment";

/**
 * @swagger
 * /api/comments/{id}/reports:
 *   post:
 *     summary: Report a Comment
 *     description: Allows a user to report a comment by its ID, providing an explanation for the report.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               explanation:
 *                 type: string
 *                 description: Reason for reporting the comment
 *           example:
 *             explanation: "This comment is inappropriate."
 *     responses:
 *       200:
 *         description: Comment reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report submitted successfully"
 *       400:
 *         description: Bad Request (Missing required fields)
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
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
