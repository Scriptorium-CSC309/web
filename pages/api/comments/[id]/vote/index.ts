import type { NextApiRequest, NextApiResponse } from "next";
import voteOnCommentInteractor from "@/src/comments/[id]/vote-on-comments"

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return voteOnCommentInteractor(req, res);
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
