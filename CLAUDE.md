# Claude Development Notes

## Project Overview

This is an n8n community node for Firecrawl v2 API, developed with Claude's assistance. The node is designed to work both as a standard workflow node and as an AI tool for use with n8n's AI Agent and MCP Trigger nodes.

## Development Context

### Original Requirements
- Create a modern Firecrawl node using v2 API (not v1)
- Make it AI-tool compatible (`usableAsTool: true`)
- Support all major Firecrawl operations
- Provide comprehensive AI-friendly descriptions
- Follow n8n community node best practices

### Key Design Decisions

1. **Firecrawl v2 Focus**: Chose to implement v2 API exclusively, as v1 is being deprecated and v2 offers better features like caching, summary format, and smart crawling.

2. **AI-First Design**: Every parameter includes detailed descriptions with examples, making the node immediately useful for AI agents without additional configuration.

3. **Operation Coverage**: Implemented all five major operations (Scrape, Crawl, Map, Search, Extract) to provide complete Firecrawl functionality.

4. **Error Handling**: Implemented n8n's `continueOnFail` pattern throughout, allowing workflows to handle errors gracefully.

5. **Async Handling**: Crawl operation includes both synchronous (wait for completion) and asynchronous (return job ID) modes.

## Implementation Details

### TypeScript Patterns Used

```typescript
// Standard n8n node pattern
export class FirecrawlTool implements INodeType {
  description: INodeTypeDescription = {
    usableAsTool: true, // Critical for AI compatibility
    // ...
  };
  
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Process each input item
    // Handle operations via switch statement
    // Return formatted output
  }
}
```

### API Integration Strategy

- Used n8n's built-in `httpRequest` helper instead of Firecrawl SDK
- This avoids dependency issues and gives more control over requests
- Consistent error handling across all operations

### Parameter Design Philosophy

Each parameter follows this pattern:
1. Clear `displayName` for UI
2. Technical `name` for code
3. Appropriate `type` with validation
4. Detailed `description` with examples
5. Smart `displayOptions` for conditional display

## Testing Scenarios

### Manual Testing Checklist

1. **Scrape Operation**
   - [x] Basic markdown extraction
   - [x] Multiple formats
   - [x] JSON extraction with schema
   - [x] Actions (click, scroll)
   - [x] Caching behavior

2. **Crawl Operation**
   - [x] Basic crawl with limit
   - [x] Smart crawl with prompt
   - [x] Async with job ID return
   - [x] Path filtering

3. **Map Operation**
   - [x] URL discovery
   - [x] Search filtering
   - [x] Subdomain handling

4. **Search Operation**
   - [x] Web search
   - [x] Multiple sources
   - [x] With/without scraping

5. **Extract Operation**
   - [x] Natural language extraction
   - [x] Schema-based extraction
   - [x] Multi-URL handling

### AI Tool Testing

Test prompts for AI agents:
```
"Get the content from https://docs.firecrawl.dev"
"Find all blog posts on example.com"
"Search for recent news about n8n"
"Extract product prices from this e-commerce page"
"Map all URLs on firecrawl.dev"
```

## Common Issues & Solutions

### Issue 1: API Key Not Found
**Solution**: Check credential configuration, ensure "firecrawlApi" matches exactly

### Issue 2: Timeout on Crawl
**Solution**: Implemented 5-minute timeout with 5-second polling intervals

### Issue 3: Large Response Handling
**Solution**: Let n8n handle response size limits, don't implement artificial restrictions

### Issue 4: Format Array Building
**Solution**: Carefully handle JSON format object vs string array formats

## Future Improvements

### High Priority
1. WebSocket support for real-time crawl updates
2. Batch scraping with parallel requests
3. Better error messages with API response details

### Medium Priority
1. Redis caching integration
2. Webhook callbacks for async operations
3. Template system for common extractions

### Nice to Have
1. Visual scraping UI
2. Proxy rotation support
3. Advanced authentication handling

## Code Quality Notes

### What Works Well
- Clear separation of concerns (one handler per operation)
- Consistent error handling
- Type safety throughout
- Comprehensive documentation

### Areas for Refactoring
- Could extract common request logic to helper method
- Polling logic could be abstracted
- Parameter validation could be centralized

## Deployment Notes

### npm Publishing
```bash
npm login
npm publish --access public
```

### GitHub Repository
Repository: https://github.com/jezweb/n8n-nodes-firecrawl-tool

### Version Management
- Follow semantic versioning
- Update CHANGELOG.md for each release
- Tag releases in git

## AI Development Tips

When working with Claude or other AI assistants on this codebase:

1. **Be Specific**: Mention "Firecrawl v2" not just "Firecrawl"
2. **Context Matters**: Provide the n8n node development guide
3. **Test Incrementally**: Build and test one operation at a time
4. **Documentation First**: Write docs alongside code
5. **AI Tool Focus**: Always consider how AI agents will use the node

## Maintenance Guidelines

### Regular Updates
- Check Firecrawl API changes monthly
- Update dependencies quarterly
- Review n8n compatibility with major releases

### Community Engagement
- Respond to GitHub issues promptly
- Share updates in n8n community forum
- Consider user feedback for new features

## Credits

- Developed by: Jeremy Dawes (Jezweb)
- AI Assistant: Claude (Anthropic)
- Date: August 27, 2025
- License: MIT

## Resources

- [Firecrawl Documentation](https://docs.firecrawl.dev)
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Forum](https://community.n8n.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Development Commands

```bash
# Build
npm run build

# Development mode
npm run dev

# Lint
npm run lint

# Format
npm run format

# Local testing
npm link
cd ~/.n8n/custom && npm link n8n-nodes-firecrawl-tool
```

## Environment Setup

Required:
- Node.js 18+
- TypeScript 5.3+
- n8n 1.25.0+
- Firecrawl API key

Optional:
- VS Code with n8n extension
- Postman for API testing
- Docker for containerized testing