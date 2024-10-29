import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";

export class JSExecutor implements Executor {
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFileName = getUniqueFileName() + ".js";
        const tempFilePath = await createTempFile(tempFileName, options.code);

        const { stdout, stderr } = await spawnHelper(
            { command: "node", args: [tempFilePath] },
            options.stdin
        );

        try {
            await cleanupFile(tempFilePath);
        } catch (error) {
            console.error(`Error deleting  file: ${error}`);
        }
        return { stdout: stdout, stderr: stderr };
    }
}