import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
    getWorkDir,
} from "./utils";
import { EXECUTION_MEMORY_LIMIT, EXECUTION_TIME_LIMIT, TS_CONFIG_FILE, TS_CONFIG_CONTENT } from "../../constants";

const TS_IMAGE_TAG = process.env.TS_IMAGE_TAG!;

export class TSExecutor implements Executor {
    /**
     * Execute the ts file using the Node runtime.
     */
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFilePrefix = getUniqueFileName();

        // Create a temporary file with the user's code
        const tempFilePath = await createTempFile(
            tempFilePrefix + ".ts",
            options.code
        );

        const tempTSConfigPath = await createTempFile(
            TS_CONFIG_FILE,
            TS_CONFIG_CONTENT,
        );

        const dockerArgs = [
            "run",
            "-i", // Interactivity is needed for providing stdin
            "--rm", // Automatically remove the container after execution
            "--ulimit", `cpu=${EXECUTION_TIME_LIMIT}`, // Limit to EXECUTION_TIME_LIMIT of CPU time
            "--memory", `${EXECUTION_MEMORY_LIMIT}m`, // Limit memory to EXECUTION_MEMORY_LIMIT MB
            "--mount",
            `type=bind,source=${tempFilePath},target=/main.ts,readonly`, // Mount the code file as readonly
            "--mount",
            `type=bind,source=${tempTSConfigPath},target=/${TS_CONFIG_FILE},readonly`, // Mount a tmpfs for /tmp
            TS_IMAGE_TAG,
            "ts-node",
            "/main.ts", // Command to execute the Node.js file
        ];

        let { stdout, stderr, code } = await spawnHelper(
            { command: "docker", args: dockerArgs },
            options.stdin
        );

        // Handle forced Docker exit code
        const FORCED_DOCKER_EXIT_CODE = 137;
        if (code === FORCED_DOCKER_EXIT_CODE) {
            stderr +=
                "process exited with code 137. Most likely due to exceeding memory or CPU time limit.";
        }

        try {
            await cleanupFile(tempFilePath);
            await cleanupFile(tempTSConfigPath);
        } catch (error) {
            console.error(`Error deleting file: ${error}`);
        }

        return { stdout: stdout, stderr: stderr };
    }
}
