import React from 'react';

const DataTable = ({ filteredTrees, selectedTree, onTreeSelect, stats }) => {
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full overflow-hidden p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-6 sm:mb-8 flex-col sm:flex-row gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Tree Data
        </h2>
        <div className="text-2xl sm:text-3xl font-black text-gray-500 dark:text-gray-400">
          {stats.total} total
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 dark:border-gray-700/50 h-[calc(100%-100px)]">
        <div className="overflow-x-auto h-full flex flex-col">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 sticky top-0">
              <tr>
                <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Species
                </th>
                <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Height
                </th>
                <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Diameter
                </th>
                <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Planted
                </th>
                <th className="px-4 sm:px-6 py-4 sm:py-6 text-left text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto">
              {filteredTrees.slice(0, 50).map((tree) => (
                <tr
                  key={tree.id}
                  className={`transition-colors cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border-b border-gray-50 dark:border-gray-700 ${
                    selectedTree?.id === tree.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                  }`}
                  onClick={() => onTreeSelect(tree)}
                >
                  <td className="px-4 sm:px-8 py-4 sm:py-6 font-mono font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                    {tree.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 font-bold text-sm sm:text-lg text-gray-800 dark:text-white">
                    {tree.species}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-md ${getConditionColor(
                        tree.condition
                      )}`}
                    >
                      {tree.condition}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 font-semibold text-green-700 dark:text-green-400 text-sm sm:text-lg">
                    {tree.height}m
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 font-semibold text-blue-700 dark:text-blue-400 text-sm sm:text-lg hidden sm:table-cell">
                    {tree.diameter}cm
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 font-mono text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden md:table-cell">
                    {tree.planted}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate hidden lg:table-cell">
                    {tree.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTrees.length > 50 && (
        <div className="mt-4 text-center py-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Showing first 50 of {filteredTrees.length} trees
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
