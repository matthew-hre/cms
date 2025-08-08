// cms/src/content/index.ts
import { CMSConfig } from '../config/schema'
import { LocalContentAdapter } from '../adapters/local'
import { generateContentTypes } from '../types'
import { z } from 'zod'

type ContentAPI<T extends CMSConfig> = {
    static: {
        [K in keyof T['static']]: {
            get(): Promise<z.infer<ReturnType<typeof generateContentTypes<T>>['static'][K]>>
        }
    }
    collections: {
        [K in keyof T['collections']]: {
            getAll(): Promise<z.infer<ReturnType<typeof generateContentTypes<T>>['collections'][K]>[]>
        }
    }
}

export function createContentAPI<T extends CMSConfig>(config: T): ContentAPI<T> {
    const adapter = new LocalContentAdapter(config)
    const schemas = generateContentTypes(config)

    const staticContent = Object.fromEntries(
        Object.keys(config.static).map((key) => [
            key,
            {
                get: async () => {
                    const data = await adapter.getStatic(key)
                    return schemas.static[key].parse(data)
                }
            },
        ])
    ) as ContentAPI<T>['static']

    const collections = Object.fromEntries(
        Object.keys(config.collections).map((key) => [
            key,
            {
                getAll: async () => {
                    const data = await adapter.getAll(key)
                    return data.map(item => schemas.collections[key].parse(item))
                },
                // future: getBySlug(), create(), update(), etc.
            },
        ])
    ) as ContentAPI<T>['collections']

    return {
        static: staticContent,
        collections,
    }
}
