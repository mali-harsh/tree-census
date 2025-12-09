import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 });
  const [zoom, setZoom] = useState(12);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize data
  useEffect(() => {
    const sampleTrees = generateSampleTrees();
    setTrees(sampleTrees);
    setFilteredTrees(sampleTrees);
  }, []);

  // Apply filters
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

  // Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Close sidebar when selecting tree on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [selectedTree]);

  const speciesList = [...new Set(trees.map(t => t.species))];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

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
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <Header 
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          filteredTrees={filteredTrees}
          selectedTree={selectedTree}
          onTreeSelect={handleTreeClick}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterSpecies={filterSpecies}
          onSpeciesChange={setFilterSpecies}
          filterCondition={filterCondition}
          onConditionChange={setFilterCondition}
          speciesList={speciesList}
          stats={stats}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {currentView === 'map' && (
            <MapComponent
              filteredTrees={filteredTrees}
              selectedTree={selectedTree}
              onTreeSelect={handleTreeClick}
              zoom={zoom}
              onZoomChange={setZoom}
              mapCenter={mapCenter}
              getConditionColor={() => {}}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              trees={trees}
              speciesList={speciesList}
              stats={stats}
            />
          )}

          {currentView === 'data' && (
            <DataTable
              filteredTrees={filteredTrees}
              selectedTree={selectedTree}
              onTreeSelect={handleTreeClick}
              stats={stats}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TreeCensusApp;
