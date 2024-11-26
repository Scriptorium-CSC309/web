import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";

/**
 * Handler to fetch a code template by its ID.
 *
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 */
export default async function getCodeTemplateInteractor(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res
            .status(405)
            .json({ error: `Method ${req.method} Not Allowed` });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res
            .status(400)
            .json({ error: "Invalid or missing template ID." });
    }

    try {
        // Fetch the code template with related tags and user
        const codeTemplate = await prisma.codeTemplate.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                tags: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarId: true,
                    },
                },
            },
        });

        if (!codeTemplate) {
            return res.status(404).json({ error: "Code template not found." });
        }

        return res.status(200).json(codeTemplate);
    } catch (error) {
        console.error("Error fetching code template:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
