import path from 'node:path'
import fs from 'node:fs/promises'
import { CMSConfig } from '../config/schema'

export class LocalContentAdapter {
    constructor(private config: CMSConfig) { }

    async getStatic<T = unknown>(key: string): Promise<T> {
        const entry = this.config.static[key]

        if (!entry) {
            throw new Error(`[cms] Static entry "${key}" not found in config.`)
        }

        const filename = entry.filename
        if (!filename) {
            throw new Error(`[cms] Static entry "${key}" is missing a filename.`)
        }

        const fullPath = path.join(
            this.config.contentPath,
            this.config.staticDir,
            filename
        )

        let raw: string
        try {
            raw = await fs.readFile(fullPath, 'utf-8')
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                throw new Error(`[cms] Static file not found: ${fullPath}`)
            }
            throw new Error(`[cms] Failed to read "${key}": ${err.message}`)
        }

        try {
            return JSON.parse(raw) as T
        } catch (err: any) {
            throw new Error(`[cms] Failed to parse "${key}" at ${fullPath}: ${err.message}`)
        }
    }

    async getAll<T = unknown>(collection: string): Promise<T[]> {
        const entry = this.config.collections[collection]

        if (!entry) {
            throw new Error(`[cms] Collection "${collection}" not found in config.`)
        }

        const dir = entry.dir
        if (!dir) {
            throw new Error(`[cms] Collection "${collection}" is missing a dir.`)
        }

        const fullDir = path.join(
            this.config.contentPath,
            this.config.collectionsDir,
            dir
        )

        let files: string[]
        try {
            files = await fs.readdir(fullDir)
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                throw new Error(`[cms] Collection directory not found: ${fullDir}`)
            }
            throw new Error(`[cms] Failed to read collection directory: ${err.message}`)
        }

        const jsonFiles = files.filter((f) => f.endsWith('.json'))

        const data = await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(fullDir, file)
                try {
                    const raw = await fs.readFile(filePath, 'utf-8')
                    return JSON.parse(raw) as T
                } catch (err: any) {
                    throw new Error(`[cms] Failed to read or parse ${filePath}: ${err.message}`)
                }
            })
        )

        return data
    }

}
