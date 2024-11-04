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

const hideBlogPostSchema = Joi.object({
    id: Joi.number().integer().required(),
});

const bodySchema = Joi.object({
    isHidden: Joi.boolean().required(),
});

async function hideblogPostInteractor(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    // Validate the 'id' parameter from the route
    const { value: params, error: paramsError } = hideBlogPostSchema.validate(
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
        const blogPost = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }

        await prisma.blogPost.update({
            where: { id },
            data: { isHidden: isHidden },
        });

        return res.status(200).json({ message: "Blog post visibility set successfully" });
    } catch (err) {
        console.error("Error hiding blog post:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default withAuth(hideblogPostInteractor, { admin: true });
