import voteOnBlogPostInteractor from "@/src/blogposts/[id]/vote-on-blog-post";
import { NextApiRequest, NextApiResponse } from "next";

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