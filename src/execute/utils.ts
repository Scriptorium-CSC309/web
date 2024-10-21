import * as path from "path";
import * as os from "os";
import { promises as fs } from "fs";
import { spawn, SpawnOptionsWithoutStdio } from "child_process";
import { randomBytes } from 'crypto';

// helpers for the execute use case

type SpawnArgs = {
    command: string;
    args?: readonly string[];
    options?: SpawnOptionsWithoutStdio;
};

type SpawnReturn = {
    stdout: string;
    stderr: string;
    code: number | null;
    signal: NodeJS.Signals | null;
};

/**
 * Spawn a process with possible stdin redirected and capturing stderr and stdout.
 * { command, args, options } are defined in the same way as in the spawn documentation.
 */
export async function spawnHelper(
    { command, args, options }: SpawnArgs,
    stdin?: string
): Promise<SpawnReturn> {
    return await new Promise<SpawnReturn>((resolve, reject) => {
        const process = spawn(command, args, options);

        let stdout = "";
        let stderr = "";

        // Capture stdout
        process.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        // Capture stderr
        process.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        // Handle errors in spawning the process
        process.on("error", (err) => {
            reject(new Error(`Failed to start process: ${err.message}`));
        });

        // Handle process exit
        process.on("close", async (code, signal) => {
            resolve({ stdout, stderr, code, signal });
        });

        // Write to stdin if provided
        if (stdin) {
            process.stdin.write(stdin);
        }

        // Close stdin to indicate no more data
        process.stdin.end();
    });
}

export function getUniqueFileName() {
    const timestamp = Date.now();
    const randomStr = randomBytes(8).toString('hex'); // Generates a 16-character hex string
    return `${timestamp}-${randomStr}`;
}

/**
 * Creates a temporary file with the specified name and writes the provided data to it.
 * @returns a promise containing the path of the newly created file if it succeeds.
 */
export async function createTempFile(
    tempFileName: string,
    data: string
): Promise<string> {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, tempFileName);

    try {
        await fs.writeFile(tempFilePath, data);
    } catch (error) {
        console.error(`Error writing to file ${tempFilePath}:`, error);
        throw error; // Re-throw the error after logging it
    }

    return tempFilePath;
}

/**
 * Deletes the specified file from the filesystem.
 * @param {string} filePath - The path to the file that needs to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully deleted.
 */
export async function cleanupFile(path: string): Promise<void> {
    try {
        await fs.unlink(path);
        console.log(`File ${path} deleted successfully.`);
    } catch (error) {
        console.log(error);
    }
}
