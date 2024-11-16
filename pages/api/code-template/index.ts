import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import saveCodeTemplateInteractor from "@/src/code-template/save-code-template";
import type { NextApiResponse } from "next";
import getCodeTemplatesInteractor from "@/src/code-template/fetch-code-templates";

/**
 * @swagger
 * /api/code-templates:
 *   get:
 *     tags: [code-template]
 *     summary: Get User's Own Code Templates for Authenticated User
 *     description: Fetches a list of code templates with optional filters for title, code, tags, and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["C"]
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           example: "Hello Mars"
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *           example: "printf('%s', \"hello Mars\")"
 *     responses:
 *       '200':
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Hello Mars"
 *                       description:
 *                         type: string
 *                         example: "A simple Hello Mars program"
 *                       code:
 *                         type: string
 *                         example: "printf('%s', \"hello Mars\")"
 *                       language:
 *                         type: string
 *                         example: "C"
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Rodrigo Hernández Cascante 1"
 *                           email:
 *                             type: string
 *                             example: "Rodrigo1@example.com"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "beginner"
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
 *   post:
 *     tags: [code-template]
 *     summary: Save Code Template
 *     description: Creates a new code template.
 *     requestBody:
 *       required: true
 *       description: language must be one of ["C++", "C", "Python", "Java", "JS"]
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
 *               description:
 *                 type: string
 *               language:
 *                 type: string
 *                 description: language must be one of ["C++", "C", "Python", "Java", "JS"]
 *           example:
 *             title: "My New Template"
 *             description: "This is a new code template"
 *             code: "console.log('Hello, World!');"
 *             tags: ["JavaScript", "Logging"]
 *             language: "JS"
 *     responses:
 *       200:
 *         description: Code template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code template created successfully."
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "<field> is required."
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
