import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "../../auth/utils";
import { SERVER_ERROR_MSG } from "@/constants";

type Error = {
    error: string;
};

type SuccessResponse = {
    message: string;
};

const MIN_EXPLANATION_LENGTH = 10;

const querySchema = Joi.object({
    id: Joi.number().integer().required(),
});

const bodySchema = Joi.object({
    explanation: Joi.string().min(MIN_EXPLANATION_LENGTH).required(),
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate the 'id' parameter from the route query
    const { value: params, error: paramsError } = querySchema.validate(
        req.query,
        { convert: true }
    );
    if (paramsError) {
        return res.status(400).json({ error: paramsError.details[0].message });
    }

    // Validate the 'explanation' parameter from the body
    const { value: body, error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error: bodyError.details[0].message });
    }

    const { id } = params;
    const { explanation } = body;
    const userId = Number(req.user.userId);

    try {
        // Verify the comment exists
        const comment = await prisma.comment.findUnique({
            where: { id: id },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Check if the user has already reported this comment
        const existingReport = await prisma.commentReport.findFirst({
            where: {
                reporterId: userId,
                commentId: id,
            },
        });

        if (existingReport) {
            return res
                .status(400)
                .json({ error: "You have already reported this comment" });
        }

        // Create a new report for the comment
        await prisma.commentReport.create({
            data: {
                reporterId: userId,
                commentId: id,
                explanation: explanation,
            },
        });

        return res.status(201).json({
            message: "Comment reported successfully",
        });
    } catch (err) {
        return res.status(500).json({ error: SERVER_ERROR_MSG });
    }
}

export default withAuth(handler);
