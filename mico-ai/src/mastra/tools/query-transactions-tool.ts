import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  return process.env.API_BASE_URL || 'http://localhost:3000';
};

export const queryTransactionsTool = createTool({
  id: 'query-transactions',
  description: `Query transactions summary with optional filters.
  This tool retrieves transaction summaries based on date range and/or category.
  
  Use this when the user asks:
  - "How much did we spend last week/month/year?"
  - "What's our total spending on food/shopping/etc.?"
  - "Show me transaction summary for [time period]"
  - Any question about spending amounts or transaction counts

  Input should be a structured object with optional filters:
  - startDate: Start date for the query (ISO format)
  - endDate: End date for the query (ISO format)
  - category: Filter by category (e.g., food, transport, utilities, entertainment, shopping, income, rent, health, education)`,
  inputSchema: z.object({
    startDate: z.string().optional().describe('Start date in ISO format (e.g., "2024-01-01T00:00:00Z")'),
    endDate: z.string().optional().describe('End date in ISO format (e.g., "2024-01-31T23:59:59Z")'),
    category: z.string().optional().describe('Category to filter by (e.g., food, transport, utilities, entertainment, shopping, income, rent, health, education)'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    totalAmount: z.number().nullable(),
    count: z.number(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const apiUrl = `${getApiBaseUrl()}/api/transactions/query`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: context.startDate,
          endDate: context.endDate,
          category: context.category,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          totalAmount: null,
          count: 0,
          message: `API error: ${response.status} - ${errorText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        totalAmount: data.summary?.totalAmount ? Number(data.summary.totalAmount) : null,
        count: data.summary?.count || 0,
        message: `Found ${data.summary?.count || 0} transaction(s) with total amount: $${data.summary?.totalAmount ? (Number(data.summary.totalAmount) / 100).toFixed(2) : '0.00'}`,
      };
    } catch (error) {
      console.error('Error querying transactions via API:', error);
      return {
        success: false,
        totalAmount: null,
        count: 0,
        message: `Failed to query transactions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
