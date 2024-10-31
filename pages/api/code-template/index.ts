import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import saveCodeTemplateInteractor from "@/src/code-template/save-code-template";
import type { NextApiResponse } from "next";

function handler(req: AuthenticatedRequest, res: NextApiResponse) {
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
