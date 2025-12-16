import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, Upload, Download, Search, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';

// ============= TREE ICON SVG =============
const TreeIconSVG = ({ selected = false, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
    {/* Leaves */}
    <ellipse cx="70" cy="70" rx="20" ry="30" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="130" cy="70" rx="20" ry="30" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="100" cy="50" rx="20" ry="35" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="85" cy="90" rx="22" ry="28" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="115" cy="90" rx="22" ry="28" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="60" cy="100" rx="18" ry="25" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="140" cy="100" rx="18" ry="25" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    <ellipse cx="100" cy="85" rx="25" ry="32" fill="#4ade80" stroke="#22c55e" strokeWidth="2"/>
    
    {/* Trunk */}
    <rect x="90" y="120" width="20" height="80" fill="#92400e" stroke="#78350f" strokeWidth="2" rx="3"/>
    <path d="M 90 150 Q 85 160 90 170" stroke="#78350f" strokeWidth="1" fill="none"/>
    <path d="M 110 145 Q 115 155 110 165" stroke="#78350f" strokeWidth="1" fill="none"/>
    
    {/* Roots */}
    <path d="M 95 200 Q 70 220 60 240" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M 95 200 Q 80 215 70 230" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 100 200 Q 100 225 95 245" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M 105 200 Q 130 220 140 240" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M 105 200 Q 120 215 130 230" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 100 200 Q 105 220 110 235" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round"/>
    
    {/* Selection indicator */}
    {selected && (
      <circle cx="100" cy="120" r="90" fill="none" stroke="#fbbf24" strokeWidth="6" opacity="0.7"/>
    )}
  </svg>
);

// ============= HEADER COMPONENT =============
const Header = ({ 
  sidebarOpen, 
  onSidebarToggle, 
  currentView, 
  onViewChange,
  isDarkMode,
  onThemeToggle,
  onExcelUpload,
  onKmlUpload,
  onDownload,
  hasData,
  mapType,
  onMapTypeChange
}) => {
  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'excel') {
      onExcelUpload(file);
    } else if (type === 'kml') {
      onKmlUpload(file);
    }
    e.target.value = '';
  };

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                <TreeIconSVG size={32} />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Tree Matrix</h1>
              </div>
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex gap-2">
            {[
              { view: 'map', label: 'Map', icon: '🧭' },
              { view: 'dashboard', label: 'Dashboard', icon: '📊' },
              { view: 'data', label: 'Data', icon: '📋' }
            ].map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === view ? 'bg-green-600 shadow-lg' : 'hover:bg-green-600'
                }`}
              >
                <span>{icon}</span>
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Map Type Toggle */}
            {currentView === 'map' && (
              <button
                onClick={() => onMapTypeChange(mapType === 'street' ? 'satellite' : 'street')}
                className="p-2 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-1"
                title="Toggle Map Type"
              >
                <Layers size={20} />
                <span className="hidden sm:inline text-xs">{mapType === 'street' ? 'Satellite' : 'Street'}</span>
              </button>
            )}

            {/* Upload Excel */}
            <label className="cursor-pointer p-2 hover:bg-green-600 rounded-lg transition-colors" title="Upload Excel">
              <Upload size={20} />
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleFileUpload(e, 'excel')} />
            </label>

            {/* Download */}
            {hasData && (
              <button
                onClick={onDownload}
                className="p-2 hover:bg-green-600 rounded-lg transition-colors"
                title="Download Data"
              >
                <Download size={20} />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {[
            { view: 'map', label: 'Map', icon: '🧭' },
            { view: 'dashboard', label: 'Dashboard', icon: '📊' },
            { view: 'data', label: 'Data', icon: '📋' }
          ].map(({ view, label, icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition-all flex items-center gap-1 ${
                currentView === view ? 'bg-green-600 shadow-lg' : 'hover:bg-green-600'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

// ============= SIDEBAR COMPONENT =============
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
  conditionsList,
  stats
}) => {
  return (
    <aside
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-72 sm:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none transition-transform duration-300 z-40 flex flex-col overflow-hidden`}
    >
      {/* Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search trees..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
              Species
            </label>
            <select
              value={filterSpecies}
              onChange={(e) => onSpeciesChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="all">All</option>
              {speciesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
              Condition
            </label>
            <select
              value={filterCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="all">All</option>
              {conditionsList.map((c) => (
                <option key={c} value={c}>{c}</option>
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
          {filteredTrees.slice(0, 20).map((tree) => (
            <div
              key={tree.id}
              onClick={() => onTreeSelect(tree)}
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTree?.id === tree.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <TreeIconSVG size={40} selected={selectedTree?.id === tree.id} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-base text-gray-800 dark:text-white truncate">
                    {tree.species || tree.name || 'Unknown'}
                  </div>
                  <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 mt-1 inline-block">
                    ID: {tree.id}
                  </div>
                  {tree.condition && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {tree.condition}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-2">
                {tree.address || tree.location || `${tree.lat?.toFixed(4)}, ${tree.lng?.toFixed(4)}`}
              </div>
            </div>
          ))}

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

// ============= MAP COMPONENT =============
const MapComponent = ({ 
  filteredTrees, 
  selectedTree, 
  onTreeSelect,
  onPolygonComplete,
  polygonMode,
  mapType
}) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const leafletLoadedRef = useRef(false);
  const markersRef = useRef([]);
  const polygonRef = useRef(null);
  const pointsRef = useRef([]);

  // Load Leaflet
  useEffect(() => {
    if (leafletLoadedRef.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      leafletLoadedRef.current = true;
      initMap();
    };
    document.head.appendChild(script);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!window.L || !mapRef.current || leafletMapRef.current) return;

    const L = window.L;
    leafletMapRef.current = L.map(mapRef.current, {
      center: [19.0760, 72.8777],
      zoom: 12,
      zoomControl: true
    });

    updateMapTiles(mapType);
  };

  const updateMapTiles = (type) => {
    if (!leafletMapRef.current || !window.L) return;
    
    const L = window.L;
    
    // Remove existing tile layers
    leafletMapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        leafletMapRef.current.removeLayer(layer);
      }
    });

    // Add new tile layer
    if (type === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
      }).addTo(leafletMapRef.current);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(leafletMapRef.current);
    }
  };

  // Update map type
  useEffect(() => {
    if (leafletMapRef.current) {
      updateMapTiles(mapType);
    }
  }, [mapType]);

  // Update markers
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;
    const L = window.L;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    filteredTrees.forEach(tree => {
      if (!tree.lat || !tree.lng) return;
      
      const isSelected = selectedTree?.id === tree.id;
      
      // Create custom icon with our tree SVG
      const iconHtml = `
        <div style="position: relative; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
          <svg width="50" height="50" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <ellipse cx="70" cy="70" rx="20" ry="30" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="130" cy="70" rx="20" ry="30" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="100" cy="50" rx="20" ry="35" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="85" cy="90" rx="22" ry="28" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="115" cy="90" rx="22" ry="28" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="60" cy="100" rx="18" ry="25" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="140" cy="100" rx="18" ry="25" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <ellipse cx="100" cy="85" rx="25" ry="32" fill="#4ade80" stroke="#22c55e" stroke-width="3"/>
            <rect x="90" y="120" width="20" height="80" fill="#92400e" stroke="#78350f" stroke-width="3" rx="3"/>
            <path d="M 95 200 Q 70 220 60 240" stroke="#92400e" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M 95 200 Q 80 215 70 230" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M 100 200 Q 100 225 95 245" stroke="#92400e" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M 105 200 Q 130 220 140 240" stroke="#92400e" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M 105 200 Q 120 215 130 230" stroke="#92400e" stroke-width="4" fill="none" stroke-linecap="round"/>
            ${isSelected ? '<circle cx="100" cy="120" r="90" fill="none" stroke="#fbbf24" stroke-width="8" opacity="0.8"/>' : ''}
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        iconSize: [50, 70],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60],
        className: 'custom-tree-icon'
      });

      const marker = L.marker([tree.lat, tree.lng], { icon })
        .addTo(leafletMapRef.current)
        .on('click', () => {
          onTreeSelect(tree);
          leafletMapRef.current.setView([tree.lat, tree.lng], Math.max(leafletMapRef.current.getZoom(), 15), {
            animate: true
          });
        });

      // Create better popup
      const popupContent = `
        <div style="font-family: system-ui; min-width: 200px;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 12px; margin: -10px -10px 10px -10px; border-radius: 8px 8px 0 0;">
            <div style="font-size: 18px; font-weight: bold;">${tree.species || tree.name || 'Tree'}</div>
            <div style="font-size: 12px; opacity: 0.9;">ID: ${tree.id}</div>
          </div>
          <div style="padding: 4px 0;">
            ${Object.entries(tree).filter(([key]) => key !== 'lat' && key !== 'lng' && key !== 'id').map(([key, value]) => `
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-weight: 500; text-transform: capitalize;">${key}:</span>
                <span style="color: #111827; font-weight: 600;">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
        closeButton: true,
        autoClose: false,
        closeOnClick: false
      });

      markersRef.current.push(marker);
    });
  }, [filteredTrees, selectedTree, onTreeSelect]);

  // Polygon drawing
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;
    const L = window.L;
    const map = leafletMapRef.current;

    if (!polygonMode) {
      if (polygonRef.current) {
        polygonRef.current.remove();
        polygonRef.current = null;
      }
      pointsRef.current = [];
      map.off('click');
      return;
    }

    map.on('click', (e) => {
      pointsRef.current.push([e.latlng.lat, e.latlng.lng]);

      if (polygonRef.current) {
        polygonRef.current.remove();
      }

      if (pointsRef.current.length >= 2) {
        polygonRef.current = L.polygon(pointsRef.current, {
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.2,
          weight: 3
        }).addTo(map);
      }
    });

    return () => {
      map.off('click');
    };
  }, [polygonMode]);

  const handleCompletePolygon = () => {
    if (pointsRef.current.length < 3 || !leafletMapRef.current || !window.L) return;
    
    const L = window.L;
    const polygon = L.polygon(pointsRef.current);
    
    const treesInPolygon = filteredTrees.filter(tree => {
      if (!tree.lat || !tree.lng) return false;
      const point = L.latLng(tree.lat, tree.lng);
      return polygon.getBounds().contains(point);
    });

    onPolygonComplete(treesInPolygon);
    
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }
    pointsRef.current = [];
  };

  const handleClearPolygon = () => {
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }
    pointsRef.current = [];
    onPolygonComplete([]);
  };

  return (
    <div className="w-full h-full relative">
      <style>{`
        .custom-tree-icon {
          background: none !important;
          border: none !important;
        }
        .leaflet-popup-pane {
          z-index: 10000 !important;
        }
        .leaflet-popup {
          z-index: 10000 !important;
          pointer-events: auto !important;
        }
        .custom-popup {
          z-index: 10000 !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
          z-index: 10000 !important;
          background: white;
        }
        .custom-popup .leaflet-popup-content {
          margin: 10px;
          line-height: 1.5;
          z-index: 10000 !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          z-index: 10000 !important;
        }
        .leaflet-pane {
          z-index: 1 !important;
        }
        .leaflet-tile-pane {
          z-index: 1 !important;
        }
        .leaflet-overlay-pane {
          z-index: 5 !important;
        }
        .leaflet-marker-pane {
          z-index: 6 !important;
        }
      `}</style>
      
      <div ref={mapRef} className="w-full h-full" />
      
      {polygonMode && (
        <div 
          className="absolute top-6 left-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border-2 border-green-500"
          style={{ zIndex: 9998 }}
        >
          <p className="text-sm font-semibold mb-3 text-gray-800 dark:text-white">
            🖱️ Click on map to draw area
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCompletePolygon}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-lg"
            >
              ✓ Complete
            </button>
            <button
              onClick={handleClearPolygon}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-lg"
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {selectedTree && (
        <div 
          className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-green-500 max-h-[70vh] overflow-y-auto"
          style={{ zIndex: 9999 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <TreeIconSVG size={60} selected={true} />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {selectedTree.species || selectedTree.name || 'Tree Details'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {selectedTree.id}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {Object.entries(selectedTree).map(([key, value]) => {
              if (key === 'lat' || key === 'lng' || key === 'id') return null;
              return (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">{key}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============= DASHBOARD COMPONENT =============
const Dashboard = ({ trees, stats }) => {
  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
        Tree Matrix Dashboard
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Trees', value: stats.total, icon: '🌳', color: 'green' },
          { label: 'Species', value: stats.species, icon: '🌿', color: 'blue' },
          { label: 'Excellent', value: stats.excellent, icon: '⭐', color: 'green' },
          { label: 'Needs Care', value: stats.poor, icon: '⚠️', color: 'orange' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{stat.label}</p>
                <p className="text-4xl font-black mt-2 text-gray-800 dark:text-white">{stat.value}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center text-3xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============= DATA TABLE COMPONENT =============
const DataTable = ({ filteredTrees, selectedTree, onTreeSelect }) => {
  if (filteredTrees.length === 0) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4">
        <TreeIconSVG size={100} />
        <p className="text-gray-500 text-lg">No data available. Upload an Excel file to get started.</p>
      </div>
    );
  }

  const columns = Object.keys(filteredTrees[0]);

  return (
    <div className="h-full overflow-auto p-8 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Tree Data</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 sticky top-0">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTrees.map((tree, i) => (
                <tr
                  key={i}
                  onClick={() => onTreeSelect(tree)}
                  className={`cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                    selectedTree?.id === tree.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                  }`}
                >
                  {columns.map(col => (
                    <td key={col} className="px-6 py-4 text-gray-800 dark:text-white whitespace-nowrap">
                      {tree[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN APP =============
const App = () => {
  const [trees, setTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [currentView, setCurrentView] = useState('map');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [polygonMode, setPolygonMode] = useState(false);
  const [polygonTrees, setPolygonTrees] = useState([]);
  const [mapType, setMapType] = useState('street');

  // Apply filters
  useEffect(() => {
    let filtered = polygonTrees.length > 0 ? polygonTrees : trees;
    
    if (searchTerm) {
      filtered = filtered.filter(tree => 
        Object.values(tree).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (filterSpecies !== 'all') {
      filtered = filtered.filter(tree => tree.species === filterSpecies);
    }
    
    if (filterCondition !== 'all') {
      filtered = filtered.filter(tree => tree.condition === filterCondition);
    }
    
    setFilteredTrees(filtered);
  }, [searchTerm, filterSpecies, filterCondition, trees, polygonTrees]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Excel upload
  const handleExcelUpload = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const treesData = jsonData.map((row, index) => ({
        id: row.id || row.ID || row.Id || index + 1,
        ...row,
        lat: parseFloat(row.lat || row.latitude || row.Latitude || row.LAT || 19.0760 + (Math.random() - 0.5) * 0.1),
        lng: parseFloat(row.lng || row.longitude || row.Longitude || row.LNG || 72.8777 + (Math.random() - 0.5) * 0.1)
      }));
      
      setTrees(treesData);
      setFilteredTrees(treesData);
      alert(`✅ Successfully loaded ${treesData.length} trees!`);
    } catch (error) {
      alert('❌ Error reading Excel file: ' + error.message);
    }
  };

  // KML upload
  const handleKmlUpload = async (file) => {
    alert('KML upload feature coming soon! For now, please use Excel format.');
  };

  // Download data
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTrees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trees');
    XLSX.writeFile(wb, `tree_matrix_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Toggle polygon mode
  const togglePolygonMode = () => {
    setPolygonMode(!polygonMode);
    if (polygonMode) {
      setPolygonTrees([]);
    }
  };

  const speciesList = [...new Set(trees.map(t => t.species).filter(Boolean))];
  const conditionsList = [...new Set(trees.map(t => t.condition).filter(Boolean))];

  const stats = {
    total: trees.length,
    species: speciesList.length,
    excellent: trees.filter(t => t.condition === 'Excellent').length,
    poor: trees.filter(t => t.condition === 'Poor' || t.condition === 'Fair').length
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      <Header
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onExcelUpload={handleExcelUpload}
        onKmlUpload={handleKmlUpload}
        onDownload={handleDownload}
        hasData={trees.length > 0}
        mapType={mapType}
        onMapTypeChange={setMapType}
      />

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setSidebarOpen(false)} />
        )}

        <Sidebar
          sidebarOpen={sidebarOpen}
          filteredTrees={filteredTrees}
          selectedTree={selectedTree}
          onTreeSelect={setSelectedTree}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterSpecies={filterSpecies}
          onSpeciesChange={setFilterSpecies}
          filterCondition={filterCondition}
          onConditionChange={setFilterCondition}
          speciesList={speciesList}
          conditionsList={conditionsList}
          stats={stats}
        />

        <main className="flex-1 overflow-hidden relative">
          {currentView === 'map' && (
            <>
              <MapComponent
                filteredTrees={filteredTrees}
                selectedTree={selectedTree}
                onTreeSelect={setSelectedTree}
                polygonMode={polygonMode}
                onPolygonComplete={setPolygonTrees}
                mapType={mapType}
              />
              
              {trees.length > 0 && (
                <button
                  onClick={togglePolygonMode}
                  className={`absolute top-6 right-6 px-5 py-3 rounded-xl font-semibold shadow-2xl transition-all transform hover:scale-105 ${
                    polygonMode 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white border-2 border-green-500'
                  }`}
                  style={{ zIndex: 9998 }}
                >
                  {polygonMode ? '✕ Cancel Selection' : '🔷 Select Area'}
                </button>
              )}
            </>
          )}

          {currentView === 'dashboard' && <Dashboard trees={trees} stats={stats} />}
          {currentView === 'data' && (
            <DataTable
              filteredTrees={filteredTrees}
              selectedTree={selectedTree}
              onTreeSelect={setSelectedTree}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;