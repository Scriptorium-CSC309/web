import deleteBlogPostInteractor from "@/src/blogposts/[id]/delete-blogpost";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        return deleteBlogPostInteractor(req, res);
    } else {
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
