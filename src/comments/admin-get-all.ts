import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import {
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
    PAGE_SIZE,
    SERVER_ERROR_MSG,
} from "@/constants";
import { user } from "@nextui-org/react";
import { Prisma } from "@prisma/client";

type Error = {
    error: string;
};

type CommentWithReportCount = {
    id: number;
    content: string;
    postedAt: Date;
    userId: number;
    postId: number;
    isHidden: boolean;
    upvotes: number;
    downvotes: number;
    reportCount: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

type SuccessResponse = {
    comments: CommentWithReportCount[];
    total: number;
    page: number;
    pageSize: number;
};

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number()
        .integer()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(PAGE_SIZE),
    sort: Joi.string().valid("asc", "desc").default("desc"), // sort order based on reportCount
    search: Joi.string().optional().allow(''), // optional search parameter for comment content
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate query parameters
    const { value: query, error: queryError } = querySchema.validate(
        req.query,
        { convert: true }
    );
    if (queryError) {
        return res.status(400).json({ error: queryError.details[0].message });
    }

    const { page, pageSize, sort, search } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let where: Prisma.CommentWhereInput = {};
        if (search) {
            where.OR = [
                { content: { contains: search } },
                { user: { name: { contains: search } } },
            ];
        }

    try {
        // Fetch comments with at least one report, include count of reports
        const [comments, total] = await prisma.$transaction([
            prisma.comment.findMany({
                where,
                select: {
                    id: true,
                    content: true,
                    postedAt: true,
                    userId: true,
                    postId: true,
                    isHidden: true,
                    upvotes: true,
                    downvotes: true,
                    _count: {
                        select: { commentReports: true },
                    },
                    user: true,
                },
                orderBy: {
                    commentReports: {
                        _count: sort,
                    },
                },
                skip: skip,
                take: take,
            }),
            prisma.comment.count(
                {
                    where: where,
                }
            ),
        ]);

        // Map comments to include reportCount
        const formattedComments: CommentWithReportCount[] = comments.map(
            (comment) => ({
                id: comment.id,
                content: comment.content,
                postedAt: comment.postedAt,
                userId: comment.userId,
                postId: comment.postId,
                isHidden: comment.isHidden,
                upvotes: comment.upvotes,
                downvotes: comment.downvotes,
                reportCount: comment._count.commentReports,
                user: comment.user,
            })
        );

        return res.status(200).json({
            comments: formattedComments,
            total: total,
            page: page,
            pageSize: pageSize,
        });
    } catch (err) {
        console.error("Error fetching inappropriate comments:", err);
        return res.status(500).json({ error: SERVER_ERROR_MSG });
    }
}

export default withAuth(handler, { admin: true });
