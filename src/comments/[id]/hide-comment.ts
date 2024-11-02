import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware"; 
import { AuthenticatedRequest } from "../../auth/utils";

type Error = {
    error: string;
};

type SuccessResponse = {
    message: string;
};

const hideCommentSchema = Joi.object({
    id: Joi.number().integer().required(),
});

const bodySchema = Joi.object({
    isHidden: Joi.boolean().required(),
});

async function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate the 'id' parameter from the route
    const { value: params, error: paramsError } = hideCommentSchema.validate(
        req.query,
        { convert: true }
    );
    if (paramsError) {
        return res.status(400).json({ error: paramsError.details[0].message });
    }

    // Validate the 'isHidden' parameter from the body
    const { value: body, error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error: bodyError.details[0].message });
    }

    const { id } = params;
    const { isHidden } = body;
    const userId = Number(req.user.userId);

    try {
        // Fetch the comment to verify its existence
        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await prisma.comment.update({
            where: { id },
            data: { isHidden: isHidden },
        });

        return res.status(200).json({ message: "Comment hidden successfully" });
    } catch (err) {
        console.error("Error hiding comment:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default withAuth(handler, { admin: true });
