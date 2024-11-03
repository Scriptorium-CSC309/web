import type { NextApiRequest, NextApiResponse } from "next";
import reportCommentHandler from "@/src/comments/[id]/report-comment";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return reportCommentHandler(req, res);
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
