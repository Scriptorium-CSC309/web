// Defines components of the executor use case's interface that interacts with the controller in ~/pages/api/execute.

/**
 * Represents the options required to execute a piece of code.
 */
export interface ExecutionOptions {
    /**
     * The source code to be executed.
     */
    code: string;

    /**
     * (Optional) The standard input to be provided to the code during execution.
     * Useful for programs that require user input.
     */
    stdin?: string;
}

/**
 * Represents the result of executing a piece of code.
 */
export interface ExecutionResult {
    /**
     * The standard output produced by the executed code.
     * Contains any text that the code writes to the standard output stream.
     */
    stdout: string;

    /**
     * The standard error produced by the executed code.
     * Contains any error messages or logs that the code writes to the standard error stream.
     */
    stderr: string;
}

/**
 * Defines the contract for executors that can run code.
 */
export interface Executor {
    /**
     * Executes the provided code with the given options.
     */
    execute(options: ExecutionOptions): Promise<ExecutionResult>;
}
