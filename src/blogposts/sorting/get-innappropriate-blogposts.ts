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
} from "@/src/constants";

type Error = {
    error: string;
};

type BlogPostWithCount = {
    id: number;
    title: string;
    description: string;
    content: string;
    postedAt: Date;
    tags: string[];
    userId: number;
    isHidden: boolean;
    blogID: number;
    reportCount: number;
};

type SuccessResponse = {
    blogPosts: BlogPostWithCount[];
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
    sort: Joi.string().valid("asc", "desc").default("desc"),
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Validate parameters
    const { value: query, error: queryError } = querySchema.validate(req.query, {
        convert: true,
    });
    if (queryError) {
        return res.status(400).json({ error: queryError.details[0].message });
    }

    // Handle pagination and sorting
    const { page, pageSize, sort } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    try {
        const [blogPosts, total] = await prisma.$transaction([
            prisma.blogPost.findMany({
                where: {},
                include: {
                    tags: {
                        select: { name: true }, // Assuming tags have a `name` field
                    },
                    blogPostReports: true, // Include reports to enable counting
                },
                orderBy: {
                    blogPostReports: {
                        _count: sort,
                    },
                },
                skip,
                take,
            }),
            prisma.blogPost.count(), // Count all blog posts
            prisma.blogPost.count({
                where: {
                    blogPostReports: {
                        some: {},
                    },
                },
            }),
        ]);
        
        // Map blog posts to include all required fields
        const formatted: BlogPostWithCount[] = blogPosts.map((post) => ({
            id: post.id,
            title: post.title,
            description: post.description,
            content: post.content,
            postedAt: post.postedAt,
            userId: post.userId,
            isHidden: post.isHidden,
            tags: post.tags.map((tag) => tag.name), // Extract tag names
            blogID: post.id, // Assuming blogID is the same as id
            reportCount: post.blogPostReports.length, // Count reports
        }));
        
        res.status(200).json({
            blogPosts: formatted,
            total,
            page,
            pageSize,
        });
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ error: SERVER_ERROR_MSG });
    }
}

export default withAuth(handler, { admin: true });