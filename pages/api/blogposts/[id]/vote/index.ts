import voteOnBlogPostInteractor from "@/src/blogposts/[id]/vote-on-blog-post";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/blogposts/{id}/vote:
 *   post:
 *     summary: Vote on a Blog Post
 *     description: Allows a user to upvote or downvote a blog post by its ID. If the user has already voted, the vote is updated; otherwise, a new vote is created.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: The type of vote (upvote or downvote)
 *           example:
 *             type: "upvote"
 *     responses:
 *       200:
 *         description: Vote registered successfully or vote updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog post upvoted successfully"
 *                 upvotes:
 *                   type: integer
 *                   example: 5
 *                 downvotes:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Bad Request (e.g., invalid vote type, duplicate vote attempt)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You have already voted"
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Blog post not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error voting on blog post"
 */

async function handler (req: NextApiRequest, res: NextApiResponse) {
    //if method is post
    if (req.method === 'POST') {
        //call the interactor
        await voteOnBlogPostInteractor(req, res);
    } else {
        //method is not post
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;