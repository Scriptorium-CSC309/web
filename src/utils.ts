import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { LANGUAGES } from "@/src/constants";
import { AuthenticatedRequest } from "./auth/utils";
import { Prisma } from "@prisma/client";

export async function createOrUpdateTags(tags: string[], model: Prisma.CodeTemplateTagDelegate | Prisma.BlogPostTagDelegate) {
    const codeTemplateTagsPromises = tags.map(async (tag: string) => {
        return prisma.codeTemplateTag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
        });
    });
    
    return await Promise.all(codeTemplateTagsPromises);
}
