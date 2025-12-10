'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AllRequest, RequestFilters } from '@/shared/types/logistic';
import { LogisticRequestStats } from './LogisticRequestStats';
import { LogisticRequestFilters } from './LogisticRequestFilters';
import { LogisticRequestTable } from './LogisticRequestTable';

export const AdminPage = () => {
  const [filters, setFilters] = useState<RequestFilters>({
    search: '',
    dateFrom: null,
    dateTo: null,
    status: 'all',
  });

  // Fetch данных с сервера
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['logistic-requests', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.status !== 'all') params.append('status', filters.status);

      const response = await fetch(`/api/admin/request?${params}`);
      if (!response.ok) throw new Error('Не удалось получить данные');

      return response.json() as Promise<{
        requests: AllRequest[];
        stats: {
          total: number;
          today: number;
          thisWeek: number;
          thisMonth: number;
        };
      }>;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Хедер */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель Администратора</h1>
            <p className="text-sm text-gray-600 mt-1">
              Управление всеми логистическими запросами из Telegram бота
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Загрузка...' : '🔄 Обновить'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Статистика */}
        {data && <LogisticRequestStats stats={data.stats} isLoading={isLoading} />}

        {/* Фильтры */}
        <div className="mt-6">
          <LogisticRequestFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Таблица */}
        <div className="mt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                ❌ Ошибка: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Загрузка запросов...</p>
            </div>
          )}

          {data && (
            <LogisticRequestTable
              requests={data.requests} // Исправлено
              // onUpdateStatus, onDelete можно добавить при необходимости
            />
          )}
        </div>
      </main>
    </div>
  );
};
