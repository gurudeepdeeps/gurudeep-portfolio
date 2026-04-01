import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

// Initialize Appwrite Client
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "your_project_id");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Appwrite Configuration
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "portfolio_db";
export const APPWRITE_COLLECTION_PROJECTS = import.meta.env.VITE_APPWRITE_COLLECTION_PROJECTS || "projects_collection";
export const APPWRITE_COLLECTION_EXPERIENCE = import.meta.env.VITE_APPWRITE_COLLECTION_EXPERIENCE || "experience_collection";
export const APPWRITE_COLLECTION_ENQUIRIES = import.meta.env.VITE_APPWRITE_COLLECTION_ENQUIRIES || "enquiries_collection";
export const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || "portfolio_bucket";

export { client, account, databases, storage };

// Auth Utils
export const login = async (email: string, pass: string) => {
    return await account.createEmailPasswordSession(email, pass);
};

export const logout = async () => {
    return await account.deleteSession("current");
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        return null; // Not logged in
    }
};

export const hasAppwriteSessionCookie = () => {
    if (typeof document === "undefined") {
        return false;
    }

    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";
    const expectedPrefix = projectId ? `a_session_${projectId}` : "a_session_";

    return document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .some((cookie) => cookie.startsWith(expectedPrefix) || cookie.startsWith("a_session_"));
};
