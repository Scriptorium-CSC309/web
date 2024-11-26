import type { NextApiResponse } from "next";
import prisma from "@/prisma";
import Joi from "joi";
import { withAuth } from "@/src/auth/middleware";
import { AuthenticatedRequest } from "@/src/auth/utils";
import { SERVER_ERROR_MSG } from "../../../constants";



type Error = {
    error: string;
};

type Data = {
    message: string;
};

const deleteCodeTempateQuerySchema = Joi.object({
    id: Joi.number().integer().required(),
});


async function deleteCodeTemplateInteractor(
    req: AuthenticatedRequest,
    res: NextApiResponse<Data | Error>
) { 

    const { error: queryError, value: queryValue } = deleteCodeTempateQuerySchema.validate(req.query);
    if (queryError) {
        res.status(400).json({ error: queryError.details[0].message });
        return;
    }

    const userId = Number(req.user.userId);

    try {
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

        await prisma.codeTemplate.delete({
            where: { id: existingCodeTemplate.id },
        });
        return res.status(200).json({ message: "Code Template Deleted Successfully." });
    } catch (error) {
        console.error("Error updating code template:", error);
        return res.status(500).json({ error: SERVER_ERROR_MSG });
    }
}

export default withAuth(deleteCodeTemplateInteractor);