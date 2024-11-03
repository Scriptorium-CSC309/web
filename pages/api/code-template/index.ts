import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import saveCodeTemplateInteractor from "@/src/code-template/save-code-template";
import updateCodeTemplateInteractor from "@/src/code-template/[id]/update-code-template";
import deleteCodeTemplateInteractor from "@/src/code-template/[id]/delete-code-template";
import type { NextApiResponse } from "next";
import getCodeTemplatesInteractor from "@/src/code-template/fetch-all-code-templates";

function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
       return getCodeTemplatesInteractor(req, res);
    } else if (req.method === "POST") {
        return saveCodeTemplateInteractor(req, res);
    } else if (req.method === "PATCH") {
        return updateCodeTemplateInteractor(req, res);
    } else if (req.method === "DELETE") {
        return deleteCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler);
