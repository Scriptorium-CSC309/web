import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthenticatedRequest extends NextApiRequest {
    user: {
        userId: string;
        isAdmin: boolean;
    };
}

export function withAuth<T>(
    handler: NextApiHandler<T>,
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

            (req as AuthenticatedRequest).user = {
                userId: decoded.userId,
                isAdmin: decoded.isAdmin,
            };

            // Check for admin access if required
            if (options?.admin && !decoded.isAdmin) {
                res.status(403).json({
                    error: "Forbidden: Admin access required",
                });
                return;
            }

            // Pass `res` as `NextApiResponse<T>` to the handler
            await handler(req, res as NextApiResponse<T>);
        } catch (error) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
    };
}
