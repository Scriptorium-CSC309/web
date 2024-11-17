import { EXECUTION_MEMORY_LIMIT, EXECUTION_TIME_LIMIT } from "../constants";
import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";

const PYTHON_IMAGE_TAG = process.env.PYTHON_IMAGE_TAG!;

export class PythonExecutor implements Executor {
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        const uniqueId = getUniqueFileName();
        const tempFileName = uniqueId + ".py";
        const tempFilePath = await createTempFile(tempFileName, options.code);

        const dockerArgs = [
            'run',
            '-i',  // Interactivity is needed for providing stdin
            '--rm',  // Automatically remove the container after execution
            '--ulimit', `cpu=${EXECUTION_TIME_LIMIT}`,  // Limit to EXECUTION_TIME_LIMIT of CPU time
            '--memory', `${EXECUTION_MEMORY_LIMIT}m`, // Limit memory to EXECUTION_MEMORY_LIMIT MB
            '--mount', `type=bind,source=${tempFilePath},target=/code.py,readonly`,  
            PYTHON_IMAGE_TAG,
            'python3', '/code.py'  // command to execute in the shell after the image is built
        ];

        let { stdout, stderr, code } = await spawnHelper(
            { command: "docker", args: dockerArgs },
            options.stdin
        );


        // TODO: this approach works unless code itself exits with status 137. Think about what to do then 
        const FORCED_DOCKER_EXIT_CODE = 137;
        if (code == FORCED_DOCKER_EXIT_CODE) {   
            stderr += "process exited with code 137. Most likely due to exceeding memory or CPU time limit."
        }

        try {
            await cleanupFile(tempFilePath);
        } catch (error) {
            console.error(`Error deleting  file: ${error}`);
        }
        return { stdout: stdout, stderr: stderr };
    }
}
