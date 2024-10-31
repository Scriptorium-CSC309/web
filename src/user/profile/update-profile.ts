import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest, hashPassword } from "@/src/auth/utils";
import Joi from "joi";

const NUM_AVATARS = Number(process.env.NUM_AVATARS!);

// Joi schema for request body validation
const updateProfileSchema = Joi.object({
    name: Joi.string().min(1).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    avatarId: Joi.number().integer().min(1).max(NUM_AVATARS).optional(),
});

async function updateProfileInteractor(
    req: AuthenticatedRequest,
    res: NextApiResponse
) {
    try {
        const userId = Number(req.user.userId);

        const { error, value: validatedData } = updateProfileSchema.validate(
            req.body
        );
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { name, email, password, avatarId } = validatedData;

        // Build update data object
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (avatarId) updateData.avatarId = avatarId;

        // Check for email uniqueness if an email is provided
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser && existingUser.id !== userId) {
                res.status(400).json({
                    error: "Email is already in use by another user.",
                });
                return;
            }
            updateData.email = email;
        }

        // If password is provided, hash it before storing
        if (password) {
            const hashedPassword = await hashPassword(password);
            updateData.password = hashedPassword;
        }

        // Update user profile in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, avatarId: true }, // Do not return password as best practice
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
        return;
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}

export default withAuth(updateProfileInteractor);
