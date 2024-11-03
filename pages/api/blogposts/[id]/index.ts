import deleteBlogPostInteractor from "@/src/blogposts/[id]/delete-blogpost";
import editBlogPostInteractor from "@/src/blogposts/[id]/edit-blogpost";
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest } from "@/src/auth/utils";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        return deleteBlogPostInteractor(req, res);
    } else if (req.method === "PUT") {
        return editBlogPostInteractor(req as AuthenticatedRequest, res);
    } else {
        res.setHeader("Allow", ["DELETE", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
