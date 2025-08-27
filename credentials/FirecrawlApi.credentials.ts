import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FirecrawlApi implements ICredentialType {
	name = 'firecrawlApi';
	displayName = 'Firecrawl API';
	documentationUrl = 'https://docs.firecrawl.dev/introduction';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Firecrawl API key. Get it from <a href="https://firecrawl.dev" target="_blank">firecrawl.dev</a>',
		},
		{
			displayName: 'API Host',
			name: 'apiHost',
			type: 'string',
			default: 'https://api.firecrawl.dev',
			description: 'The Firecrawl API host. Leave default unless using self-hosted instance.',
			required: false,
		},
	];
}