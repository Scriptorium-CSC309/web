// a simple functional "factory" to create an Executor

import { CExecutor } from "./C-executor";
import { PythonExecutor } from "./python-executor";
import { JSExecutor } from "./js-executor";
import { CppExecutor } from "./C++-executer";
import { JavaExecutor } from "./java-executor";
import { TSExecutor } from "./ts-executor";
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
            case "JS":
                return new JSExecutor();
            case "C++":
                return new CppExecutor();
            case "Java":
                return new JavaExecutor(); 
            case "TS":
                return new TSExecutor();
            default:
                return null;
        }
    }
}
