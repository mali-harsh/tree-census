import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, X } from 'lucide-react';

const MapComponent = ({ 
  filteredTrees, 
  selectedTree, 
  onTreeSelect, 
  zoom, 
  onZoomChange, 
  mapCenter, 
  getConditionColor 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});

  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current) return;

    // ✅ Create Leaflet map
    map.current = L.map(mapContainer.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: zoom,
      zoomControl: true,
      attributionControl: true
    });

    // ✅ Add OpenStreetMap tiles (100% FREE)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 2,
      opacity: 0.9
    }).addTo(map.current);

    // ✅ Add zoom controls
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update zoom level
  useEffect(() => {
    if (map.current) {
      map.current.setZoom(zoom);
    }
  }, [zoom]);

  // Update map center
  useEffect(() => {
    if (map.current) {
      map.current.setView([mapCenter.lat, mapCenter.lng], zoom);
    }
  }, [mapCenter, zoom]);

  // Add/update tree markers
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    filteredTrees.forEach(tree => {
      const markerColor = selectedTree?.id === tree.id ? '#22c55e' : '#3b82f6';
      const markerSize = selectedTree?.id === tree.id ? 40 : 32;

      const html = `
        <div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background: ${markerColor};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s;
        ">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      `;

      const marker = L.marker([tree.lat, tree.lng], {
        icon: L.divIcon({
          html: html,
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize / 2, markerSize / 2],
          popupAnchor: [0, -markerSize / 2]
        })
      }).addTo(map.current);

      marker.on('click', () => onTreeSelect(tree));

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <strong>${tree.species}</strong><br>
          ID: ${tree.id}<br>
          Height: ${tree.height}m<br>
          Condition: ${tree.condition}
        </div>
      `);

      markersRef.current[tree.id] = marker;
    });
  }, [filteredTrees, selectedTree, onTreeSelect]);

  // Custom zoom button handlers
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 1, 18));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 1, 2));
  };

  return (
    <div className="h-full relative bg-gray-100">
      {/* Leaflet map container */}
      <div 
        ref={mapContainer}
        className="w-full h-full"
        style={{ position: 'relative' }}
      />

      {/* Custom Zoom Controls (overlaid on map) */}
      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-3 space-y-2 border border-white/50 z-40">
        <button 
          onClick={handleZoomIn}
          className="block w-12 h-12 bg-white rounded-xl hover:bg-green-50 hover:shadow-lg active:bg-green-100 transition-all font-bold text-xl border border-gray-200 flex items-center justify-center cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="block w-12 h-12 bg-white rounded-xl hover:bg-green-50 hover:shadow-lg active:bg-green-100 transition-all font-bold text-xl border border-gray-200 flex items-center justify-center cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Tree Info Card */}
      {selectedTree && (
        <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 z-30">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold`}
                style={{
                  background: selectedTree.condition === 'Excellent' ? '#22c55e' :
                             selectedTree.condition === 'Good' ? '#3b82f6' :
                             selectedTree.condition === 'Fair' ? '#eab308' : '#ef4444'
                }}>
                🌳
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedTree.species}</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-1 text-white`}
                  style={{
                    background: selectedTree.condition === 'Excellent' ? '#22c55e' :
                               selectedTree.condition === 'Good' ? '#3b82f6' :
                               selectedTree.condition === 'Fair' ? '#eab308' : '#ef4444'
                  }}>
                  {selectedTree.condition}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tree ID:</span>
                <span className="font-bold text-gray-900">{selectedTree.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-bold text-green-700">{selectedTree.height}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Planted:</span>
                <span className="font-bold text-gray-900">{selectedTree.planted}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Diameter:</span>
                <span className="font-bold text-blue-700">{selectedTree.diameter}cm</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Location:</span>
                <span className="font-bold text-gray-900">{selectedTree.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
