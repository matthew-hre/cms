export interface Adapter {
    readStatic(path: string): Promise<string>;
    listCollection(dir: string): Promise<string[]>;
    readFile(path: string): Promise<string>;

    writeStatic(path: string, json: string, opts?: { expectedSha?: string }): Promise<{ sha: string }>;
    writeFile(path: string, json: string, opts?: { expectedSha?: string }): Promise<{ sha: string }>;
    deleteFile(path: string, opts?: { expectedSha?: string }): Promise<void>;
}
