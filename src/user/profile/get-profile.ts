// /src/handlers/users/getProfileHandler.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";

async function getProfileInteractor(
    req: AuthenticatedRequest,
    res: NextApiResponse
) {
    try {
        const userId = Number(req.user.userId);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                avatarId: true,
                isAdmin: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default withAuth(getProfileInteractor);
