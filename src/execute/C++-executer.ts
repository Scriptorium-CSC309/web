import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";
import { EXECUTION_MEMORY_LIMIT, EXECUTION_TIME_LIMIT } from "../../constants";

const CPP_IMAGE_TAG = process.env.CPP_IMAGE_TAG!;

export class CppExecutor implements Executor {
    /**
     * Compile and execute the C++ file using g++.
     */
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFilePrefix = getUniqueFileName();

        const tempFilePath = await createTempFile(
            tempFilePrefix + ".cpp",
            options.code
        );

        const dockerArgs = [
            "run",
            "-i", // Interactivity is needed for providing stdin
            "--rm", // Automatically remove the container after execution
            "--ulimit", `cpu=${EXECUTION_TIME_LIMIT}`, // Limit to EXECUTION_TIME_LIMIT of CPU time
            "--memory", `${EXECUTION_MEMORY_LIMIT}m`, // Limit memory to EXECUTION_MEMORY_LIMIT MB
            "--mount",
            `type=bind,source=${tempFilePath},target=/main.cpp,readonly`, // User does not have root permissions
            CPP_IMAGE_TAG,
            "g++ -o /main /main.cpp && /main", // command to execute: compile and run the program
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
