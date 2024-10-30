import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";

// Set JWT secret from environment variable
const jwtSecret = process.env.JWT_SECRET!;

// Joi schema for validation
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export default async function login(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }

    const { email, password } = req.body;

    // Validate input using Joi
    const { error } = schema.validate({ email, password });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        jwtSecret,
        { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
}
