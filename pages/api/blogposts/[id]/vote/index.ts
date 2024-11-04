import voteOnBlogPostInteractor from "@/src/blogposts/[id]/vote-on-blog-post";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/blogposts/{id}/vote:
 *   post:
 *     summary: Vote on a Blog Post
 *     description: Allows a user to upvote or downvote a blog post by its ID.
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
 *               voteType:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: The type of vote (upvote or downvote)
 *           example:
 *             voteType: "upvote"
 *     responses:
 *       200:
 *         description: Blog post voted on successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote registered successfully"
 *       400:
 *         description: Bad Request (Missing or invalid vote type)
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal Server Error
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