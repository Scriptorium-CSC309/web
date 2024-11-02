import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware"; 
import { AuthenticatedRequest } from "@/src/auth/utils";

type Error = {
    error: string;
};

type SuccessResponse = {
    message: string;
    upvotes: number;
    downvotes: number;
};

// for validating the 'id' parameter from the route
const voteSchema = Joi.object({
    id: Joi.number().integer().required(),
});

// for validating the request body
const bodySchema = Joi.object({
    type: Joi.string().valid("upvote", "downvote").required(),
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate the 'id' parameter from the route
    const { value: params, error: paramsError } = voteSchema.validate(
        req.query,
        { convert: true }
    );
    if (paramsError) {
        return res.status(400).json({ error: paramsError.details[0].message });
    }

    // Validate the request body
    const { value: body, error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error: bodyError.details[0].message });
    }

    const { id } = params;
    const { type } = body;
    const userId = Number(req.user.userId);

    try {
        // Fetch the comment to verify its existence
        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.isHidden) {
            return res.status(403).json({ error: "You cannot vote on hidden comments" });
        }
        
        // Check if the user has already voted on this comment
        const existingVote = await prisma.commentVote.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId: id,
                },
            },
        });

        if (existingVote) {
            if (existingVote.type === type.toUpperCase()) {
                // If the user is trying to cast the same vote again, ignore or inform them
                return res
                    .status(400)
                    .json({ error: `You have already ${type}d this comment` });
            } else {
                // User is changing their vote
                await prisma.commentVote.update({
                    where: { id: existingVote.id },
                    data: { type: type.toUpperCase() },
                });

                // Update the comment's upvotes and downvotes accordingly
                if (type === "upvote") {
                    await prisma.comment.update({
                        where: { id },
                        data: {
                            upvotes: { increment: 1 },
                            downvotes: { decrement: 1 },
                        },
                    });
                } else {
                    await prisma.comment.update({
                        where: { id },
                        data: {
                            upvotes: { decrement: 1 },
                            downvotes: { increment: 1 },
                        },
                    });
                }

                return res.status(200).json({
                    message: `Your vote has been changed to ${type}`,
                    upvotes: comment.upvotes + (type === "upvote" ? 1 : -1),
                    downvotes:
                        comment.downvotes + (type === "downvote" ? 1 : -1),
                });
            }
        } else {
            // User hasn't voted yet; create a new vote
            await prisma.commentVote.create({
                data: {
                    userId,
                    commentId: id,
                    type: type.toUpperCase() as "UPVOTE" | "DOWNVOTE",
                },
            });

            // Update the comment's upvotes or downvotes
            if (type === "upvote") {
                await prisma.comment.update({
                    where: { id },
                    data: { upvotes: { increment: 1 } },
                });
            } else {
                await prisma.comment.update({
                    where: { id },
                    data: { downvotes: { increment: 1 } },
                });
            }

            return res.status(200).json({
                message: `Comment ${type}d successfully`,
                upvotes:
                    type === "upvote" ? comment.upvotes + 1 : comment.upvotes,
                downvotes:
                    type === "downvote"
                        ? comment.downvotes + 1
                        : comment.downvotes,
            });
        }
    } catch (err) {
        console.error("Error processing vote:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default withAuth(handler);
