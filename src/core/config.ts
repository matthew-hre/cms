export type CollectionType = "static" | "dynamic";
export type FieldType = "string" | "text" | "string[]" | `${string}?`;

export interface CmsConfig {
    repo: string;
    directory: string;
    collections: Record<
        string,
        {
            type: CollectionType;
            folder: string;
            schema: Record<string, FieldType>;
        }
    >;
}

export function defineCms(config: CmsConfig): CmsConfig {
    return config;
}
