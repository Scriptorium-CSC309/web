import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";

export class PythonExecutor implements Executor {
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFileName = getUniqueFileName() + ".py";
        const tempFilePath = await createTempFile(tempFileName, options.code);

        const { stdout, stderr } = await spawnHelper(
            { command: "python3", args: [tempFilePath] },
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
