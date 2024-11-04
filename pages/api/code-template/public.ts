import type { NextApiRequest, NextApiResponse } from "next";
import getCodeTemplatesInteractor from "@/src/code-template/fetch-code-templates";

/**
 * @swagger
 * /api/code-template/public:
 *   get:
 *     summary: Get Public Code Templates
 *     description: Fetches a list of public code templates with optional filters for title, code, tags, and pagination.
 *     tags:
 *       - CodeTemplate
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
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Tags to filter the code templates.
 *         example: ["JavaScript", "React"]
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: The title to filter the code templates.
 *         example: "My Code Template"
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: The code to filter the code templates.
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
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request data."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
       return getCodeTemplatesInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;