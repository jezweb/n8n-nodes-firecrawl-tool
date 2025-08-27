# Architecture Documentation

## Overview

The n8n-nodes-firecrawl-tool is a TypeScript-based n8n community node that provides integration with the Firecrawl v2 API. It's designed to work both as a standard workflow node and as an AI tool for use with n8n's AI Agent and MCP Trigger nodes.

## Project Structure

```
n8n-nodes-firecrawl-tool/
├── nodes/
│   └── FirecrawlTool/
│       └── FirecrawlTool.node.ts     # Main node implementation
├── credentials/
│   └── FirecrawlApi.credentials.ts   # Credential definition
├── icons/
│   └── firecrawl.svg                  # Node icon
├── dist/                              # Compiled JavaScript (generated)
├── package.json                       # Project manifest
├── tsconfig.json                      # TypeScript configuration
└── documentation/
    ├── README.md                      # User documentation
    ├── ARCHITECTURE.md                # This file
    ├── DEPLOYMENT.md                  # Deployment guide
    ├── CHANGELOG.md                   # Version history
    └── CLAUDE.md                      # AI development notes
```

## Core Components

### 1. FirecrawlTool Node (`FirecrawlTool.node.ts`)

The main node implementation that provides five operations:

#### Operations Architecture

```typescript
interface Operations {
  scrape: {
    purpose: "Extract content from single URL"
    async: false
    formats: ["markdown", "html", "summary", "screenshot", "links", "json"]
  }
  crawl: {
    purpose: "Recursively scrape website"
    async: true  // Polls for completion
    features: ["smart prompts", "depth control", "path filtering"]
  }
  map: {
    purpose: "Discover all URLs"
    async: false
    output: "URL list"
  }
  search: {
    purpose: "Web search with optional scraping"
    async: false
    sources: ["web", "news", "images"]
  }
  extract: {
    purpose: "AI-powered data extraction"
    async: false
    features: ["schema support", "natural language prompts"]
  }
}
```

#### Key Design Decisions

1. **AI Tool Compatibility**: 
   - `usableAsTool: true` enables AI agent usage
   - Comprehensive descriptions for all parameters
   - Natural language friendly parameter names

2. **Error Handling**:
   - Implements `continueOnFail` pattern
   - Detailed error messages for debugging
   - Graceful degradation for missing optional parameters

3. **Async Operation Handling**:
   - Crawl operation implements polling mechanism
   - Configurable timeout and retry logic
   - Option to return immediately with job ID

### 2. Credentials (`FirecrawlApi.credentials.ts`)

Simple credential structure:
- `apiKey`: Required, password field
- `apiHost`: Optional, defaults to `https://api.firecrawl.dev`

Designed for both cloud and self-hosted Firecrawl instances.

### 3. API Integration Pattern

```typescript
// Standard request pattern
const requestOptions: IHttpRequestOptions = {
  method: 'POST',
  url: `${apiHost}/v2/${endpoint}`,
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: requestBody,
  json: true,
};

const response = await this.helpers.httpRequest(requestOptions);
```

## Data Flow

### 1. Input Processing

```
User Input → Node Parameters → Validation → API Request Body
```

- Parameters are extracted per item in the input array
- Validation ensures required fields are present
- Optional parameters are conditionally added to request body

### 2. API Communication

```
Request → Firecrawl API → Response → Data Transformation → Output
```

- Uses n8n's built-in HTTP helper for requests
- Handles both synchronous and asynchronous operations
- Transforms API responses to n8n's expected format

### 3. Output Structure

```typescript
interface NodeOutput {
  json: {
    // API response data
    data?: any;
    error?: string;
    // Operation-specific fields
  };
  pairedItem: {
    item: number; // Links output to input item
  };
}
```

## Operation Details

### Scrape Operation

**Flow:**
1. Parse URL and format options
2. Build request body with optional parameters
3. Send single POST request to `/v2/scrape`
4. Return formatted response

**Complexity:** Low
**API Calls:** 1

### Crawl Operation

**Flow:**
1. Start crawl job with POST to `/v2/crawl`
2. If `waitForCompletion`:
   - Poll `/v2/crawl/{jobId}` every 5 seconds
   - Check status (completed/failed/in-progress)
   - Return results or timeout after 5 minutes
3. Else return job ID immediately

**Complexity:** Medium
**API Calls:** 1 + N (polling)

### Map Operation

**Flow:**
1. Send POST to `/v2/map` with URL
2. Return list of discovered URLs

**Complexity:** Low
**API Calls:** 1

### Search Operation

**Flow:**
1. Build search query with sources
2. Optionally add scraping configuration
3. Send POST to `/v2/search`
4. Return search results (with content if scraping enabled)

**Complexity:** Low-Medium
**API Calls:** 1

### Extract Operation

**Flow:**
1. Parse URLs and extraction prompt
2. Optionally parse JSON schema
3. Send POST to `/v2/extract`
4. Return structured data

**Complexity:** Medium
**API Calls:** 1

## AI Tool Integration

### Design Principles

1. **Descriptive Parameters**: Every parameter includes detailed descriptions explaining when and how to use it

2. **Example Values**: Placeholders and descriptions include concrete examples

3. **Operation Guidance**: Each operation description explains its purpose and use cases

4. **Error Context**: Error messages provide actionable information for AI agents

### AI-Friendly Features

```typescript
{
  displayName: 'URL',
  description: 'The URL of the webpage to scrape. Example: https://docs.firecrawl.dev',
  // Clear, specific guidance for AI
}
```

## Performance Considerations

### Caching

- Default `maxAge` of 2 days for scrape operations
- Reduces API calls for frequently accessed content
- Configurable per operation

### Rate Limiting

- Respects Firecrawl API rate limits
- Implements exponential backoff for crawl polling
- Configurable timeouts and retry limits

### Resource Usage

- Streaming not implemented (uses standard HTTP requests)
- Memory usage proportional to response size
- Large crawls may require pagination handling

## Security Considerations

1. **Credential Storage**: API keys stored encrypted in n8n database
2. **Input Validation**: URLs and parameters validated before API calls
3. **Error Masking**: Sensitive information removed from error messages
4. **HTTPS Only**: All API communication over HTTPS

## Extension Points

### Adding New Operations

1. Add operation to the `options` array in node description
2. Implement handler method following pattern:
   ```typescript
   private async handleNewOperation(
     this: IExecuteFunctions,
     itemIndex: number,
     apiHost: string,
     apiKey: string,
   ): Promise<IDataObject>
   ```
3. Add case to switch statement in `execute()` method

### Adding New Parameters

1. Add to appropriate `displayOptions` section
2. Include in handler method's body construction
3. Update TypeScript interfaces if needed

## Testing Strategy

### Unit Testing
- Mock API responses for each operation
- Test parameter validation
- Test error handling paths

### Integration Testing
- Test with real Firecrawl API (requires API key)
- Verify all operations work end-to-end
- Test rate limit handling

### AI Tool Testing
- Test with n8n AI Agent node
- Verify descriptions are understood by AI
- Test parameter inference from natural language

## Dependencies

### Runtime Dependencies
- `@mendable/firecrawl-js`: Official Firecrawl SDK (v2)

### Peer Dependencies
- `n8n-workflow`: Core n8n workflow types and utilities

### Development Dependencies
- TypeScript toolchain
- ESLint for code quality
- Prettier for formatting

## Version Compatibility

- **n8n**: Tested with v1.25.0+
- **Firecrawl API**: v2
- **Node.js**: 18.x or higher
- **TypeScript**: 5.3.0

## Future Enhancements

1. **Streaming Support**: Implement WebSocket support for real-time crawl updates
2. **Batch Operations**: Add batch scraping for multiple URLs
3. **Template System**: Pre-configured extraction templates
4. **Advanced Caching**: Redis-based caching for team environments
5. **Webhook Support**: Async operations with webhook callbacks
6. **Custom Actions**: User-defined action sequences