import { CMSConfigSchema, CMSConfig } from './schema'
import { normalizeConfig } from './normalize'

export function defineCMSConfig<T extends CMSConfig>(config: T): T {
    const parsed = CMSConfigSchema.parse(config) as T
    return normalizeConfig(parsed) as T
}
