import type { NextApiRequest, NextApiResponse } from "next";
import getCodeTemplatesInteractor from "@/src/code-template/fetch-code-templates";

/**
 * @swagger
 * /api/code-templates:
 *   get:
 *     summary: Get User's Own Code Templates for Authenticated User
 *     description: Fetches a list of code templates with optional filters for title, code, tags, and pagination.
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
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["JavaScript", "React"]
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         example: "My Code Template"
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         example: "console.log('Hello, World!');"
 *     responses:
 *       200:
 *         description: A list of code templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codeTemplates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       code:
 *                         type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Method not allowed"
 * 
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 * 
 * 
 * */

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
       return getCodeTemplatesInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;