/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly APPLICATION_BACKEND_URL: string;
    readonly BASE_URL: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly MODE: "development" | "production" | "staging";
}
