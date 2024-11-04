import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import saveCodeTemplateInteractor from "@/src/code-template/save-code-template";
import type { NextApiResponse } from "next";
import getCodeTemplatesInteractor from "@/src/code-template/fetch-code-templates";

/**
 * @swagger
 * /api/code-templates:
 *   get:
 *     summary: Get Code Templates
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
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Save Code Template
 *     description: Creates a new code template.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             title: "My New Template"
 *             code: "console.log('Hello, World!');"
 *             tags: ["JavaScript", "Logging"]
 *     responses:
 *       201:
 *         description: Code template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 code:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
       return getCodeTemplatesInteractor(req, res);
    } else if (req.method === "POST") {
        return saveCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default withAuth(handler);
