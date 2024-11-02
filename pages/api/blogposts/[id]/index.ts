import deleteBlogPostInteractor from "@/src/blogposts/[id]/delete-blogpost";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import { AuthenticatedRequest } from "@/src/auth/utils";
import {withAuth} from "@/src/auth/middleware";

// Edit blog post function
const editBlogPost = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { title, description, content, tags } = req.body;
    const userId = req.user.userId; // Assuming `userId` is provided by middleware
    // Validate the ID
    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    // Check for missing fields
    if (!title || !description || !content || !tags) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Process each tag: connect existing ones or prepare to create new ones
        const tagConnections = await Promise.all(
            tags.map(async (tag: string) => {
                const existingTag = await prisma.blogPostTag.findUnique({
                    where: { name: tag },
                });
                if (existingTag) {
                    return { id: existingTag.id }; // Connect existing tag
                } else {
                    return { name: tag }; // Create new tag
                }
            })
        );
        // verify ownership of the blog post (GPT)
        const existingBlogPost = await prisma.blogPost.findUnique({
            where: { id: Number(id) },
            select: { userId: true }, // Only fetch the userId to check ownership
        });

        if (!existingBlogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }

        // Check if the authenticated user is the owner of the blog post
        if (existingBlogPost.userId !== Number(userId)) {
            return res.status(403).json({ error: "You do not have permission to update this blog post" });
        }

        // Update the blog post with the provided data and tags
        const blogpost = await prisma.blogPost.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                content,
                tags: {
                    set: [], // Clear existing tags
                    connectOrCreate: tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
        });
        return res.status(200).json(blogpost); // Return the updated blog post
    } catch (error) {
        console.error("Error updating blog post:", error);
        return res.status(500).json({ error: "Error updating blog post" });
    }
};

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        return deleteBlogPostInteractor(req, res);
    }
    //elseif PUT then editBlogPost
    else if (req.method === "PUT") {
        return editBlogPost(req as AuthenticatedRequest, res);
    }
    else {
        res.setHeader("Allow", ["DELETE", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler);
