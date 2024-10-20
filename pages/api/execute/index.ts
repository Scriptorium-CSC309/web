import { ExecutionResult } from "@/src/execute/executor";
import { PythonExecutor } from "@/src/execute/python-executor";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string } | ExecutionResult;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let { language, code, stdin, timeout } = req.body;
    if (!language || language != "Python") {
        res.status(400).json({ message: "Only Python is supported right now" });
        return;
    }

    let executor = new PythonExecutor();
    const execution_result = await executor.execute({
        code: code,
        stdin: stdin,
        timeout: timeout,
    });
    res.status(200).json(execution_result);
}
