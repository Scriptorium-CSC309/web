import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import saveCodeTemplateInteractor from "@/src/code-template/save-code-template";
import updateCodeTemplateInteractor from "@/src/code-template/[id]/update-code-template";
import type { NextApiResponse } from "next";

function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // getProfileInteractor(req, res);
    } else if (req.method === "POST") {
        saveCodeTemplateInteractor(req, res);
    } else if (req.method === "PATCH") {
        updateCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler);
