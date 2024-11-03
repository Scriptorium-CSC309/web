import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import { MAX_CHARS_CONTENT, MAX_CHARS_TITLE_DESCRIPTION, MIN_CHARS, MAX_CHARS_TAG } from "../../constants";
import { error } from "console";
import { createOrUpdateTags } from "@/src/utils";



type Error = {
    error: string;
};

type Data = {
    message: string;
};

const updateCodeTemplateSchema = Joi.object({
    title: Joi.string().min(MIN_CHARS).max(MAX_CHARS_TITLE_DESCRIPTION).required(),
    description: Joi.string().min(MIN_CHARS).max(MAX_CHARS_TITLE_DESCRIPTION),
    code: Joi.string().max(MAX_CHARS_CONTENT),
    tags: Joi.array().items(Joi.string().min(MIN_CHARS).max(MAX_CHARS_TAG)),
});

const updateCodeTempateQuerySchema = Joi.object({
    id: Joi.number().integer().required(),
});


async function updateCodeTemplateInteractor(
    req: AuthenticatedRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method !== "PATCH") {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
        return;
    }
    const { error: bodyError, value: bodyValue } = updateCodeTemplateSchema.validate(req.body);
    if (bodyError) {
        res.status(400).json({ error: bodyError.details[0].message });
        return;
    }
    const { error: queryError, value: queryValue } = updateCodeTempateQuerySchema.validate(req.query);
    if (queryError) {
        res.status(400).json({ error: queryError.details[0].message });
        return;
    }

    const userId = Number(req.user.userId);

    try {
        const { title, description, code, tags } = bodyValue;
        const { id } = queryValue;
        const existingCodeTemplate = await prisma.codeTemplate.findUnique({
            where: { id },
        });
        if (!existingCodeTemplate) {
            res.status(404).json({ error: "Code template not found" });
            return;
        }
        if (existingCodeTemplate.userId !== userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        const tagRecords = await createOrUpdateTags(tags, "codeTemplateTag");
        
        await prisma.codeTemplate.update({
            where: { id },
            data: {
                title,
                description,
                code,
                tags: {
                    set: tagRecords.map((tag) => ({ id: tag.id })),
                },
            },
        });
        return res.status(200).json({ message: "Code Template Updated Successfully." });
    } catch (error) {
        console.error("Error updating code template:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export default updateCodeTemplateInteractor;