import type { NextApiRequest, NextApiResponse } from "next";
import getInnapropriateCommentsInteractor from "@/src/comments/inappropriate/get-innappropriate-comments";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return getInnapropriateCommentsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
