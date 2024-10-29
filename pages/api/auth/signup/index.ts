// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { hashPassword } from "@/src/auth/utils";

const saltRounds = 10;

export default async function signup(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
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
                isAdmin: false,  // TODO: figure out how to give admin permission safely
            },
        });
        return res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
