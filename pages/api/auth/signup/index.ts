import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { hashPassword } from "@/src/auth/utils";
import Joi from "joi";
import { NUM_AVATARS, VALID_PHONE_NUMBER } from "@/src/constants";

// Joi schema for request body validation
const signupSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatarId: Joi.number().integer().min(1).max(NUM_AVATARS).optional(),
    phoneNumber: Joi.string().pattern(VALID_PHONE_NUMBER).optional()
});

export default async function signup(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }

    const { error, value: validatedData } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, password, avatarId = 1, phoneNumber } = validatedData;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user with the same email or phone number already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { phoneNumber }],
        },
    });
    if (existingUser) {
        return res.status(400).json({
            error: existingUser.email === email
                ? "User with this email already exists"
                : "User with this phone number already exists",
        });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isAdmin: false, // TODO: figure out how to give admin permission safely
                avatarId: avatarId,
                phoneNumber, 
            },
        });
        return res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
