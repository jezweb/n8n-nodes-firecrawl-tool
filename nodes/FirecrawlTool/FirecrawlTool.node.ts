import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	INodeExecutionData,
	IHttpRequestOptions,
	NodeOperationError,
	JsonObject,
} from 'n8n-workflow';

export class FirecrawlTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Firecrawl Tool',
		name: 'firecrawlTool',
		icon: 'file:firecrawl.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Web scraping, crawling, and data extraction tool using Firecrawl v2 API. Can extract content from websites, crawl entire domains, map site structures, search the web, and extract structured data using AI. Perfect for both workflow automation and AI agent tools.',
		defaults: {
			name: 'Firecrawl Tool',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'firecrawlApi',
				required: true,
			},
		],
		// This is critical for AI tool compatibility
		usableAsTool: true,
		properties: [
			// Operation Selection
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape',
						value: 'scrape',
						description: 'Extract content from a single webpage. Use this when you need to get data from one specific URL.',
					},
					{
						name: 'Crawl',
						value: 'crawl',
						description: 'Recursively scrape an entire website or subdomain. Use this when you need content from multiple pages.',
					},
					{
						name: 'Map',
						value: 'map',
						description: 'Get all URLs from a website quickly. Use this to discover the structure of a site.',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search the web and optionally scrape results. Use this when you need to find information across the internet.',
					},
					{
						name: 'Extract',
						value: 'extract',
						description: 'Extract structured data from webpages using AI. Use this when you need specific data fields from pages.',
					},
				],
				default: 'scrape',
			},

			// ===== SCRAPE OPERATION =====
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['scrape'],
					},
				},
				default: '',
				placeholder: 'https://example.com',
				description: 'The URL of the webpage to scrape. Example: https://docs.firecrawl.dev',
			},
			{
				displayName: 'Formats',
				name: 'formats',
				type: 'multiOptions',
				displayOptions: {
					show: {
						operation: ['scrape'],
					},
				},
				options: [
					{
						name: 'Markdown',
						value: 'markdown',
						description: 'Clean markdown format, ideal for LLMs',
					},
					{
						name: 'HTML',
						value: 'html',
						description: 'Cleaned HTML content',
					},
					{
						name: 'Summary',
						value: 'summary',
						description: 'AI-generated summary of the page',
					},
					{
						name: 'Screenshot',
						value: 'screenshot',
						description: 'Visual screenshot of the page',
					},
					{
						name: 'Links',
						value: 'links',
						description: 'Extract all links from the page',
					},
				],
				default: ['markdown'],
				description: 'Output formats to return. Markdown is best for AI consumption.',
			},
			{
				displayName: 'Additional Options',
				name: 'scrapeOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['scrape'],
					},
				},
				options: [
					{
						displayName: 'Only Main Content',
						name: 'onlyMainContent',
						type: 'boolean',
						default: true,
						description: 'Whether to extract only the main content, removing navigation, footers, etc.',
					},
					{
						displayName: 'Max Age (seconds)',
						name: 'maxAge',
						type: 'number',
						default: 172800,
						description: 'Cache duration in seconds. Use cached data if available and younger than maxAge. Default is 2 days (172800 seconds).',
					},
					{
						displayName: 'Wait For (ms)',
						name: 'waitFor',
						type: 'number',
						default: 0,
						description: 'Time to wait for dynamic content to load in milliseconds',
					},
					{
						displayName: 'JSON Extraction',
						name: 'jsonExtraction',
						type: 'json',
						default: '',
						description: 'Extract structured data using a JSON schema. Example: {"type": "json", "prompt": "Extract product details", "schema": {"name": "string", "price": "number"}}',
					},
					{
						displayName: 'Actions',
						name: 'actions',
						type: 'json',
						default: '',
						description: 'Actions to perform before scraping (click, scroll, wait, etc.). Example: [{"type": "wait", "milliseconds": 1000}, {"type": "click", "selector": "button"}]',
					},
					{
						displayName: 'Remove Base64 Images',
						name: 'removeBase64Images',
						type: 'boolean',
						default: true,
						description: 'Whether to remove base64 encoded images from output',
					},
					{
						displayName: 'Mobile',
						name: 'mobile',
						type: 'boolean',
						default: false,
						description: 'Whether to use mobile viewport',
					},
					{
						displayName: 'Include Tags',
						name: 'includeTags',
						type: 'string',
						default: '',
						description: 'Comma-separated HTML tags to include (e.g., "article,main,div.content")',
					},
					{
						displayName: 'Exclude Tags',
						name: 'excludeTags',
						type: 'string',
						default: '',
						description: 'Comma-separated HTML tags to exclude (e.g., "nav,footer,aside")',
					},
				],
			},

			// ===== CRAWL OPERATION =====
			{
				displayName: 'URL',
				name: 'crawlUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['crawl'],
					},
				},
				default: '',
				placeholder: 'https://example.com',
				description: 'The starting URL for the crawl. The crawler will discover and scrape all accessible pages from this starting point.',
			},
			{
				displayName: 'Crawl Options',
				name: 'crawlOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['crawl'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Maximum number of pages to crawl',
					},
					{
						displayName: 'Max Depth',
						name: 'maxDepth',
						type: 'number',
						default: 3,
						description: 'Maximum depth to crawl from the starting URL',
					},
					{
						displayName: 'Smart Crawl Prompt',
						name: 'prompt',
						type: 'string',
						default: '',
						description: 'Natural language prompt to intelligently guide the crawl. Example: "Only crawl blog posts from 2024"',
						typeOptions: {
							rows: 3,
						},
					},
					{
						displayName: 'Include Paths',
						name: 'includePaths',
						type: 'string',
						default: '',
						description: 'Comma-separated paths to include (e.g., "/blog,/articles")',
					},
					{
						displayName: 'Exclude Paths',
						name: 'excludePaths',
						type: 'string',
						default: '',
						description: 'Comma-separated paths to exclude (e.g., "/admin,/private")',
					},
					{
						displayName: 'Allow External Links',
						name: 'allowExternalLinks',
						type: 'boolean',
						default: false,
						description: 'Whether to follow links to external domains',
					},
					{
						displayName: 'Ignore Sitemap',
						name: 'ignoreSitemap',
						type: 'boolean',
						default: false,
						description: 'Whether to ignore the sitemap when crawling',
					},
					{
						displayName: 'Wait for Completion',
						name: 'waitForCompletion',
						type: 'boolean',
						default: true,
						description: 'Whether to wait for the crawl to complete or return immediately with a job ID',
					},
				],
			},

			// ===== MAP OPERATION =====
			{
				displayName: 'URL',
				name: 'mapUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['map'],
					},
				},
				default: '',
				placeholder: 'https://example.com',
				description: 'The website URL to map. This will discover all URLs on the site.',
			},
			{
				displayName: 'Map Options',
				name: 'mapOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['map'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of URLs to return',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Filter URLs by search term',
					},
					{
						displayName: 'Include Subdomains',
						name: 'includeSubdomains',
						type: 'boolean',
						default: false,
						description: 'Whether to include URLs from subdomains',
					},
				],
			},

			// ===== SEARCH OPERATION =====
			{
				displayName: 'Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				description: 'The search query. Example: "n8n workflow automation"',
			},
			{
				displayName: 'Search Options',
				name: 'searchOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 5,
						description: 'Number of search results to return',
					},
					{
						displayName: 'Sources',
						name: 'sources',
						type: 'multiOptions',
						options: [
							{
								name: 'Web',
								value: 'web',
								description: 'Web search results',
							},
							{
								name: 'News',
								value: 'news',
								description: 'News articles',
							},
							{
								name: 'Images',
								value: 'images',
								description: 'Image search results',
							},
						],
						default: ['web'],
						description: 'Sources to search',
					},
					{
						displayName: 'Scrape Results',
						name: 'scrapeResults',
						type: 'boolean',
						default: false,
						description: 'Whether to scrape the content of search results',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Location for localized search results (e.g., "United States")',
					},
				],
			},

			// ===== EXTRACT OPERATION =====
			{
				displayName: 'URLs',
				name: 'extractUrls',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['extract'],
					},
				},
				default: '',
				description: 'Comma-separated URLs to extract data from. Example: "https://example.com/page1,https://example.com/page2"',
			},
			{
				displayName: 'Extraction Prompt',
				name: 'extractPrompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['extract'],
					},
				},
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Natural language prompt describing what data to extract. Example: "Extract the product name, price, and description from each page"',
			},
			{
				displayName: 'Extract Options',
				name: 'extractOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['extract'],
					},
				},
				options: [
					{
						displayName: 'Schema',
						name: 'schema',
						type: 'json',
						default: '',
						description: 'JSON schema for structured extraction. Example: {"productName": "string", "price": "number", "inStock": "boolean"}',
					},
					{
						displayName: 'Allow External Links',
						name: 'allowExternalLinks',
						type: 'boolean',
						default: false,
						description: 'Whether to follow and extract from external links',
					},
					{
						displayName: 'Enable Web Search',
						name: 'enableWebSearch',
						type: 'boolean',
						default: false,
						description: 'Whether to enable web search for additional context',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('firecrawlApi');

		if (!credentials.apiKey) {
			throw new NodeOperationError(
				this.getNode(),
				'Firecrawl API key is required. Please add it in the credentials.',
			);
		}

		const apiHost = (credentials.apiHost as string) || 'https://api.firecrawl.dev';
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject = {};

				switch (operation) {
					case 'scrape':
						responseData = await this.handleScrape.call(this, i, apiHost, credentials.apiKey as string);
						break;

					case 'crawl':
						responseData = await this.handleCrawl.call(this, i, apiHost, credentials.apiKey as string);
						break;

					case 'map':
						responseData = await this.handleMap.call(this, i, apiHost, credentials.apiKey as string);
						break;

					case 'search':
						responseData = await this.handleSearch.call(this, i, apiHost, credentials.apiKey as string);
						break;

					case 'extract':
						responseData = await this.handleExtract.call(this, i, apiHost, credentials.apiKey as string);
						break;

					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
						);
				}

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	// Scrape handler
	private async handleScrape(
		this: IExecuteFunctions,
		itemIndex: number,
		apiHost: string,
		apiKey: string,
	): Promise<IDataObject> {
		const url = this.getNodeParameter('url', itemIndex) as string;
		const formats = this.getNodeParameter('formats', itemIndex) as string[];
		const options = this.getNodeParameter('scrapeOptions', itemIndex) as IDataObject;

		const body: IDataObject = {
			url,
			formats,
		};

		// Add options if provided
		if (options.onlyMainContent !== undefined) {
			body.onlyMainContent = options.onlyMainContent;
		}
		if (options.maxAge) {
			body.maxAge = options.maxAge;
		}
		if (options.waitFor) {
			body.waitFor = options.waitFor;
		}
		if (options.removeBase64Images !== undefined) {
			body.removeBase64Images = options.removeBase64Images;
		}
		if (options.mobile) {
			body.mobile = options.mobile;
		}
		if (options.includeTags) {
			body.includeTags = (options.includeTags as string).split(',').map(tag => tag.trim());
		}
		if (options.excludeTags) {
			body.excludeTags = (options.excludeTags as string).split(',').map(tag => tag.trim());
		}
		if (options.jsonExtraction) {
			try {
				body.formats = [...formats, JSON.parse(options.jsonExtraction as string)];
			} catch (e) {
				// If not valid JSON, treat as prompt
				body.formats = [...formats, { type: 'json', prompt: options.jsonExtraction }];
			}
		}
		if (options.actions) {
			body.actions = JSON.parse(options.actions as string);
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `${apiHost}/v2/scrape`,
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		};

		const response = await this.helpers.httpRequest(requestOptions);
		return response.data || response;
	}

	// Crawl handler
	private async handleCrawl(
		this: IExecuteFunctions,
		itemIndex: number,
		apiHost: string,
		apiKey: string,
	): Promise<IDataObject> {
		const url = this.getNodeParameter('crawlUrl', itemIndex) as string;
		const options = this.getNodeParameter('crawlOptions', itemIndex) as IDataObject;

		const body: IDataObject = {
			url,
		};

		// Add options
		if (options.limit) body.limit = options.limit;
		if (options.maxDepth) body.maxDepth = options.maxDepth;
		if (options.prompt) body.prompt = options.prompt;
		if (options.includePaths) {
			body.includePaths = (options.includePaths as string).split(',').map(path => path.trim());
		}
		if (options.excludePaths) {
			body.excludePaths = (options.excludePaths as string).split(',').map(path => path.trim());
		}
		if (options.allowExternalLinks) body.allowExternalLinks = options.allowExternalLinks;
		if (options.ignoreSitemap) body.ignoreSitemap = options.ignoreSitemap;

		// Start the crawl
		const startOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `${apiHost}/v2/crawl`,
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		};

		const startResponse = await this.helpers.httpRequest(startOptions);

		// If not waiting for completion, return job info
		if (!options.waitForCompletion) {
			return startResponse;
		}

		// Poll for completion
		const jobId = startResponse.id;
		let attempts = 0;
		const maxAttempts = 60; // 5 minutes with 5-second intervals
		const pollInterval = 5000; // 5 seconds

		while (attempts < maxAttempts) {
			await new Promise(resolve => setTimeout(resolve, pollInterval));

			const statusOptions: IHttpRequestOptions = {
				method: 'GET',
				url: `${apiHost}/v2/crawl/${jobId}`,
				headers: {
					'Authorization': `Bearer ${apiKey}`,
				},
				json: true,
			};

			const statusResponse = await this.helpers.httpRequest(statusOptions);

			if (statusResponse.status === 'completed') {
				return statusResponse;
			}

			if (statusResponse.status === 'failed') {
				throw new NodeOperationError(
					this.getNode(),
					`Crawl job failed: ${statusResponse.error || 'Unknown error'}`,
				);
			}

			attempts++;
		}

		throw new NodeOperationError(
			this.getNode(),
			'Crawl job timed out after 5 minutes',
		);
	}

	// Map handler
	private async handleMap(
		this: IExecuteFunctions,
		itemIndex: number,
		apiHost: string,
		apiKey: string,
	): Promise<IDataObject> {
		const url = this.getNodeParameter('mapUrl', itemIndex) as string;
		const options = this.getNodeParameter('mapOptions', itemIndex) as IDataObject;

		const body: IDataObject = {
			url,
		};

		if (options.limit) body.limit = options.limit;
		if (options.search) body.search = options.search;
		if (options.includeSubdomains) body.includeSubdomains = options.includeSubdomains;

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `${apiHost}/v2/map`,
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		};

		const response = await this.helpers.httpRequest(requestOptions);
		return response;
	}

	// Search handler
	private async handleSearch(
		this: IExecuteFunctions,
		itemIndex: number,
		apiHost: string,
		apiKey: string,
	): Promise<IDataObject> {
		const query = this.getNodeParameter('searchQuery', itemIndex) as string;
		const options = this.getNodeParameter('searchOptions', itemIndex) as IDataObject;

		const body: IDataObject = {
			query,
		};

		if (options.limit) body.limit = options.limit;
		if (options.sources) body.sources = options.sources;
		if (options.location) body.location = options.location;

		// Add scrape options if enabled
		if (options.scrapeResults) {
			body.scrapeOptions = {
				formats: ['markdown'],
				onlyMainContent: true,
			};
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `${apiHost}/v2/search`,
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		};

		const response = await this.helpers.httpRequest(requestOptions);
		return response.data || response;
	}

	// Extract handler
	private async handleExtract(
		this: IExecuteFunctions,
		itemIndex: number,
		apiHost: string,
		apiKey: string,
	): Promise<IDataObject> {
		const urlsString = this.getNodeParameter('extractUrls', itemIndex) as string;
		const prompt = this.getNodeParameter('extractPrompt', itemIndex) as string;
		const options = this.getNodeParameter('extractOptions', itemIndex) as IDataObject;

		const urls = urlsString.split(',').map(url => url.trim());

		const body: IDataObject = {
			urls,
			prompt,
		};

		if (options.schema) {
			try {
				body.schema = JSON.parse(options.schema as string);
			} catch (e) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid JSON schema provided',
				);
			}
		}
		if (options.allowExternalLinks) body.allowExternalLinks = options.allowExternalLinks;
		if (options.enableWebSearch) body.enableWebSearch = options.enableWebSearch;

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `${apiHost}/v2/extract`,
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body,
			json: true,
		};

		const response = await this.helpers.httpRequest(requestOptions);
		return response.data || response;
	}
}