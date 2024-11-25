import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";
import { EXECUTION_MEMORY_LIMIT, EXECUTION_TIME_LIMIT } from "../../constants";

const CSHARP_IMAGE_TAG = process.env.CSHARP_IMAGE_TAG!;

export class CSharpExecutor implements Executor {

    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const tempFilePrefix = getUniqueFileName();

        const tempFilePath = await createTempFile(
            tempFilePrefix + ".cs",
            options.code
        );

        const dockerArgs = [
            "run",
            "-i", // Interactivity is needed for providing stdin
            "--rm", // Automatically remove the container after execution
            "--ulimit", `cpu=${EXECUTION_TIME_LIMIT}`, // Limit to EXECUTION_TIME_LIMIT of CPU time
            "--memory", `${EXECUTION_MEMORY_LIMIT}m`, // Limit memory to EXECUTION_MEMORY_LIMIT MB
            "--mount",
            `type=bind,source=${tempFilePath},target=/main.cs,readonly`, // User does not have root permissions
            CSHARP_IMAGE_TAG,
            "sh", "-c", "cp /main.cs tempApp/Program.cs && cd tempApp && dotnet run tempApp/Program.cs" // Compile and run the C# program
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
