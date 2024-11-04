import deleteBlogPostInteractor from "@/src/blogposts/[id]/delete-blogpost";
import editBlogPostInteractor from "@/src/blogposts/[id]/edit-blogpost";
import hideBlogPostInteractor from "@/src/blogposts/[id]/hide-blogpost";
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest } from "@/src/auth/utils";

/**
 * @swagger
 * /api/blogposts/{id}:
 *   delete:
 *     summary: Delete a Blog Post
 *     description: Deletes a blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal Server Error
 * 
 *   put:
 *     summary: Edit a Blog Post
 *     description: Edits an existing blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             title: "Updated Blog Post Title"
 *             description: "Updated description"
 *             content: "Updated content of the blog post."
 *             tags: ["updated", "tags"]
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Bad Request (Invalid fields or missing required fields)
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal Server Error
 * 
 *   patch:
 *     summary: Hide a Blog Post
 *     description: Hides a blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to hide
 *     responses:
 *       200:
 *         description: Blog post hidden successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal Server Error
 */


function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        return deleteBlogPostInteractor(req, res);
    } else if (req.method === "PUT") {
        return editBlogPostInteractor(req as AuthenticatedRequest, res);
    } else if (req.method == "PATCH") {
        return hideBlogPostInteractor(req as AuthenticatedRequest, res);
    } else {
        res.setHeader("Allow", ["DELETE", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
