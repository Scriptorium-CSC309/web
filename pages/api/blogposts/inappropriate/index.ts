import type { NextApiRequest, NextApiResponse } from "next";
import sortBlogPostsInteractor from "@/src/blogposts/sorting/get-innappropriate-blogposts";
function handler (req: NextApiRequest, res: NextApiResponse) {
//GET method
    if (req.method === "GET") {
        sortBlogPostsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default handler;