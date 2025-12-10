interface LogisticRequest {
  username: string;
  timestamp: Date;
  requestContent: string;
  userId: number;
  chatId: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface SheetRow {
  username: string;
  date: string;
  time: string;
  request: string;
  userId: string;
}

interface RequestFilters {
  search: string;
  dateFrom: string | null;
  dateTo: string | null;
  status: string;
}

interface AllRequest {
  chatId: number,
  requestContent: string;
  rowIndex: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp: Date | string | null;
  userId: number;
  username: string;
}

export type {
  LogisticRequest,
  SheetRow,
  RequestFilters,
  AllRequest
}