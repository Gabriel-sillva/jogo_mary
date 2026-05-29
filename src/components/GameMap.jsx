import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const playerIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/isometric/50/spider.png", 
  iconSize: [35, 35]
});

const portalIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/neon/96/portal.png", 
  iconSize: [40, 40]
});

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 18);
  }, [coords, map]);
  return null;
}

export default function GameMap({ progresso, bancoQuestoes, setQuestaoAtiva }) {
  const centroSenai = { lat: -22.91395, lng: -47.06820 };
  const RAIO_METROS = 15;
  const [userCoords, setUserCoords] = useState(centroSenai);

  const obterDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="dev-panel">
        <span className="dev-title">🚀 SIMULADOR GPS:</span>
        {bancoQuestoes.map((p, i) => (
          <button 
            key={p.id} 
            onClick={() => setUserCoords({ lat: p.lat, lng: p.lng })}
            className="btn-teleport"
          >
            Ir para Fenda {i + 1}
          </button>
        ))}
      </div>

      <MapContainer center={[userCoords.lat, userCoords.lng]} zoom={18} style={{ width: "100%", height: "100%" }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <ChangeMapView coords={userCoords} />

        <Marker position={[userCoords.lat, userCoords.lng]} icon={playerIcon}>
          <Popup>Você está aqui!</Popup>
        </Marker>
        <Circle center={[userCoords.lat, userCoords.lng]} radius={RAIO_METROS} pathOptions={{ color: "#00f5d4", fillOpacity: 0.1 }} />

        {bancoQuestoes.map((ponto) => {
          const resolvido = progresso.quizesResolvidos.includes(ponto.id);
          const dist = obterDistancia(userCoords.lat, userCoords.lng, ponto.lat, ponto.lng);
          const dentroDoRaio = dist <= RAIO_METROS;

          return (
            <Marker key={ponto.id} position={[ponto.lat, ponto.lng]} icon={portalIcon}>
              <Popup>
                <div className="popup-inner">
                  <h4>{ponto.titulo}</h4>
                  <p>Local: {ponto.nomeLocal}<br/>Distância: {Math.round(dist)}m</p>
                  {resolvido ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>✅ ESTABILIZADA</span>
                  ) : dentroDoRaio ? (
                    <button onClick={() => setQuestaoAtiva(ponto)} className="btn btn-accent" style={{ padding: "6px 12px", fontSize: "12px" }}>
                      ⚡ INTERCEPTAR
                    </button>
                  ) : (
                    <span style={{ color: "var(--primary)", fontSize: "11px", fontWeight: "bold" }}>❌ MUITO LONGE</span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}