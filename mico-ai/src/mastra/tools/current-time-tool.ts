import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const DEFAULT_TIME_ZONE = 'Asia/Kolkata';

export const currentTimeTool = createTool({
  id: 'current-time',
  description:
    'Get the current local date and time in the configured time zone (default Asia/Kolkata).',
  inputSchema: z.object({
    timeZone: z
      .string()
      .optional()
      .describe('IANA time zone, e.g., "Asia/Kolkata"'),
  }),
  outputSchema: z.object({
    timeZone: z.string(),
    dateISO: z.string().describe('Local date in YYYY-MM-DD format'),
    time24: z.string().describe('Local time in HH:mm:ss format'),
    nowISO: z.string().describe('Full local date-time formatted for humans'),
  }),
  execute: async ({ context }) => {
    const timeZone = context.timeZone || DEFAULT_TIME_ZONE;
    const now = new Date();
    const dateISO = now.toLocaleDateString('en-CA', { timeZone });
    const time24 = new Intl.DateTimeFormat('en-IN', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    const nowISO = new Intl.DateTimeFormat('en-IN', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);

    return {
      timeZone,
      dateISO,
      time24,
      nowISO,
    };
  },
});
