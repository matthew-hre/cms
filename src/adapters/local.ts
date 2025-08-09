import path from 'node:path'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import { CMSConfig } from '../config/schema'
import { Adapter } from './types'

export class LocalContentAdapter implements Adapter {
    constructor(private config: CMSConfig) { }

    private getStaticPath(filename: string): string {
        return path.join(
            this.config.contentPath,
            this.config.staticDir,
            filename
        )
    }

    private getCollectionDir(dir: string): string {
        return path.join(
            this.config.contentPath,
            this.config.collectionsDir,
            dir
        )
    }

    private getContentPath(filePath: string): string {
        return path.join(this.config.contentPath, filePath)
    }

    private calculateSha(content: string): string {
        return crypto.createHash('sha256').update(content).digest('hex')
    }

    async readStatic(filePath: string): Promise<string> {
        const fullPath = this.getStaticPath(filePath)
        try {
            return await fs.readFile(fullPath, 'utf-8')
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                throw new Error(`[cms] Static file not found: ${fullPath}`)
            }
            throw new Error(`[cms] Failed to read static file: ${err.message}`)
        }
    }

    async listCollection(dir: string): Promise<string[]> {
        const fullDir = this.getCollectionDir(dir)
        try {
            const files = await fs.readdir(fullDir)
            return files.filter((f) => f.endsWith('.json'))
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                throw new Error(`[cms] Collection directory not found: ${fullDir}`)
            }
            throw new Error(`[cms] Failed to read collection directory: ${err.message}`)
        }
    }

    async readFile(filePath: string): Promise<string> {
        const fullPath = this.getContentPath(filePath)
        try {
            return await fs.readFile(fullPath, 'utf-8')
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                throw new Error(`[cms] File not found: ${fullPath}`)
            }
            throw new Error(`[cms] Failed to read file: ${err.message}`)
        }
    }

    async writeStatic(filePath: string, content: string, opts?: { expectedSha?: string }): Promise<{ sha: string }> {
        const fullPath = this.getStaticPath(filePath)

        if (opts?.expectedSha) {
            try {
                const existingContent = await fs.readFile(fullPath, 'utf-8')
                const existingSha = this.calculateSha(existingContent)
                if (existingSha !== opts.expectedSha) {
                    throw new Error(`[cms] SHA mismatch. Expected ${opts.expectedSha}, got ${existingSha}`)
                }
            } catch (err: any) {
                if (err.code !== 'ENOENT') {
                    throw err
                }
            }
        }

        await fs.mkdir(path.dirname(fullPath), { recursive: true })

        await fs.writeFile(fullPath, content, 'utf-8')

        return { sha: this.calculateSha(content) }
    }

    async writeFile(filePath: string, content: string, opts?: { expectedSha?: string }): Promise<{ sha: string }> {
        const fullPath = this.getContentPath(filePath)

        if (opts?.expectedSha) {
            try {
                const existingContent = await fs.readFile(fullPath, 'utf-8')
                const existingSha = this.calculateSha(existingContent)
                if (existingSha !== opts.expectedSha) {
                    throw new Error(`[cms] SHA mismatch. Expected ${opts.expectedSha}, got ${existingSha}`)
                }
            } catch (err: any) {
                if (err.code !== 'ENOENT') {
                    throw err
                }
            }
        }

        await fs.mkdir(path.dirname(fullPath), { recursive: true })

        await fs.writeFile(fullPath, content, 'utf-8')

        return { sha: this.calculateSha(content) }
    }

    async deleteFile(filePath: string, opts?: { expectedSha?: string }): Promise<void> {
        const fullPath = this.getContentPath(filePath)

        if (opts?.expectedSha) {
            try {
                const existingContent = await fs.readFile(fullPath, 'utf-8')
                const existingSha = this.calculateSha(existingContent)
                if (existingSha !== opts.expectedSha) {
                    throw new Error(`[cms] SHA mismatch. Expected ${opts.expectedSha}, got ${existingSha}`)
                }
            } catch (err: any) {
                if (err.code === 'ENOENT') {
                    throw new Error(`[cms] File not found: ${fullPath}`)
                }
                throw err
            }
        }

        try {
            await fs.unlink(fullPath)
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                throw new Error(`[cms] File not found: ${fullPath}`)
            }
            throw new Error(`[cms] Failed to delete file: ${err.message}`)
        }
    }

}
