import createCommentsInteractor from "@/src/comments/create-comments";
import getCommentsInteractor from "@/src/comments/get-comments";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return createCommentsInteractor(req, res);
    } else if (req.method === "GET") {
        return getCommentsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
