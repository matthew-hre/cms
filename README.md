# @matthew-hre/cms (working title)

This is a lightweight, GitHub-backed CMS designed specifically for
[matthew-hre.com](https://matthew-hre.com). It's built to replace hardcoded JSON
and static content with a clean, Git-based editing UI.

It is **not** a general-purpose CMS. It's just enough for personal use, with the
potential to possibly grow into something larger later.

## Goals

- Store all content in the same repo as the site (`src/content`)
- Use GitHub login to control access
- Read/write content directly to the main branch
- Manage both static (profile) and dynamic (projects) content
- Clean, schema-based config (`cms.config.ts`)
- No NextAuth, no database, no hosting headaches

## Content Model

### Static: `profile.json`

Single JSON file, fields:

- `name`: string
- `username`: string
- `description`: rich text
- `job`: rich text
- `location`: rich text
- `school`: rich text

### Dynamic: `projects/*.json`

Each project has:

- `name`: string
- `image`: optional string
- `fallbackColor`: string
- `description`: string
- `tags`: optional array of strings
- `url`: optional string
- `github`: optional string

## TODO

### Config

- [ ] `defineCms(config)` helper
- [ ] Validate and normalize schema
- [ ] Infer basic field types (`string`, `text`, `string[]`, etc)

### GitHub Integration

- [ ] GitHub OAuth login
- [ ] Get user token
- [ ] Verify access to repo
- [ ] Read file(s) from repo
- [ ] Write file(s) to repo with commit

### Admin UI

- [ ] Form to edit `profile.json`
- [ ] List of existing `projects/*.json`
- [ ] Form to edit/add projects
- [ ] Delete project (optional for MVP)

### API

- [ ] `/api/cms/auth/login`
- [ ] `/api/cms/auth/callback`
- [ ] `/api/cms/content` (get/save content)

### Dev/Test

- [ ] Test `getStaticContent()` for profile
- [ ] Test `getDynamicContent()` for projects
- [ ] Manual test on deployed site (Vercel)

## Out of Scope

- Image uploads
- Rich text editing
- Markdown/MDX support
- Live preview
- PR-based editing or branch isolation

## 📝 License

MIT © Matthew Hrehirchuk
