import { MCPServer } from '@mastra/mcp';

import { addTransactionTool } from '../tools/transaction-tool';
import { queryTransactionsTool } from '../tools/query-transactions-tool';

export const micoFinanceMcp = new MCPServer({
  id: 'mico-finance-mcp',
  name: 'Mico Finance MCP',
  version: '1.0.0',
  tools: {
    addTransactionTool,
    queryTransactionsTool,
  },
});

