import { ExecutionResult } from "@/src/execute/executor";
import { ExecutorFactory } from "@/src/execute/executor-factory";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/execute:
 *   post:
 *     summary: Execute code in a specified language
 *     description: Executes the provided code in the specified language and returns the result.
 *     tags:
 *       - Execute
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 description: The programming language of the code to be executed.
 *                 example: "javascript"
 *               code:
 *                 type: string
 *                 description: The source code to be executed.
 *                 example: "console.log('Hello, World!');"
 *               stdin:
 *                 type: string
 *                 description: (Optional) The standard input to be provided to the code during execution.
 *                 example: "input data"
 *               timeout:
 *                 type: integer
 *                 description: (Optional) The maximum time allowed for code execution, specified in milliseconds.
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Code executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stdout:
 *                   type: string
 *                   description: The standard output from the executed code.
 *                 stderr:
 *                   type: string
 *                   description: The standard error from the executed code.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The language is not supported."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

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
