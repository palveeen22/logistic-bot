import type { RequestFilters } from '@/shared/types/logistic';

interface FiltersProps {
  filters: RequestFilters;
  onFiltersChange: (filters: RequestFilters) => void;
}

export function LogisticRequestFilters({ filters, onFiltersChange }: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 text-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Поиск */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск
          </label>
          <input
            type="text"
            placeholder="Имя пользователя или запрос..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
          />
        </div>

        {/* Дата с */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            С даты
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateFrom: e.target.value || null })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Дата по */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            По дату
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateTo: e.target.value || null })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Статус
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({ ...filters, status: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все</option>
            <option value="pending">В ожидании</option>
            <option value="processing">В обработке</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </div>

      {/* Сброс фильтров */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() =>
            onFiltersChange({
              search: '',
              dateFrom: null,
              dateTo: null,
              status: 'all',
            })
          }
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}
