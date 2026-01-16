import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface TransactionInput {
  date: string;
  description: string;
  amount: number;
  category: string;
  status: string;
}

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  return process.env.API_BASE_URL || 'http://localhost:3000';
};

export const addTransactionTool = createTool({
  id: 'add-transaction',
  description: `Add a new transaction to the transactions table via the API.
  This tool accepts transaction details including date, description, amount, category, and status.
  
  Input should be a structured object with:
  - date: ISO date string (e.g., "2024-01-15T10:30:00Z")
  - description: A text description of what the transaction is for
  - amount: The transaction amount as a positive integer (in cents, e.g., 2500 for $25.00)
  - category: The category of the transaction (e.g., "food", "transport", "utilities", "entertainment", "shopping", "income")
  - status: The status of the transaction ("pending", "completed", "cancelled")`,
  inputSchema: z.object({
    date: z.string().describe('Transaction date in ISO format (e.g., "2024-01-15T10:30:00Z")'),
    description: z.string().describe('Description of the transaction'),
    amount: z.number().describe('Transaction amount as a positive integer (in cents, e.g., 2500 for $25.00)'),
    category: z.string().describe('Category of the transaction (e.g., food, transport, utilities, entertainment, shopping, income)'),
    status: z.enum(['pending', 'completed', 'cancelled']).describe('Status of the transaction'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    transactionId: z.string().optional(),
  }),
  execute: async ({ context }) => {
    try {
      // Parse the date
      const parsedDate = new Date(context.date);

      if (isNaN(parsedDate.getTime())) {
        return {
          success: false,
          message: `Invalid date format: ${context.date}. Please provide a valid ISO date string.`,
        };
      }

      // Ensure amount is positive integer
      const parsedAmount = Math.round(context.amount);
      if (parsedAmount <= 0) {
        return {
          success: false,
          message: `Amount must be a positive number. Received: ${context.amount}`,
        };
      }

      // Call the API to create the transaction
      const apiUrl = `${getApiBaseUrl()}/api/transactions`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: parsedDate.toISOString(),
          description: context.description,
          amount: parsedAmount,
          category: context.category,
          status: context.status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          message: `API error: ${response.status} - ${errorText}`,
        };
      }

      return {
        success: true,
        message: `Successfully added transaction: ${context.description} for ${context.amount} in category ${context.category}`,
      };
    } catch (error) {
      console.error('Error adding transaction via API:', error);
      return {
        success: false,
        message: `Failed to add transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
