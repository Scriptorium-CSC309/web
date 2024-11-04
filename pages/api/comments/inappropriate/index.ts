import type { NextApiRequest, NextApiResponse } from "next";
import getInnapropriateCommentsInteractor from "@/src/comments/inappropriate/get-innappropriate-comments";

/**
 * @swagger
 * /api/comments/inappropriate:
 *   get:
 *     summary: Get Inappropriate Comments
 *     description: Retrieves a list of comments marked as inappropriate.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of inappropriate comments
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
