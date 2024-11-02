import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { AuthenticatedRequest } from "@/src/auth/utils";
import { withAuth } from "@/src/auth/middleware";

const reportBlogPost = withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // Only allow POST method
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;
    const { explanation } = req.body;
    const reporterId = Number(req.user.userId);

    // Validate blog post ID and explanation
    if (!id || !explanation) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if the blog post exists
        const blogPost = await prisma.blogPost.findUnique({
            where: { id: Number(id) },
        });
        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }

        // Create a report
        await prisma.blogPostReport.create({
            data: {
                reporterId,
                blogPostId: Number(id),
                explanation,
                reportedAt: new Date(),
            },
        });

        res.status(200).json({ message: "Reported successfully" });
    } catch (error) {
        console.error("Error reporting blog post:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
export default reportBlogPost;
