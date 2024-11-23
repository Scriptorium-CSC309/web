import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { Prisma } from "@prisma/client";
import { formatTags, isAuthenticatedRequest } from "../utils";
import {
  MAX_CHARS_CONTENT,
  MAX_CHARS_TITLE_DESCRIPTION,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_PAGES,
  PAGE_SIZE,
} from "../../constants";
import { AuthenticatedRequest } from "../auth/utils";

type Error = {
  error: string;
};

type CodeTemplateData = {
  codeTemplates: any[];
  total: number;
  page: number;
  pageSize: number;
};

const getCodeTemplatesSchema = Joi.object({
  page: Joi.number().integer().min(MIN_PAGES).default(MIN_PAGES),
  pageSize: Joi.number()
    .integer()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(PAGE_SIZE),
  tags: Joi.alternatives(
    Joi.string().max(MAX_CHARS_TITLE_DESCRIPTION),
    Joi.array().items(Joi.string().max(MAX_CHARS_TITLE_DESCRIPTION))
  ).optional(),
  title: Joi.string().max(MAX_CHARS_TITLE_DESCRIPTION).optional(),
  code: Joi.string().max(MAX_CHARS_CONTENT).optional(),
  userId: Joi.number().integer().optional(),
});

async function getCodeTemplatesInteractor(
  req: AuthenticatedRequest | NextApiRequest,
  res: NextApiResponse<CodeTemplateData | Error>
) {
  // TODO: consider if comments of hidden blogposts should be visible. Currently they are.

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { value, error } = getCodeTemplatesSchema.validate(req.query);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { page, pageSize, title, code} = value;
    let { tags, userId } = value;

    // Ensure `tags` is an array regardless of how it's provided
    tags = formatTags(tags);

    if (isAuthenticatedRequest(req)) {userId = Number(req.user.userId)}

    // Construct the 'where' clause to filter comments by postId
    const filter: Prisma.CodeTemplateWhereInput = {
      ...(title && { title: { contains: title } }),
      ...(code && { code: { contains: code } }),
      ...(tags.length > 0 && { tags: { some: { name: { in: tags } } } }),
      ...(userId && { userId: { equals: userId } }),
    };

    // Calculate pagination parameters
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch the total count of comments for pagination
    const total = await prisma.codeTemplate.count({ where: filter });

    // Fetch the comments with pagination, filtering, and sorting
    const codeTemplates = await prisma.codeTemplate.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take,
    });

    return res.status(200).json({
      codeTemplates,
      total,
      page,
      pageSize,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default getCodeTemplatesInteractor;
