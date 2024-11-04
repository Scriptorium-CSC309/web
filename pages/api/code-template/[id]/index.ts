import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import updateCodeTemplateInteractor from "@/src/code-template/[id]/update-code-template";
import deleteCodeTemplateInteractor from "@/src/code-template/[id]/delete-code-template";
import type { NextApiResponse } from "next";

function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        return updateCodeTemplateInteractor(req, res);
    } else if (req.method === "DELETE") {
        return deleteCodeTemplateInteractor(req, res);
    } else {
        res.setHeader("Allow", ["PATCH", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default withAuth(handler);
