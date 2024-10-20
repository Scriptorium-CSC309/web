import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import { spawn } from "child_process";
import { cleanupFile, createTempFile } from "./utils";

export class PythonExecutor implements Executor {
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFilePath = await createTempFile("py", options.code);

        return await new Promise<ExecutionResult>((resolve, reject) => {
            // Spawn the Python process
            const pythonProcess = spawn("python3", [tempFilePath]);

            let stdout = "";
            let stderr = "";

            // Capture stdout
            pythonProcess.stdout.on("data", (data) => {
                stdout += data.toString();
            });

            // Capture stderr
            pythonProcess.stderr.on("data", (data) => {
                stderr += data.toString();
            });

            // Handle errors in spawning the process
            pythonProcess.on("error", (err) => {
                reject(
                    new Error(`Failed to start Python process: ${err.message}`)
                );
            });

            // Handle process exit
            pythonProcess.on("close", async (code, signal) => {
                cleanupFile(tempFilePath).catch((error) => {
                    console.error(`Error deleting temp file: ${error.message}`);
                });
                resolve({ stdout, stderr });
            });

            // Write to stdin if provided
            if (options.stdin) {
                pythonProcess.stdin.write(options.stdin);
            }

            // Close stdin to indicate no more data
            pythonProcess.stdin.end();
        });
    }
}
