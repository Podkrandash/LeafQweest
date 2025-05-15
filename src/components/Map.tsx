import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';
import type { Quest, Position } from '../types';
import userMarkerIcon from '../assets/user-marker.svg';
import questMarkerIcon from '../assets/quest-marker.svg';
import completedQuestMarkerIcon from '../assets/completed-quest-marker.svg';

// Специальные иконки для маркеров
const userIcon = new L.Icon({
  iconUrl: userMarkerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const questIcon = new L.Icon({
  iconUrl: questMarkerIcon,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const completedQuestIcon = new L.Icon({
  iconUrl: completedQuestMarkerIcon,
  iconSize: [35, 35], 
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

interface MapComponentProps {
  userPosition: Position | null;
  quests: Quest[];
  onQuestSelect?: (quest: Quest) => void;
  completedQuestIds: string[];
}

// Компонент для отслеживания текущей позиции пользователя
function ChangeMapView({ position }: { position: Position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], map.getZoom());
    }
  }, [position, map]);
  
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  userPosition, 
  quests, 
  onQuestSelect,
  completedQuestIds 
}) => {
  const defaultPosition: Position = { latitude: 55.751244, longitude: 37.618423 }; // Москва как позиция по умолчанию
  const mapRef = useRef<L.Map | null>(null);
  
  // Центр карты это либо позиция пользователя либо Москва
  const center: [number, number] = userPosition 
    ? [userPosition.latitude, userPosition.longitude]
    : [defaultPosition.latitude, defaultPosition.longitude];

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Маркер позиции пользователя */}
        {userPosition && (
          <Marker 
            position={[userPosition.latitude, userPosition.longitude]}
            icon={userIcon}
          >
            <Popup>
              Вы здесь
            </Popup>
          </Marker>
        )}
        
        {/* Маркеры квестов */}
        {quests.map((quest) => (
          <Marker 
            key={quest.id}
            position={[quest.latitude, quest.longitude]}
            icon={completedQuestIds.includes(String(quest.id)) ? completedQuestIcon : questIcon}
            eventHandlers={{
              click: () => {
                if (onQuestSelect) {
                  onQuestSelect(quest);
                }
              },
            }}
          >
            <Popup>
              <div>
                <h3>{quest.title}</h3>
                <p>{quest.description.substring(0, 100)}...</p>
                <p><strong>Награда:</strong> {quest.reward} очков</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {userPosition && <ChangeMapView position={userPosition} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 