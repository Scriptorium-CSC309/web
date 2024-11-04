// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withAuth, withOptionalAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest, OptionallyAuthenticatedRequest } from "@/src/auth/utils";
import type { NextApiResponse } from "next";

type Data = {
    userId: string;
    isAdmin: boolean;
} | null;

async function handler(req: OptionallyAuthenticatedRequest, res: NextApiResponse<Data>) {
    return res.status(200).json(req.user);
}

export default withOptionalAuth(handler);
