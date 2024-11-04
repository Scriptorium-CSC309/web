import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import {
    AuthenticatedHandler,
    AuthenticatedRequest,
    OptionallyAuthenticatedHandler,
    OptionallyAuthenticatedRequest,
} from "./utils";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * A Functional decorator to enable authorization and authentication.
 * @param handler The handler to add auth to.
 * @param options - Optional settings for authentication and authorization.
 *   - `admin` (default: `false`):
 *          When set to `true`, the route will only allow access to authenticated users with admin privileges.
 *   - `optional` (default: `true`):
 *          When set to `true`, the route allows unauthenticated requests.
 *          If authentication fails or is missing, `req.user` will be set to `null`.
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

            const authReq = req as AuthenticatedRequest;
            authReq.user = {
                userId: decoded.id,
                isAdmin: decoded.isAdmin,
            };

            await handler(authReq, res as NextApiResponse<T>);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: "Access token expired" });
            } else {
                console.log(error);
                res.status(401).json({ error: "Invalid token" });
            }
            return;
        }
    };
}

/**
 * A Functional decorator to optionally enable authorization and authentication.
 * @param handler The handler to add optional auth to.
 * @param options Options for the authorization and authentication.
 * @returns A modified handler with optional authorization and authentication.
 */
export function withOptionalAuth<T>(
    handler: OptionallyAuthenticatedHandler<T>
): NextApiHandler<T | { error: string }> {
    return async (
        req: NextApiRequest,
        res: NextApiResponse<T | { error: string }>
    ): Promise<void> => {
        let user = null;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7); // Remove 'Bearer ' from 'Bearer token'

            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;

                user = {
                    userId: decoded.id,
                    isAdmin: decoded.isAdmin,
                };
            } catch (error) {
                console.log(error);
                // Token is invalid or expired, user remains null
            }
        }

        const authReq = req as OptionallyAuthenticatedRequest;
        authReq.user = user;

        // Call the handler
        await handler(authReq, res as NextApiResponse<T>);
    };
}
