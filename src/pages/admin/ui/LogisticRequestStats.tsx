interface StatsProps {
  stats: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  isLoading: boolean;
}

export function LogisticRequestStats({ stats, isLoading }: StatsProps) {
  const cards = [
    { label: 'Всего запросов', value: stats.total, icon: '📦', color: 'blue' },
    { label: 'Сегодня', value: stats.today, icon: '📅', color: 'green' },
    { label: 'На этой неделе', value: stats.thisWeek, icon: '📊', color: 'purple' },
    { label: 'В этом месяце', value: stats.thisMonth, icon: '📈', color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {isLoading ? '...' : card.value.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
