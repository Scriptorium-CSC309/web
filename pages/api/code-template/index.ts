import { withAuth } from "@/src/auth/middleware";
import saveCodeTemplateInteractor from "@/src/user/profile/update-profile";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // getProfileInteractor(req, res);
    } else if (req.method === "POST") {
        saveCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler);
