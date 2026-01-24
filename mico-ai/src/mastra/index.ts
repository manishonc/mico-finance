
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { transactionAgent } from './agents/transaction-agent';
import { financeWeatherNetworkAgent } from './agents/finance-weather-network-agent';
import { notionAgent } from './agents/notion-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { micoFinanceMcp } from './mcp/mico-finance-mcp';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, transactionAgent, financeWeatherNetworkAgent, notionAgent },
  mcpServers: { micoFinanceMcp },
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false, 
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true }, 
  },
});
