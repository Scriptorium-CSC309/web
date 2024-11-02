import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

export default async function refreshToken(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as any;

        // Issue new access token
        const accessToken = jwt.sign(
            { id: decoded.id, isAdmin: decoded.isAdmin },
            jwtSecret,
            { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Invalid refresh token" });
    }
}
