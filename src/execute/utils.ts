import * as path from "path";
import * as os from "os";
import { promises as fs } from "fs";

// helpers for the execute use case

/**
 * Creates a temporary file with the specified extension and writes the provided data to it.
 * @returns a promise containing the path of the newly created file.
 */
export async function createTempFile(
    extension: string,
    data: string
): Promise<string> {
    const tempDir = os.tmpdir();
    const uniqueSuffix = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
    const tempFileName = `temp_script_${uniqueSuffix}.${extension}`;
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
