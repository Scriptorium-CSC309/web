import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import updateCodeTemplateInteractor from "@/src/code-template/[id]/update-code-template";
import deleteCodeTemplateInteractor from "@/src/code-template/[id]/delete-code-template";
import type { NextApiResponse } from "next";

/**
 * @swagger
 * /api/code-template:
 *   put:
 *     summary: Update a code template
 *     description: Updates an existing code template.
 *     tags:
 *       - CodeTemplate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the code template.
 *               content:
 *                 type: string
 *                 description: The content of the code template.
 *           example:
 *             title: "New Title"
 *             content: "Updated content of the code template."
 *     responses:
 *       200:
 *         description: Code template updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Code template updated successfully."
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid request data."
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized access."
 *       404:
 *         description: Code template not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Code template not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error."
 *   delete:
 *     summary: Delete a code template
 *     description: Deletes an existing code template.
 *     tags:
 *       - CodeTemplate
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the code template to delete.
 *     responses:
 *       200:
 *         description: Code template deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Code template deleted successfully."
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid request data."
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized access."
 *       404:
 *         description: Code template not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Code template not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error."
 */
function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        return updateCodeTemplateInteractor(req, res);
    } else if (req.method === "DELETE") {
        return deleteCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["PATCH", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default withAuth(handler);