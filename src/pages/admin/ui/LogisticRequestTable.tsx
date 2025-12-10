import type { AllRequest } from '@/shared/types/logistic';

interface TableProps {
  requests: AllRequest[];
  // onUpdateStatus: (rowIndex: number, status: string) => void;
  // onDelete: (rowIndex: number) => void;
  // isUpdating: boolean;
  // isDeleting: boolean;
}

export function LogisticRequestTable({
  requests,
}: TableProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">📭 No requests found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Время запроса
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Запрос
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request, index) => (
              <tr key={`${request.userId}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      @{request.username}
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatTimestamp(request.timestamp)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimestamp(request.timestamp)}
                  </div>
                </td> */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md truncate">
                    {request.requestContent}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  <select
                    value={request.status}
                    // onChange={(e) => onUpdateStatus(index + 2, e.target.value)}
                    // disabled={isUpdating}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">В ожидании</option>
                    <option value="processing">В обработке</option>
                    <option value="completed">Завершено</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    // onClick={() => onDelete(index + 2)}
                    // disabled={isDeleting}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}