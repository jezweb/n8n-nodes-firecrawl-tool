# Changelog

All notable changes to n8n-nodes-firecrawl-tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-08-27

### Added
- Initial release of n8n-nodes-firecrawl-tool
- Full Firecrawl v2 API integration
- Five core operations:
  - **Scrape**: Extract content from single webpages
  - **Crawl**: Recursively scrape entire websites
  - **Map**: Discover all URLs on a website
  - **Search**: Web search with optional content scraping
  - **Extract**: AI-powered structured data extraction
- AI Tool compatibility with `usableAsTool: true`
- Comprehensive parameter descriptions for AI agents
- Caching support with configurable `maxAge`
- Actions support (click, scroll, wait, screenshot)
- Smart crawling with natural language prompts
- Multi-format output (markdown, HTML, summary, screenshots, links, JSON)
- Support for both cloud and self-hosted Firecrawl instances
- Error handling with `continueOnFail` support
- Async operation handling for crawl jobs
- Full TypeScript implementation
- Custom Firecrawl icon

### Features
- **Scrape Operation**:
  - Multiple output formats
  - JSON extraction with schema support
  - Page interactions before scraping
  - Content filtering (include/exclude tags)
  - Mobile viewport option
  - Base64 image removal

- **Crawl Operation**:
  - Intelligent crawling with prompts
  - Depth and limit controls
  - Path filtering (include/exclude)
  - External link handling
  - Sitemap support
  - Async with polling or immediate job ID return

- **Map Operation**:
  - Fast URL discovery
  - Search filtering
  - Subdomain inclusion

- **Search Operation**:
  - Multiple sources (web, news, images)
  - Optional result scraping
  - Location-based results

- **Extract Operation**:
  - Natural language prompts
  - Optional JSON schema
  - Multi-URL support
  - Web search enhancement

### Documentation
- Comprehensive README with examples
- Architecture documentation
- Deployment guide for multiple environments
- AI tool usage guidelines

### Developer Experience
- TypeScript for type safety
- ESLint configuration
- Prettier formatting
- Development mode with watch
- Clear error messages

### Known Limitations
- WebSocket crawling not yet implemented
- Batch scraping uses sequential requests
- No Redis caching support (uses API caching only)

## [Unreleased]

### Planned Features
- WebSocket support for real-time crawl updates
- Batch scraping optimization
- Redis caching integration
- Webhook callbacks for async operations
- Pre-configured extraction templates
- Custom action sequences builder
- Rate limit management utilities
- Advanced filtering with regex support
- Export to various formats (CSV, Excel, etc.)
- Integration with n8n's binary data handling

### Under Consideration
- Puppeteer integration for complex interactions
- Proxy rotation support
- CAPTCHA handling assistance
- Visual scraping with element selection
- Scheduled crawling with cron support
- Differential crawling (only new/changed content)
- Content validation and quality checks
- Multi-language content handling improvements

---

## Version History Summary

| Version | Date | Type | Description |
|---------|------|------|-------------|
| 0.1.0 | 2025-08-27 | Initial Release | Full Firecrawl v2 API integration with AI tool support |

---

## How to Upgrade

### From npm

```bash
cd ~/.n8n/custom
npm update n8n-nodes-firecrawl-tool
# Restart n8n
```

### From Community Nodes

1. Go to Settings → Community Nodes
2. Find n8n-nodes-firecrawl-tool
3. Click Update if available
4. Restart n8n

---

## Support

For issues, feature requests, or questions:
- [GitHub Issues](https://github.com/jezweb/n8n-nodes-firecrawl-tool/issues)
- [n8n Community Forum](https://community.n8n.io)