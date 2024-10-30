// compile and execute java code
import { ExecutionOptions, ExecutionResult, Executor } from "./executor";
import {
    cleanupFile,
    createTempFile,
    getUniqueFileName,
    spawnHelper,
} from "./utils";

export class JavaExecutor implements Executor {
    async execute(options: ExecutionOptions): Promise<ExecutionResult> {
        //create a temp file with the code to run
        const uniqueFileName = getUniqueFileName();
        const javaFileName = `${uniqueFileName}.java`;
        const classFileName = `${uniqueFileName}.class`;
        const javaFilePath = await createTempFile(javaFileName, options.code);
        try{
            //compile the java code
            const compileResult = await spawnHelper({
                command: "javac",
                args: [javaFilePath],
            });
            if (compileResult.code !== 0) {
                //if compilation failed, return the error message and stop execution
                return {
                    stdout: compileResult.stdout,
                    stderr: compileResult.stderr,

                };
            }
            //otherwise run the compiled java code
            const runResult = await spawnHelper({
                command: "java",
                args: [classFileName],
                options: { cwd: javaFilePath },
            });
            return {
                stdout: runResult.stdout,
                stderr: runResult.stderr,
            };
        } finally {
            //cleanup the temp files
            await cleanupFile(javaFilePath);
            await cleanupFile(`${javaFilePath}.class`);
        }

    }
}
