import React from 'react';
import { Search, Filter } from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  filteredTrees, 
  selectedTree, 
  onTreeSelect,
  searchTerm,
  onSearchChange,
  filterSpecies,
  onSpeciesChange,
  filterCondition,
  onConditionChange,
  speciesList,
  stats
}) => {
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  return (
    <aside
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-72 sm:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none transition-transform duration-300 ease-out z-40 flex flex-col overflow-hidden`}
    >
      {/* Filters Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            placeholder="Search trees or locations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              Species
            </label>
            <select
              value={filterSpecies}
              onChange={(e) => onSpeciesChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:bg-gray-800 dark:text-white transition-all"
            >
              <option value="all">All Species</option>
              {speciesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              Condition
            </label>
            <select
              value={filterCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:bg-gray-800 dark:text-white transition-all"
            >
              <option value="all">All Conditions</option>
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trees List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          Trees
          <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
            {filteredTrees.length}/{stats.total}
          </span>
        </h3>

        <div className="space-y-3">
          {filteredTrees.slice(0, 20).map((tree) => {
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
              <div
                key={tree.id}
                onClick={() => onTreeSelect(tree)}
                className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTree?.id === tree.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900 shadow-lg ring-2 ring-green-200 dark:ring-green-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-gray-800 dark:text-white truncate">
                      {tree.species}
                    </div>
                    <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 mt-1">
                      ID: {tree.id}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${getConditionColor(
                      tree.condition
                    )} shadow-sm`}
                  >
                    {tree.condition}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {tree.address}
                </div>
              </div>
            );
          })}

          {filteredTrees.length > 20 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              +{filteredTrees.length - 20} more trees...
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
