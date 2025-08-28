# n8n-nodes-firecrawl-tool Development Scratchpad

## Project Overview
Creating an n8n community node for Firecrawl v2 API that works both as a standard workflow node and as an AI tool for MCP triggers.

## Key Requirements
- [x] Initialize git repository
- [ ] Set up project structure
- [ ] Implement Firecrawl v2 API operations
- [ ] Make it AI-tool compatible (usableAsTool: true)
- [ ] Add comprehensive AI-friendly descriptions
- [ ] Test with local n8n
- [ ] Publish to GitHub and npm

## Firecrawl v2 Operations to Implement

### 1. Scrape
- Formats: markdown, html, summary, screenshot, links, json
- Caching with maxAge
- Actions support (click, scroll, wait)
- Only main content option

### 2. Crawl
- Async operation with polling
- Natural language prompts
- Limit, filters, depth options
- WebSocket support (optional)

### 3. Map
- Fast URL discovery
- Filtering options
- Sitemap support

### 4. Search
- Sources: web, news, images
- Optional scraping of results
- Location-based search

### 5. Extract
- Structured data extraction
- With/without schema
- Natural language prompts

## Technical Notes

### API Details
- Base URL: https://api.firecrawl.dev
- Auth: Bearer token in Authorization header
- SDK: @mendable/firecrawl-js v2

### n8n Specifics
- Must have `usableAsTool: true` for AI compatibility
- Need clear descriptions for AI to understand
- Support expressions in all fields
- Handle errors gracefully with continueOnFail

## Development Progress

### Phase 1: Setup ✅
- [x] Git init
- [x] Create scratchpad

### Phase 2: Structure ✅
- [x] package.json
- [x] tsconfig.json
- [x] .gitignore
- [x] Directory structure
- [x] ESLint configuration

### Phase 3: Implementation ✅
- [x] Credentials
- [x] Node implementation (all 5 operations)
- [x] Icons

### Phase 4: Documentation ✅
- [x] README
- [x] ARCHITECTURE
- [x] DEPLOYMENT
- [x] CHANGELOG
- [x] CLAUDE
- [x] LICENSE

### Phase 5: Testing ✅
- [x] TypeScript compilation
- [x] ESLint validation
- [ ] Local testing (skipped - will test on server)
- [ ] AI tool testing (to be done on server)

### Phase 6: Release ✅
- [x] GitHub repo: https://github.com/jezweb/n8n-nodes-firecrawl-tool
- [x] npm publish: https://www.npmjs.com/package/n8n-nodes-firecrawl-tool

## Important URLs
- Firecrawl Docs: https://docs.firecrawl.dev
- API Reference: https://docs.firecrawl.dev/api-reference/v2-introduction
- Node SDK: https://docs.firecrawl.dev/sdks/node
- n8n Node Creation: (local guide)

## Notes & Decisions
- Using Firecrawl v2 API (not v1)
- Following n8n naming convention: n8n-nodes-firecrawl-tool
- Making it AI-ready from the start
- Using TypeScript for type safety