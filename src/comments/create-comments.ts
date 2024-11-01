import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";

type Error = {
    error: string;
};

type Data = {
    message: string;
};

const createCommentSchema = Joi.object({
    postId: Joi.number().integer().required(),
    content: Joi.string().min(1).max(500).required(),
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method !== "POST") {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }

    const { error, value } = createCommentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    let { postId, content } = value;
    postId = Number(postId);
    const userId = Number(req.user.userId);

    try {
        // Check if the post exists
        const post = await prisma.blogPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        await prisma.comment.create({
            data: {
                content,
                postId,
                userId,
            },
        });

        res.status(201).json({ message: "Comment created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default withAuth(handler);
