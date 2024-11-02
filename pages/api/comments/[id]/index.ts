import type { NextApiRequest, NextApiResponse } from "next";
import hideCommentHandler from "@/src/comments/[id]/hide-comment";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        return hideCommentHandler(req, res);
    } else {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
