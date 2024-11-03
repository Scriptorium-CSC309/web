import prisma from "@/prisma";
import { PrismaClient } from "@prisma/client/extension";
import { NextApiRequest } from "next/types";
import { AuthenticatedRequest } from "./auth/utils";


export async function createOrUpdateTags(
  tags: string[],
  modelName: 'codeTemplateTag' | 'blogTemplateTag'
) {
  const model = prisma[modelName as keyof typeof prisma] as any;
  const TagsPromises = tags.map(async (tag: string) => {
    return model.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  });
  return await Promise.all(TagsPromises);
}

export function formatTags(tags: string | string[] | undefined) {
  return Array.isArray(tags)
          ? tags
          : typeof tags === 'string'
          ? tags.split(',')
          : [];
}

export function isAuthenticatedRequest(req: NextApiRequest): req is AuthenticatedRequest {
  return (req as AuthenticatedRequest).user !== undefined;
}