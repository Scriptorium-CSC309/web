import * as path from "path";
import * as os from "os";

import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";
import { ExecutionOptions, ExecutionResult, Executor } from "./executor";

export class CExecutor implements Executor {
    /**
     * Compile and execute the C file using gcc as a compiler.
     */
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFilePrefix = getUniqueFileName();
        const tempDir = os.tmpdir();

        const tempFilePath = await createTempFile(
            tempFilePrefix + ".c",
            options.code
        );
        const executablePath = path.join(tempDir, tempFilePrefix);

        let { stdout, stderr, code } = await spawnHelper({
            command: "gcc",
            args: ["-o", executablePath, tempFilePath],
        });

        if (code !== 0) {
            // compilation unsuccessful; don't try running executable
            try {
                await cleanupFile(tempFilePath);
            } catch (error) {
                console.error(`Error deleting .c file: ${error}`);
            }
            return { stdout, stderr };
        }

        let { stdout: runStdout, stderr: runStderr } = await spawnHelper(
            { command: executablePath },
            options.stdin
        );

        stdout += runStdout;
        stderr += runStderr;

        try {
            await cleanupFile(executablePath);
            await cleanupFile(tempFilePath);
        } catch (error) {
            console.error(`Error deleting files: ${error}`);
        }
        return { stdout, stderr };
    }
}
