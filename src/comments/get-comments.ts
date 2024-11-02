import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { Prisma } from "@prisma/client";

type Error = {
    error: string;
};

type CommentData = {
    comments: any[];
    total: number;
    page: number;
    pageSize: number;
};

const getCommentsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    postId: Joi.number().integer().required(),
    sortBy: Joi.string().valid("valued", "controversial").optional(),
});

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CommentData | Error>
) {
    // TODO: consider if comments of hidden blogposts should be visible. Currently they are.

    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const { value, error } = getCommentsSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const { page, pageSize, postId, sortBy } = value;

        // Construct the 'where' clause to filter comments by postId
        const where: Prisma.CommentWhereInput = { postId, isHidden: false };

        // Calculate pagination parameters
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Handle sorting
        let orderBy: Prisma.CommentOrderByWithRelationInput[] = [{ postedAt: "desc" }];

        if (sortBy === "valued") {
            // Sort by upvotes descending and downvotes ascending
            orderBy = [
                { upvotes: "desc" },
                { downvotes: "asc" },
            ];
        } else if (sortBy === "controversial") {
            // Approximate controversy by sorting by upvotes and downvotes descending
            orderBy = [
                { upvotes: "desc" },
                { downvotes: "desc" },
            ];
        }

        // Fetch the total count of comments for pagination
        const total = await prisma.comment.count({ where });

        // Fetch the comments with pagination, filtering, and sorting
        const comments = await prisma.comment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true, 
                    },
                },  // include some user details
            },
            skip,
            take,
            orderBy,
        });

        return res.status(200).json({
            comments,
            total,
            page,
            pageSize,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default handler;
