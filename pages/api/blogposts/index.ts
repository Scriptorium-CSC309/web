import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import getBlogPostsInteractor from "@/src/blogposts/get-blogposts";
import type { NextApiResponse } from "next";

function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        getBlogPostsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
