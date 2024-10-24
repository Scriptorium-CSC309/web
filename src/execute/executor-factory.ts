// a simple functional "factory" to create an Executor

import { CExecutor } from "./C-executor";
import { PythonExecutor } from "./python-executor";

export class ExecutorFactory {
    /**
     * Return an Executor of the given language, or null if the language is not supported.
     * @param language the language to be executed
     */
    static fromLanguage(language: string | undefined) {
        switch (language) {
            case "Python":
                return new PythonExecutor();
            case "C":
                return new CExecutor();
            default:
                return null;
        }
    }
}
