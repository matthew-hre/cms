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
                    const entry = config.static[key]
                    if (!entry) {
                        throw new Error(`[cms] Static entry "${key}" not found in config.`)
                    }
                    const filename = entry.filename
                    if (!filename) {
                        throw new Error(`[cms] Static entry "${key}" is missing a filename.`)
                    }

                    const raw = await adapter.readStatic(filename)
                    const data = JSON.parse(raw)
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
                    const entry = config.collections[key]
                    if (!entry) {
                        throw new Error(`[cms] Collection "${key}" not found in config.`)
                    }
                    const dir = entry.dir
                    if (!dir) {
                        throw new Error(`[cms] Collection "${key}" is missing a dir.`)
                    }

                    const files = await adapter.listCollection(dir)
                    const data = await Promise.all(
                        files.map(async (file) => {
                            const filePath = `${config.collectionsDir}/${dir}/${file}`
                            const raw = await adapter.readFile(filePath)
                            return JSON.parse(raw)
                        })
                    )
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
