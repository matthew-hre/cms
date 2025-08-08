import { z } from 'zod'
import { CMSConfig } from './config/schema'

type FieldTypeMap = {
    'string': z.ZodString
    'string?': z.ZodOptional<z.ZodString>
    'string[]': z.ZodArray<z.ZodString>
}

type SchemaFieldType = keyof FieldTypeMap

type ConvertSchema<T> = T extends SchemaFieldType
    ? FieldTypeMap[T]
    : T extends Record<string, any>
    ? z.ZodObject<{
        [K in keyof T]: ConvertSchema<T[K]>
    }>
    : never

type ConvertConfig<T extends CMSConfig> = {
    static: {
        [K in keyof T['static']]: ConvertSchema<T['static'][K]['schema']>
    }
    collections: {
        [K in keyof T['collections']]: ConvertSchema<T['collections'][K]['schema']>
    }
}

const fieldTypeMap = {
    'string': z.string(),
    'string?': z.string().optional(),
    'string[]': z.string().array(),
} as const

function convertSchemaObject(schema: Record<string, any>): z.ZodType<any> {
    const shape: Record<string, z.ZodTypeAny> = {}

    for (const [key, type] of Object.entries(schema)) {
        if (typeof type === 'string' && type in fieldTypeMap) {
            shape[key] = fieldTypeMap[type as SchemaFieldType]
        } else if (typeof type === 'object' && type !== null) {
            shape[key] = convertSchemaObject(type)
        } else {
            throw new Error(`Invalid schema type for key ${key}: ${type}`)
        }
    }

    return z.object(shape)
}

export function generateContentTypes<T extends CMSConfig>(config: T): ConvertConfig<T> {
    const staticTypes: Record<string, z.ZodType<any>> = {}
    const collectionTypes: Record<string, z.ZodType<any>> = {}

    for (const [key, entry] of Object.entries(config.static)) {
        staticTypes[key] = convertSchemaObject(entry.schema)
    }

    for (const [key, entry] of Object.entries(config.collections)) {
        collectionTypes[key] = convertSchemaObject(entry.schema)
    }

    return {
        static: staticTypes,
        collections: collectionTypes,
    } as ConvertConfig<T>
}
