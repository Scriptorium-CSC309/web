import prisma from "@/prisma";
import { PrismaClient } from "@prisma/client/extension";


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