import { CMSConfig } from "./schema"

export function normalizeConfig<T extends CMSConfig>(config: T): T {
    const staticEntries = Object.fromEntries(
        Object.entries(config.static).map(([key, value]) => [
            key,
            {
                filename: value.filename ?? `${key}.json`,
                schema: value.schema,
            },
        ])
    ) as T['static']

    const collections = Object.fromEntries(
        Object.entries(config.collections).map(([key, value]) => [
            key,
            {
                dir: value.dir ?? key,
                schema: value.schema,
            },
        ])
    ) as T['collections']

    return {
        ...config,
        static: staticEntries,
        collections,
    } as T
}
