export const LANGUAGES = [
  "C++",
  "C",
  "Python",
  "Java",
  "JS",
  "TS",
  "C#",
  "Ruby",
  "PHP",
  "Go"
];
export const NUM_AVATARS = 5;
export const VALID_PHONE_NUMBER = /^\+?[1-9]\d{1,14}$/; // E.164 phone format
export const MAX_CHARS_TITLE_DESCRIPTION = 500;
export const MAX_CHARS_CONTENT = 10000;
export const MIN_CHARS = 1;
export const MAX_CHARS_TAG = 50;
export const MIN_PAGES = 1;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 100;
export const MAX_PAGES = 100;
export const PAGE_SIZE = 10;
export const SERVER_ERROR_MSG = "Internal Server Error";
export const EXECUTION_MEMORY_LIMIT = 512; // in MB
export const EXECUTION_TIME_LIMIT = 20; // in seconds
export const TS_CONFIG_FILE = "tsconfig.json";
export const SORT_BY_OPTIONS = { valued: "valued", controversial: "controversial" };
export const TS_CONFIG_CONTENT = `{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "types": ["node"],
    "skipLibCheck": true
  }
}`;
