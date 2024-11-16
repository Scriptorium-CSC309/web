import type { NextApiRequest, NextApiResponse } from "next";
import sortBlogPostsInteractor from "@/src/blogposts/sorting/get-innappropriate-blogposts";

/**
 * @swagger
 * /blogposts/inappropriate:
 *     tags: [blogposts]
 *   get:
 *     summary: Retrieve blog posts marked as inappropriate, with pagination and sorting.
 *     description: Returns a list of blog posts that have been reported as inappropriate, sorted by report count. Requires admin authorization.
 *     tags:
 *       - BlogPosts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: MIN_PAGE_SIZE
 *           maximum: MAX_PAGE_SIZE
 *           default: PAGE_SIZE
 *         description: Number of blog posts per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sorting order for report count.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of inappropriate blog posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogPosts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       content:
 *                         type: string
 *                       postedAt:
 *                         type: string
 *                         format: date-time
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       userId:
 *                         type: integer
 *                       isHidden:
 *                         type: boolean
 *                       blogID:
 *                         type: integer
 *                       reportCount:
 *                         type: integer
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *             example:
 *               blogPosts: [
 *                 {
 *                   id: 1,
 *                   title: "Inappropriate Post",
 *                   description: "Description of inappropriate post",
 *                   content: "Content of the post",
 *                   postedAt: "2024-11-04T12:34:56Z",
 *                   tags: ["tag1", "tag2"],
 *                   userId: 42,
 *                   isHidden: true,
 *                   blogID: 1,
 *                   reportCount: 5
 *                 }
 *               ]
 *               total: 50
 *               page: 1
 *               pageSize: 10
 *       400:
 *         description: Invalid request parameters.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        sortBlogPostsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default handler;
