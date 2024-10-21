import { ExecutionResult } from "@/src/execute/executor";
import { ExecutorFactory } from "@/src/execute/executor-factory";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string } | ExecutionResult;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let { language, code, stdin, timeout } = req.body;
    let executor = ExecutorFactory.fromLanguage(language);
    if (!executor) {
        res.status(400).json({ message: "The language is not supported." });
        return;
    }

    const execution_result = await executor.execute({
        code: code,
        stdin: stdin,
        timeout: timeout,
    });
    res.status(200).json(execution_result);
}
