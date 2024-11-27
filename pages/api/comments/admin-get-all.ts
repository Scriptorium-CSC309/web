import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import type { NextApiResponse } from "next";
import adminGetAllCommentsInteractor from "@/src/comments/admin-get-all";


function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return adminGetAllCommentsInteractor(req, res);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler, {admin: true});