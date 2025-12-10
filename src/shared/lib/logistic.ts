import { z } from 'zod';

/**
 * Schema untuk validasi request logistik
 */
export const LogisticsRequestSchema = z.object({
  username: z.string().min(1, "Username required"),
  timestamp: z.string().datetime(),
  requestContent: z.string().min(1, "Request content required"),
  requestType: z.enum(['pickup', 'delivery', 'tracking', 'general']).optional(),
});

export type LogisticsRequest = z.infer<typeof LogisticsRequestSchema>;

/**
 * Data yang akan dikirim ke Google Sheets
 */
export interface SheetRow {
  username: string;
  date: string;
  time: string;
  requestContent: string;
  requestType?: string;
  status: 'pending' | 'processed' | 'completed';
}

/**
 * Response dari bot
 */
export interface BotResponse {
  success: boolean;
  message: string;
  rowNumber?: number;
}