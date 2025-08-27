# Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- n8n instance (local or cloud)
- Firecrawl API key from [firecrawl.dev](https://firecrawl.dev)

## Installation Methods

### Method 1: Community Nodes (Recommended for Users)

1. Open your n8n instance
2. Navigate to **Settings** → **Community Nodes**
3. Search for `n8n-nodes-firecrawl-tool`
4. Click **Install**
5. Restart n8n when prompted
6. The node will appear in the nodes panel as "Firecrawl Tool"

### Method 2: npm Installation (Self-Hosted n8n)

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Install the package
npm install n8n-nodes-firecrawl-tool

# Restart n8n
pm2 restart n8n # or your n8n restart command
```

### Method 3: Docker Installation

If running n8n in Docker, mount a custom nodes directory:

```dockerfile
# docker-compose.yml
version: '3'
services:
  n8n:
    image: n8nio/n8n
    volumes:
      - ./custom-nodes:/home/node/.n8n/custom
    # ... other configuration
```

Then install in the mounted directory:

```bash
cd ./custom-nodes
npm install n8n-nodes-firecrawl-tool
docker-compose restart n8n
```

### Method 4: Development Installation

For development or testing:

```bash
# Clone the repository
git clone https://github.com/jezweb/n8n-nodes-firecrawl-tool.git
cd n8n-nodes-firecrawl-tool

# Install dependencies
npm install

# Build the node
npm run build

# Link globally
npm link

# Link to n8n
cd ~/.n8n/custom
npm link n8n-nodes-firecrawl-tool

# For development with watch mode
cd /path/to/n8n-nodes-firecrawl-tool
npm run dev
```

## Configuration

### Setting Up Firecrawl Credentials

1. **Get API Key:**
   - Visit [firecrawl.dev](https://firecrawl.dev)
   - Sign up or log in
   - Navigate to Dashboard → API Keys
   - Copy your API key

2. **Add to n8n:**
   - In n8n, go to **Credentials** → **New**
   - Search for "Firecrawl API"
   - Enter your API key
   - Optional: Change API host for self-hosted Firecrawl
   - Click **Create**

### Environment Variables (Optional)

For automated deployment, you can set credentials via environment:

```bash
# Not directly supported - credentials must be added via UI
# But you can automate via n8n API:
curl -X POST http://localhost:5678/api/v1/credentials \
  -H "X-N8N-API-KEY: your-n8n-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Firecrawl API",
    "type": "firecrawlApi",
    "data": {
      "apiKey": "fc-your-api-key",
      "apiHost": "https://api.firecrawl.dev"
    }
  }'
```

## Deployment Environments

### Local Development

```bash
# Install globally for development
npm install -g n8n
npm install -g n8n-nodes-firecrawl-tool

# Start n8n
n8n start
```

### Production Server

#### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start n8n with PM2
pm2 start n8n
pm2 save
pm2 startup

# Install the node
cd ~/.n8n/custom
npm install n8n-nodes-firecrawl-tool

# Restart n8n
pm2 restart n8n
```

#### Using Systemd

```ini
# /etc/systemd/system/n8n.service
[Unit]
Description=n8n workflow automation
After=network.target

[Service]
Type=simple
User=n8n
ExecStart=/usr/bin/n8n start
Restart=always
Environment="N8N_CUSTOM_EXTENSIONS=/home/n8n/.n8n/custom"

[Install]
WantedBy=multi-user.target
```

```bash
# Reload systemd and restart
sudo systemctl daemon-reload
sudo systemctl restart n8n
```

### Cloud Deployment

#### n8n Cloud

For n8n.cloud users:
1. This node should be available in the community nodes
2. Search and install via the UI
3. No manual deployment needed

#### Heroku

```json
// package.json in your n8n Heroku app
{
  "dependencies": {
    "n8n": "latest",
    "n8n-nodes-firecrawl-tool": "latest"
  }
}
```

#### Railway/Render

Add to your deployment configuration:

```bash
# Install script
npm install n8n-nodes-firecrawl-tool
```

## Verification

### Check Installation

1. Restart n8n after installation
2. Open the node creator panel
3. Search for "Firecrawl"
4. The "Firecrawl Tool" should appear

### Test the Node

Create a simple test workflow:

1. Add a Manual Trigger node
2. Add the Firecrawl Tool node
3. Connect them
4. Configure:
   - Operation: Scrape
   - URL: https://example.com
   - Formats: Markdown
5. Execute the workflow

Expected result: Markdown content from example.com

### Troubleshooting Installation

#### Node Not Appearing

```bash
# Check if installed
ls ~/.n8n/custom/node_modules | grep firecrawl

# Check n8n logs
n8n start --tunnel # Run in debug mode

# Verify package.json has n8n configuration
cat ~/.n8n/custom/node_modules/n8n-nodes-firecrawl-tool/package.json | grep n8n
```

#### Permission Issues

```bash
# Fix permissions
chmod -R 755 ~/.n8n/custom
chown -R $(whoami) ~/.n8n/custom
```

#### Clear Cache

```bash
# Clear n8n cache
rm -rf ~/.n8n/cache
# Restart n8n
```

## Updates

### Manual Update

```bash
cd ~/.n8n/custom
npm update n8n-nodes-firecrawl-tool
# Restart n8n
```

### Automatic Updates

Add to your deployment pipeline:

```bash
#!/bin/bash
# update-n8n-nodes.sh
cd ~/.n8n/custom
npm update
pm2 restart n8n
```

Add to crontab for weekly updates:
```bash
0 2 * * 0 /path/to/update-n8n-nodes.sh
```

## Monitoring

### Health Checks

Monitor node availability:

```javascript
// health-check.js
const axios = require('axios');

async function checkFirecrawlNode() {
  try {
    const response = await axios.get('http://localhost:5678/rest/node-types');
    const hasFirecrawl = response.data.data.some(
      node => node.name === 'firecrawlTool'
    );
    console.log('Firecrawl node available:', hasFirecrawl);
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

checkFirecrawlNode();
```

### Logging

Enable detailed logging:

```bash
# Start n8n with verbose logging
N8N_LOG_LEVEL=debug n8n start
```

## Security Considerations

### API Key Management

1. **Never commit API keys** to version control
2. **Use n8n's credential system** for secure storage
3. **Rotate keys regularly** via Firecrawl dashboard
4. **Set rate limits** appropriate to your plan

### Network Security

```nginx
# nginx configuration for n8n
location /webhook/ {
  proxy_pass http://localhost:5678;
  # Restrict to specific IPs if needed
  allow 192.168.1.0/24;
  deny all;
}
```

### Access Control

1. Use n8n's built-in authentication
2. Implement role-based access for credentials
3. Audit workflow executions regularly

## Performance Optimization

### Node Configuration

```javascript
// Optimize for high-volume scraping
{
  operation: 'scrape',
  formats: ['markdown'], // Only request needed formats
  scrapeOptions: {
    maxAge: 86400, // Cache for 24 hours
    onlyMainContent: true, // Reduce payload size
    removeBase64Images: true // Reduce memory usage
  }
}
```

### System Requirements

Minimum:
- 2GB RAM
- 2 CPU cores
- 10GB storage

Recommended for production:
- 8GB RAM
- 4 CPU cores
- 50GB storage
- SSD storage for better I/O

## Rollback Procedure

If issues occur after deployment:

```bash
# Uninstall the node
cd ~/.n8n/custom
npm uninstall n8n-nodes-firecrawl-tool

# Restart n8n
pm2 restart n8n

# Verify removal
ls node_modules | grep firecrawl # Should return nothing
```

## Support

### Getting Help

1. **GitHub Issues**: [Report bugs](https://github.com/jezweb/n8n-nodes-firecrawl-tool/issues)
2. **n8n Community**: [Forum discussions](https://community.n8n.io)
3. **Firecrawl Support**: [API documentation](https://docs.firecrawl.dev)

### Common Deployment Issues

| Issue | Solution |
|-------|----------|
| Node not appearing | Restart n8n, check logs |
| API key invalid | Verify key in Firecrawl dashboard |
| Rate limits | Upgrade Firecrawl plan or add delays |
| Memory issues | Reduce crawl limits, enable caching |
| Permission denied | Check file permissions in custom folder |

## Deployment Checklist

- [ ] Node.js version 18+ installed
- [ ] n8n instance running
- [ ] Firecrawl API key obtained
- [ ] Node package installed
- [ ] n8n restarted
- [ ] Credentials configured
- [ ] Test workflow created
- [ ] Basic functionality verified
- [ ] Monitoring set up
- [ ] Backups configured