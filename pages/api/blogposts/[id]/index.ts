import deleteBlogPostInteractor from "@/src/blogposts/[id]/delete-blogpost";
import editBlogPostInteractor from "@/src/blogposts/[id]/edit-blogpost";
import hideBlogPostInteractor from "@/src/blogposts/[id]/hide-blogpost";
import  getBlogPostById from "@/src/blogposts/[id]/get-blogpost";
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest } from "@/src/auth/utils";
import { get } from "http";

/**
 * @swagger
 * /api/blogposts/{id}:
 *   delete:
 *     tags: [blogposts]
 *     summary: Delete a Blog Post
 *     description: Deletes a blog post by its ID. Only the post owner or an admin can delete the post.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to delete.
 *     responses:
 *       200:
 *         description: Blog post deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Blog post deleted successfully"
 *       403:
 *         description: Forbidden if the user is not the owner or admin.
 *         content:
 *           application/json:
 *             example:
 *               error: "Forbidden: You can only delete your own blog posts"
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Blog post not found"
 *   put:
 *     tags: [blogposts]
 *     summary: Edit a Blog Post
 *     description: Updates a blog post's title, description, content, and tags.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to edit.
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
 *             content: "Updated blog content."
 *             tags: ["updated", "tags"]
 *     responses:
 *       200:
 *         description: Blog post updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "Updated Blog Post Title"
 *               description: "Updated description"
 *               content: "Updated blog content."
 *       403:
 *         description: Forbidden if the user is not the owner or admin.
 *         content:
 *           application/json:
 *             example:
 *               error: "You do not have permission to update this blog post"
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Blog post not found"
 *   patch:
 *     tags: [blogposts]
 *     summary: Hide a Blog Post
 *     description: Allows the owner or admin to hide a blog post.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to hide.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isHidden:
 *                 type: boolean
 *                 description: Set to true to hide the post.
 *           example:
 *             isHidden: true
 *     responses:
 *       200:
 *         description: Blog post visibility set successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Blog post visibility set successfully"
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Blog post not found"
 */


function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        return deleteBlogPostInteractor(req, res);
    } else if (req.method === "PUT") {
        return editBlogPostInteractor(req as AuthenticatedRequest, res);
    } else if (req.method == "PATCH") {
        return hideBlogPostInteractor(req as AuthenticatedRequest, res);
    }
    // get blogpost by id
    else if (req.method === "GET") {
        return getBlogPostById(req,res);
    } 
    else {
        res.setHeader("Allow", ["DELETE", "PUT", "PATCH", "GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
