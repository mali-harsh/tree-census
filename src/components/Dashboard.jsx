import React from 'react';

const Dashboard = ({ trees, speciesList, stats }) => {
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent':
        return { bg: 'from-green-500 to-emerald-500', badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' };
      case 'Good':
        return { bg: 'from-blue-500 to-indigo-500', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' };
      case 'Fair':
        return { bg: 'from-yellow-500 to-orange-500', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' };
      case 'Poor':
        return { bg: 'from-red-500 to-rose-500', badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' };
      default:
        return { bg: 'from-gray-500 to-gray-600', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-8 animate-slideInDown">
          Tree Census Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { label: 'Total Trees', value: stats.total, color: 'green', icon: '🌳' },
            { label: 'Excellent', value: stats.excellent, color: 'green', icon: '⭐' },
            { label: 'Good', value: stats.good, color: 'blue', icon: '👍' },
            { label: 'Needs Attention', value: stats.fair + stats.poor, color: 'orange', icon: '⚠️' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-white/50 dark:border-gray-700/50 animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold opacity-90">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl sm:text-4xl font-black bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent mt-2`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg text-2xl sm:text-3xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Species Chart */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 dark:border-gray-700/50 animate-slideInLeft">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              🌿 Trees by Species
            </h3>
            <div className="space-y-6">
              {speciesList.slice(0, 6).map((sp) => {
                const count = trees.filter((t) => t.species === sp).length;
                const percentage = (count / trees.length) * 100;
                return (
                  <div key={sp}>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                        {sp}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-gray-600 dark:text-gray-400">
                        {count}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full shadow-lg transition-all duration-700"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[4rem] text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Condition Chart */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 dark:border-gray-700/50 animate-slideInRight">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              ❤️ Condition Distribution
            </h3>
            <div className="space-y-6">
              {conditions.map((cond) => {
                const count = trees.filter((t) => t.condition === cond).length;
                const percentage = (count / trees.length) * 100;
                const colorMap = getConditionColor(cond);
                return (
                  <div key={cond}>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white capitalize">
                        {cond}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-gray-600 dark:text-gray-400">
                        {count}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                        <div
                          className={`h-4 rounded-full shadow-lg bg-gradient-to-r ${colorMap.bg}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[4rem] text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
