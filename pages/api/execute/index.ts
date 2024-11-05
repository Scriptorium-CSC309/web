import { ExecutionResult } from "@/src/execute/executor";
import { ExecutorFactory } from "@/src/execute/executor-factory";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = { message: string } | ExecutionResult;



/**
 * @swagger
 * /api/execute:
 *   post:
 *     summary: Execute Code
 *     description: Executes code in a specified programming language with optional standard input and timeout.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 description: language must be one of ["C++", "C", "Python", "Java", "JS"]
 *               code:
 *                 type: string
 *                 description: The code to execute.
 *               stdin:
 *                 type: string
 *                 description: Optional standard input for the code.
 *               timeout:
 *                 type: number
 *                 description: Optional timeout in seconds.
 *           example:
 *             language: "JS"
 *             code: "console.log('Hello, World!');"
 *             stdin: ""
 *             timeout: 5
 *     responses:
 *       200:
 *         description: Successful execution of the code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stdout:
 *                   type: string
 *                   description: Standard output from the execution.
 *                 stderr:
 *                   type: string
 *                   description: Standard error from the execution.
 *             example:
 *               stdout: "Hello, World!\n"
 *               stderr: ""
 *       400:
 *         description: Bad request due to unsupported language or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "The language is not supported."
 * 
 */

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
