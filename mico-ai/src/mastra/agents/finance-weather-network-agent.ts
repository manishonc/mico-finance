import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { transactionAgent } from './transaction-agent';
import { weatherAgent } from './weather-agent';

export const financeWeatherNetworkAgent = new Agent({
  name: 'Finance Weather Network',
  description:
    'Routes user requests to finance transactions or weather assistance.',
  instructions: `You are a routing agent that decides whether a user needs finance or weather help.

Use the Transaction Agent for anything related to adding, querying, or summarizing transactions and spending.
Use the Weather Agent for current weather checks, forecasts, or activity suggestions based on weather.

If a user request contains both topics, handle both by delegating to the relevant agents.`,
  model: 'openai/gpt-4o-mini',
  agents: {
    transactionAgent,
    weatherAgent,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
