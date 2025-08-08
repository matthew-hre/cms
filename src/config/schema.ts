import { z } from 'zod'

export const FieldType = z.union([
    z.literal('string'),
    z.literal('string?'),
    z.literal('string[]'),
])

const FieldValue: z.ZodType<any> = z.lazy(() =>
    z.union([
        FieldType,
        z.record(z.string(), FieldValue), // nested object
    ])
)

export const SchemaShape = z.record(z.string(), FieldValue)


export const StaticEntrySchema = z.object({
    filename: z.string().optional(),
    schema: SchemaShape,
})

export const CollectionSchema = z.object({
    dir: z.string().optional(),
    schema: SchemaShape,
})

export const CMSConfigSchema = z.object({
    repo: z.string(),
    contentPath: z.string().default('content'),

    staticDir: z.string().default('static'),
    collectionsDir: z.string().default('collections'),

    static: z.record(z.string(), StaticEntrySchema),
    collections: z.record(z.string(), CollectionSchema),
})

export type CMSConfig = z.infer<typeof CMSConfigSchema>
