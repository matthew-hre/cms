# @matthew-hre/cms (working title)

This is a lightweight, GitHub-backed CMS designed specifically for
[matthew-hre.com](https://matthew-hre.com). It's built to replace hardcoded JSON
and static content with a clean, Git-based editing UI.

It is **not** a general-purpose CMS. It's just enough for personal use, with the
potential to possibly grow into something larger later.

## Goals

- Store all content in the same repo as the site
- Use GitHub login to control access
- Read/write content directly to the main branch
- Manage both static (profile) and dynamic (projects) content
- Clean, schema-based config (`cms.config.ts`)
- No NextAuth, no database, no deployment nightmares
- Type safe all the way through

## Features (Completed Tasks)

### Core Library

- [x] `defineCMSConfig()` helper
- [x] Validate and normalize schema with Zod
- [x] Infer field types (`string`, `string?`, `string[]`, `number`, nested objects)
- [x] Type-safe content API for reading
- [x] Local file adapter for JSON content
- [x] Package build and export setup

## TODO

### GitHub Integration

- [ ] GitHub API adapter class
- [ ] GitHub OAuth login flow
- [ ] Get user token and store securely
- [ ] Verify user access to configured repo
- [ ] Read file(s) from GitHub repo via API
- [ ] Write/commit file(s) to GitHub repo
- [ ] Handle rate limiting and error cases

### Content Management API

- [ ] Write operations for static content
- [ ] Write operations for collections (create, update, delete)
- [ ] Content validation before writing
- [ ] Atomic operations and conflict resolution
- [ ] Content history/versioning support

### Admin UI

- [ ] React components for content editing
- [ ] Dynamic form generation from schema
- [ ] Form to edit static content (e.g., `profile.json`)
- [ ] List view for collections (e.g., `projects/*.json`)
- [ ] Form to edit/add collection items
- [ ] Delete collection items
- [ ] File upload handling for basic assets
- [ ] Real-time preview of changes

### Next.js Integration

- [ ] `/api/cms/auth/login` endpoint
- [ ] `/api/cms/auth/callback` endpoint
- [ ] `/api/cms/content` endpoint (get/save content)
- [ ] Middleware for auth protection
- [ ] Session management
- [ ] CSRF protection

## Out of Scope (for now)

- Rich text editing (Markdown/MDX)
- Image processing and optimization
- Live preview during editing
- PR-based editing or branch isolation
- Multi-user collaboration features
- Content scheduling/publishing workflows

## 📄 License

MIT © Matthew Hrehirchuk
