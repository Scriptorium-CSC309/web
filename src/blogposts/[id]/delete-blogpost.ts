import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { AuthenticatedRequest } from "../../auth/utils"; // Ensure the path is correct
import { withAuth } from "@/src/auth/middleware";

type Error = {
    error: string;
};

type SuccessResponse = {
    message: string;
};

const deleteBlogPostSchema = Joi.object({
    id: Joi.number().integer().required(),
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { value, error } = deleteBlogPostSchema.validate(req.query);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = value;
    const userId = Number(req.user.userId);

    try {
        // Fetch the blog post to verify ownership
        const blogPost = await prisma.blogPost.findUnique({
            where: { id: id },
        });

        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }

        if (blogPost.userId !== userId) {
            return res.status(403).json({
                error: "Forbidden: You can only delete your own blog posts",
            });
        }

        await prisma.blogPost.delete({
            where: { id: id },
        });

        return res
            .status(200)
            .json({ message: "Blog post deleted successfully" });
    } catch (err) {
        console.error("Error deleting blog post:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default withAuth(handler);
