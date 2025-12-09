import React, { useState, useEffect } from 'react';
import { MapPin, Search, Menu, X, BarChart3, Database } from 'lucide-react';
import MapComponent from './components/MapComponent';


const generateSampleTrees = () => {
  const species = ['Elm', 'Cedar', 'Birch', 'Pine', 'Oak', 'Maple', 'Ash', 'Willow'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const trees = [];
  
  for (let i = 1; i <= 50; i++) {
    trees.push({
      id: i,
      species: species[Math.floor(Math.random() * species.length)],
      lat: 19.0760 + (Math.random() - 0.5) * 0.1,
      lng: 72.8777 + (Math.random() - 0.5) * 0.1,
      height: Math.floor(Math.random() * 30) + 5,
      diameter: Math.floor(Math.random() * 100) + 10,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      planted: `${Math.floor(Math.random() * 30) + 1990}`,
      address: `Location ${i}, Mumbai`
    });
  }
  return trees;
};

const TreeCensusApp = () => {
  const [trees, setTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [currentView, setCurrentView] = useState('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 });
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    const sampleTrees = generateSampleTrees();
    setTrees(sampleTrees);
    setFilteredTrees(sampleTrees);
  }, []);

  useEffect(() => {
    let filtered = trees;
    
    if (searchTerm) {
      filtered = filtered.filter(tree => 
        tree.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tree.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSpecies !== 'all') {
      filtered = filtered.filter(tree => tree.species === filterSpecies);
    }
    
    if (filterCondition !== 'all') {
      filtered = filtered.filter(tree => tree.condition === filterCondition);
    }
    
    setFilteredTrees(filtered);
  }, [searchTerm, filterSpecies, filterCondition, trees]);

  const speciesList = [...new Set(trees.map(t => t.species))];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Excellent': return 'bg-green-500 text-white';
      case 'Good': return 'bg-blue-500 text-white';
      case 'Fair': return 'bg-yellow-500 text-white';
      case 'Poor': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleTreeClick = (tree) => {
    setSelectedTree(tree);
    setMapCenter({ lat: tree.lat, lng: tree.lng });
    setZoom(15);
  };

  const stats = {
    total: trees.length,
    excellent: trees.filter(t => t.condition === 'Excellent').length,
    good: trees.filter(t => t.condition === 'Good').length,
    fair: trees.filter(t => t.condition === 'Fair').length,
    poor: trees.filter(t => t.condition === 'Poor').length,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Tree Census System</h1>
                <p className="text-sm text-green-100">Urban Forest Management</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            {[
              { view: 'map', icon: MapPin, label: 'Map' },
              { view: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { view: 'data', icon: Database, label: 'Data' }
            ].map(({ view, icon: Icon, label }) => (
              <button 
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  currentView === view 
                    ? 'bg-green-600 shadow-lg' 
                    : 'hover:bg-green-600 hover:shadow-md'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r shadow-lg transition-all duration-300 overflow-hidden flex flex-col lg:w-80`}>
          <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
              <input
                type="text"
                placeholder="Search trees or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Species</label>
                <select 
                  value={filterSpecies}
                  onChange={(e) => setFilterSpecies(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                >
                  <option value="all">All Species</option>
                  {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Condition</label>
                <select 
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                >
                  <option value="all">All Conditions</option>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
              Trees ({filteredTrees.length})
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{stats.total}</span>
            </h3>
            <div className="space-y-3 max-h-[calc(100vh-300px)]">
              {filteredTrees.slice(0, 15).map(tree => (  // Limit to 15 for performance
                <div 
                  key={tree.id}
                  onClick={() => handleTreeClick(tree)}
                  className={`p-4 border-2 rounded-xl cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] ${
                    selectedTree?.id === tree.id 
                      ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-gray-800 truncate">{tree.species}</div>
                      <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">ID: {tree.id}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{tree.address}</div>
                    </div>
                    <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${getConditionColor(tree.condition)} shadow-md`}>
                      {tree.condition}
                    </span>
                  </div>
                </div>
              ))}
              {filteredTrees.length > 15 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  +{filteredTrees.length - 15} more trees...
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {currentView === 'map' && (
            <MapComponent 
              filteredTrees={filteredTrees}
              selectedTree={selectedTree}
              onTreeSelect={handleTreeClick}
              zoom={zoom}
              onZoomChange={setZoom}
              mapCenter={mapCenter}
              getConditionColor={getConditionColor}
            />
          )}


          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-8">
                Tree Census Dashboard
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Trees', value: stats.total, color: 'green', icon: '🌳' },
                  { label: 'Excellent', value: stats.excellent, color: 'green', icon: '⭐' },
                  { label: 'Good', value: stats.good, color: 'blue', icon: '👍' },
                  { label: 'Needs Attention', value: stats.fair + stats.poor, color: 'orange', icon: '⚠️' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1 border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 text-lg font-semibold opacity-90">{stat.label}</p>
                        <p className={`text-4xl font-black bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent mt-2`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    Trees by Species
                  </h3>
                  <div className="space-y-6">
                    {speciesList.slice(0, 6).map(sp => {
                      const count = trees.filter(t => t.species === sp).length;
                      const percentage = ((count / trees.length) * 100);
                      return (
                        <div key={sp}>
                          <div className="flex justify-between items-end mb-3">
                            <span className="text-xl font-bold text-gray-800">{sp}</span>
                            <span className="text-2xl font-black text-gray-600">{count}</span>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full shadow-lg transition-all duration-700" 
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 min-w-[4rem]">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8">Condition Distribution</h3>
                  <div className="space-y-6">
                    {conditions.map(cond => {
                      const count = trees.filter(t => t.condition === cond).length;
                      const percentage = ((count / trees.length) * 100);
                      const colorMap = {
                        'Excellent': 'from-green-500 to-emerald-500',
                        'Good': 'from-blue-500 to-indigo-500', 
                        'Fair': 'from-yellow-500 to-orange-500',
                        'Poor': 'from-red-500 to-rose-500'
                      };
                      return (
                        <div key={cond}>
                          <div className="flex justify-between items-end mb-3">
                            <span className="text-xl font-bold text-gray-800 capitalize">{cond}</span>
                            <span className="text-2xl font-black text-gray-600">{count}</span>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                              <div 
                                className={`h-4 rounded-full shadow-lg ${colorMap[cond]}`} 
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 min-w-[4rem]">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Table View */}
          {currentView === 'data' && (
            <div className="h-full overflow-hidden p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Tree Data ({filteredTrees.length})
                </h2>
                <div className="text-3xl font-black text-gray-500">{stats.total} total</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                      <tr>
                        <th className="px-8 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">Species</th>
                        <th className="px-6 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">Condition</th>
                        <th className="px-6 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">Height</th>
                        <th className="px-6 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">Diameter</th>
                        <th className="px-6 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">Planted</th>
                        <th className="px-6 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTrees.slice(0, 50).map(tree => (
                        <tr 
                          key={tree.id} 
                          className="hover:bg-blue-50/50 transition-colors cursor-pointer border-b border-gray-50 hover:border-blue-100"
                          onClick={() => handleTreeClick(tree)}
                        >
                          <td className="px-8 py-6 font-mono font-bold text-xl text-gray-900">{tree.id}</td>
                          <td className="px-6 py-6 font-bold text-lg text-gray-800">{tree.species}</td>
                          <td className="px-6 py-6">
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${getConditionColor(tree.condition)}`}>
                              {tree.condition}
                            </span>
                          </td>
                          <td className="px-6 py-6 font-semibold text-green-700 text-lg">{tree.height}m</td>
                          <td className="px-6 py-6 font-semibold text-blue-700 text-lg">{tree.diameter}cm</td>
                          <td className="px-6 py-6 font-mono text-gray-600">{tree.planted}</td>
                          <td className="px-6 py-6 text-sm text-gray-500 max-w-xs truncate">{tree.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {filteredTrees.length > 50 && (
                <div className="mt-6 text-center py-8 bg-white/50 rounded-2xl">
                  <p className="text-gray-500 text-lg">Showing first 50 of {filteredTrees.length} trees</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TreeCensusApp;
