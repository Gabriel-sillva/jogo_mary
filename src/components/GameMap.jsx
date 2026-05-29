import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Hack para corrigir os ícones padrões do Leaflet que quebram no build do React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Ícone Customizado estilo Aranhaverso para a posição do Jogador (Aranha Vermelha)
const playerIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/isometric/50/spider.png", 
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Ícone para as Fendas Dimensionais (Anomalias/Portais)
const anomalyIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/neon/96/portal.png", 
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22]
});

// Sub-componente para recentrar o mapa automaticamente
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 18);
    }
  }, [coords, map]);
  return null;
}

export default function GameMap({ progresso, bancoQuestoes, setQuestaoAtiva }) {
  // Coordenadas padrão de simulação (Ponto central do SENAI Roberto Mange)
  const centroSenai = { lat: -22.91395, lng: -47.06820 };
  const RAIO_DESBLOQUEIO_METROS = 15;

  const [userCoords, setUserCoords] = useState(centroSenai);
  const [gpsAtivo, setGpsAtivo] = useState(false);
  const [erroGps, setErroGps] = useState("");

  // 1. ATIVAR E MONITORAR GEOLOCALIZAÇÃO EM TEMPO REAL
  useEffect(() => {
    if (!navigator.geolocation) {
      setErroGps("O teu navegador não suporta Geolocalização.");
      return;
    }

    const geoId = navigator.geolocation.watchPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsAtivo(true);
        setErroGps("");
      },
      (error) => {
        console.warn("GPS indisponível. Usando simulação no SENAI.");
        setGpsAtivo(false);
        setUserCoords(centroSenai);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(geoId);
  }, []);

  // 2. FUNÇÃO MATEMÁTICA PARA CALCULAR DISTÂNCIA (Fórmula de Haversine)
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raio da Terra em metros
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
  };

  // 🛡️ FILTRO DE SEGURANÇA: Evita que o mapa quebre ou fique preto enquanto o JSON carrega
  if (!bancoQuestoes || bancoQuestoes.length === 0 || !userCoords) {
    return (
      <div className="quiz-overlay" style={{ position: "absolute" }}>
        <div className="quiz-modal" style={{ textAlign: "center" }}>
          <h3 className="quiz-title">
            🕸️ SINCRONIZANDO COM A REDE DO ARANHAVERSO...
          </h3>
          <p className="popup-portal-text">A recalibrar a teia de dados e o mapa do SENAI.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-map-container">
      
      {/* BARRA DE STATUS DO GPS (ESTILIZADA COM CLASSES CSS) */}
      <div className={`gps-status-bar ${gpsAtivo ? "gps-ativo" : "gps-inativo"}`}>
        {gpsAtivo ? (
          <span>🛰️ GPS ATIVO: MODO PROXIMIDADE (SENAI)</span>
        ) : (
          <span>⚠️ GPS INATIVO: PROGRESSÃO SEQUENCIAL (DEV TEST)</span>
        )}
      </div>

      <MapContainer 
        center={[userCoords.lat, userCoords.lng]} 
        zoom={18} 
        className="map-element"
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ChangeMapView coords={userCoords} />

        {/* Marcador do Jogador */}
        <Marker position={[userCoords.lat, userCoords.lng]} icon={playerIcon}>
          <Popup>
            <div className="popup-player-text">
              {gpsAtivo ? "🦅 Tu estás aqui!" : "💻 Posição Simulada no SENAI (Modo de Teste)"}
            </div>
          </Popup>
        </Marker>

        <Circle 
          center={[userCoords.lat, userCoords.lng]} 
          radius={RAIO_DESBLOQUEIO_METROS}
          pathOptions={{ color: "#00f5d4", fillColor: "#00f5d4", fillOpacity: 0.12 }}
        />

        {/* RENDERIZAR OS PINS DAS ANOMALIAS */}
        {bancoQuestoes.map((ponto) => {
          const jaRespondido = progresso.quizesResolvidos.includes(ponto.id);
          const distancia = calcularDistancia(userCoords.lat, userCoords.lng, ponto.lat, ponto.lng);

          const deveExibirNoMapa = true; 
          const podeInteragir = !jaRespondido; 

          if (!deveExibirNoMapa) return null;

          return (
            <React.Fragment key={ponto.id}>
              <Circle 
                center={[ponto.lat, ponto.lng]} 
                radius={RAIO_DESBLOQUEIO_METROS}
                pathOptions={{ 
                  color: jaRespondido ? "#444" : podeInteragir ? "#00f5d4" : "#dc143c",
                  fillOpacity: 0.05 
                }}
              />

              <Marker position={[ponto.lat, ponto.lng]} icon={anomalyIcon}>
                <Popup>
                  <div className="popup-portal-container">
                    
                    {/* SPRITE DO GUARDIÃO */}
                    {ponto.sprite && (
                      <div className="popup-sprite-wrapper">
                        <img 
                          src={`/${ponto.sprite}`} 
                          alt={ponto.personagem} 
                          className="popup-character-sprite"
                          onError={(e) => {
                            e.target.src = "https://img.icons8.com/isometric/50/spider.png";
                          }}
                        />
                      </div>
                    )}

                    {/* DADOS DO JSON */}
                    <h5 className="popup-character-name">
                      👤 {ponto.personagem || "Guardião"}
                    </h5>

                    <h4 className="popup-portal-title">
                      {ponto.titulo}
                    </h4>
                    
                    <p className="popup-portal-text">📍 Local: {ponto.nomeLocal}</p>
                    
                    <p className="popup-portal-distance">
                      📏 Afastado {Math.round(distancia)}m
                    </p>

                    {podeInteragir ? (
                      <button 
                        className="btn-spider-action"
                        onClick={() => setQuestaoAtiva(ponto)}
                      >
                        ⚡ INTERCEPTAR FENDA
                      </button>
                    ) : (
                      <span className="status-estabilizado">
                        ✅ ESTABILIZADA
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}