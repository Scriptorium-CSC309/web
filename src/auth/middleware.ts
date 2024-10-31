import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import { AuthenticatedHandler, AuthenticatedRequest } from "./utils";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * A Functional decorator to enable authorization and authentication.
 * @param handler The handler to add auth to.
 * @param options Options for the authorization and authentication.
 * @returns A modified handler with authorization and authentication implemented as specified by options.
 */
export function withAuth<T>(
    handler: AuthenticatedHandler<T>,
    options?: { admin?: boolean }
): NextApiHandler<T | { error: string }> {
    return async (
        req: NextApiRequest,
        res: NextApiResponse<T | { error: string }>
    ): Promise<void> => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' from 'Bearer token'

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;

            // Check for admin access if required
            if (options?.admin && !decoded.isAdmin) {
                res.status(403).json({
                    error: "Forbidden: Admin access required",
                });
                return;
            }

            const authReq = req as AuthenticatedRequest
            authReq.user = {
                userId: decoded.id,
                isAdmin: decoded.isAdmin,
            };


            await handler(
                authReq,
                res as NextApiResponse<T>
            );
        } catch (error) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
    };
}
