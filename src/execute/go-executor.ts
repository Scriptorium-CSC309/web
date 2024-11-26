import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";
import { EXECUTION_MEMORY_LIMIT, EXECUTION_TIME_LIMIT } from "../../constants";

const GO_IMAGE_TAG = process.env.GO_IMAGE_TAG!;

export class GoExecutor implements Executor {
    /**
     * Execute the Node.js file using the Node.js runtime.
     */
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFilePrefix = getUniqueFileName();

        // Create a temporary file with the user's code
        const tempFilePath = await createTempFile(
            tempFilePrefix + ".go",
            options.code
        );

        const dockerArgs = [
            "run",
            "-i", // Interactivity is needed for providing stdin
            "--rm", // Automatically remove the container after execution
            "--ulimit", `cpu=${EXECUTION_TIME_LIMIT}`, // Limit to EXECUTION_TIME_LIMIT of CPU time
            "--memory", `${EXECUTION_MEMORY_LIMIT}m`, // Limit memory to EXECUTION_MEMORY_LIMIT MB
            "--mount",
            `type=bind,source=${tempFilePath},target=/main.go,readonly`, // Mount the code file as readonly
            GO_IMAGE_TAG,
            "go",
            "run",
            "/main.go", // Command to execute the Node.js file
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
        } catch (error) {
            console.error(`Error deleting file: ${error}`);
        }

        return { stdout: stdout, stderr: stderr };
    }
}
