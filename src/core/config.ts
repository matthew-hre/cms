import { z } from "zod";

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

const CmsConfigSchema = z.object({
    repo: z.string()
        .min(1, "Repository name is required")
        .regex(
            /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
            "Repository must be in the format 'user/repo'"
        ),
    directory: z.string().min(1, "Directory path is required"),
    collections: z.record(
        z.string(),
        z.object({
            type: z.enum(["static", "dynamic"]),
            folder: z.string().min(1, "Folder path is required"),
            schema: z.record(z.string(), z.string())
        })
    ).refine(
        (collections) => Object.keys(collections).length > 0,
        "At least one collection is required"
    )
});

export function defineCms(config: CmsConfig): CmsConfig {
    const validatedConfig = CmsConfigSchema.parse(config);

    const normalizedCollections = Object.entries(validatedConfig.collections).reduce(
        (acc, [name, collection]) => {
            const normalizedSchema = Object.entries(collection.schema).reduce(
                (schemaAcc, [fieldName, fieldType]) => {
                    const normalizedType = normalizeFieldType(fieldType);
                    schemaAcc[fieldName] = normalizedType;
                    return schemaAcc;
                },
                {} as Record<string, FieldType>
            );

            acc[name] = {
                ...collection,
                schema: normalizedSchema
            };
            return acc;
        },
        {} as CmsConfig["collections"]
    );

    return {
        ...validatedConfig,
        collections: normalizedCollections
    };
}

function normalizeFieldType(fieldType: string): FieldType {
    if (fieldType.endsWith("?")) {
        const baseType = fieldType.slice(0, -1);
        if (!isValidBaseFieldType(baseType)) {
            throw new Error(`Invalid field type: ${baseType}. Must be one of: string, text, string[]`);
        }
        return fieldType as FieldType;
    }

    if (!isValidBaseFieldType(fieldType)) {
        throw new Error(`Invalid field type: ${fieldType}. Must be one of: string, text, string[]`);
    }

    return fieldType as FieldType;
}

function isValidBaseFieldType(fieldType: string): boolean {
    return ["string", "text", "string[]"].includes(fieldType);
}

export function getBaseFieldType(fieldType: FieldType): "string" | "text" | "string[]" {
    if (fieldType.endsWith("?")) {
        return fieldType.slice(0, -1) as "string" | "text" | "string[]";
    }
    return fieldType as "string" | "text" | "string[]";
}

export function isOptionalField(fieldType: FieldType): boolean {
    return fieldType.endsWith("?");
}
