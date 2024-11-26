import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import updateCodeTemplateInteractor from "@/src/code-template/[id]/update-code-template";
import deleteCodeTemplateInteractor from "@/src/code-template/[id]/delete-code-template";
import type { NextApiResponse } from "next";
import getCodeTemplateInteractor from "@/src/code-template/[id]/fetch-code-template";

/**
 * @swagger
 * /api/code-template/{id}:
 *   patch:
 *     tags: [code-template]
 *     summary: Update Code Template
 *     description: Updates an existing code template by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the code template to update.
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
 *                 description:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string 
 *           example:
 *             title: "Updated Template"
 *             code: "console.log('Updated Code');"
 *             tags: ["JavaScript", "Updated"]
 *     responses:
 *       200:
 *         description: Code template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code template updated successfully."
 *       404:
 *         description: Code template not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Code template not found." 
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
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
 *   delete:
 *     tags: [code-template]
 *     summary: Delete Code Template
 *     description: Deletes an existing code template by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *         type: string
 *         description: The ID of the code template to delete.
 *     responses:
 *       200:
 *         description: Code template deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Code template deleted successfully."
 *       404:
 *         description: Code template not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Code template not found." 
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden" 
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
 */

function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        return updateCodeTemplateInteractor(req, res);
    } else if (req.method === "DELETE") {
        return deleteCodeTemplateInteractor(req, res);
    } else if (req.method === "GET") {
        return getCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["PATCH", "DELETE", "GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default handler;
