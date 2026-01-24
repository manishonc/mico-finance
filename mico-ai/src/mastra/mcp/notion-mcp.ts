import { MCPClient } from '@mastra/mcp';

// Connect to Notion MCP server using @suekou/mcp-notion-server
// The official @notionhq/notion-mcp-server has a bug with icon property (Issue #130)
export const notionMcpClient = new MCPClient({
  servers: {
    notion: {
      command: 'npx',
      args: ['-y', '@suekou/mcp-notion-server'],
      env: {
        NOTION_API_TOKEN: process.env.NOTION_TOKEN || process.env.NOTION_API_KEY || '',
        NOTION_MARKDOWN_CONVERSION: 'true',
      },
    },
  },
  timeout: 60000,
});
