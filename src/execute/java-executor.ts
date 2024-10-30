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
        //check if there is a public class in the code
        const publicClassMatch = options.code.match(/public\s+class\s+(\w+)/);
        let className = publicClassMatch ? publicClassMatch[1] : getUniqueFileName().replace(/[^a-zA-Z0-9]/g, "");
        const javaFileName = `${className}.java`;
        const javaFilePath = await createTempFile(javaFileName, options.code);
        const workingDirectory = javaFilePath.substring(0, javaFilePath.lastIndexOf("/")); //
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
                args: [javaFileName],
                options: { cwd: workingDirectory },
            });
            return {
                stdout: runResult.stdout,
                stderr: runResult.stderr,
            };
        } catch (error) {
            console.error(`Error running java code: ${error}`);
            return {
                stdout: "",
                stderr: `Unexpected Error: ${error}`,
            };
        }
        finally {
            //cleanup the temp files
            await cleanupFile(javaFilePath);
            // add check to make sure file exists before deleting
            await cleanupFile(`${workingDirectory}/${className}.class`).catch(error => {
                if (error.code !== 'ENOENT') {
                    console.error(`Error cleaning up class file: ${error}`);
                }
            });
        }

    }
}


