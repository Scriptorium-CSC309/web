import createCommentsInteractor from "@/src/comments/create-comments";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        createCommentsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
