import { NextApiRequest, NextApiResponse } from "next";
import adminGetBlogposts from "@/src/blogposts/admin-get-blogposts";



function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return adminGetBlogposts(req,res);
    } 
    else {
        res.setHeader("Allow", ["DELETE", "PUT", "PATCH", "GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;