import { generateContentTypes } from '../types'
import { CMSConfig } from '../config/schema'

export function getContentSchemas<T extends CMSConfig>(config: T) {
    return generateContentTypes(config)
}
