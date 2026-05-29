import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import QuestionDialog from "./QuestionDialog";
import QUESTOES from "../data/perguntas.json";

// Coordenadas fictícias simulando pontos dentro do SENAI Roberto Mange
const PONTOS_REAIS = {
  q1: { id: "q1", nome: "Laboratório Frontend", lat: -22.91379, lng: -47.06810, raio: 5 },
  q2: { id: "q2", nome: "Biblioteca Secreta", lat: -22.91395, lng: -47.06830, raio: 5 },
  q3: { id: "q3", nome: "Oficina de Automação", lat: -22.91410, lng: -47.06805, raio: 5 },
};

export default function Mapa({ progresso, setProgresso, IrParaInventario, onReset }) {
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [gpsAtivo, setGpsAtivo] = useState(true);
  const [questoselecionada, setQuestoSelecionada] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGpsAtivo(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const novaPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMinhaPosicao(novaPos);
        setGpsAtivo(true);
        verificarProximidade(novaPos);
      },
      () => setGpsAtivo(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [progresso.quizesResolvidos]);

  const verificarProximidade = (pos) => {
    const latLngOrigem = L.latLng(pos.lat, pos.lng);
    
    QUESTOES.forEach((q) => {
      const infoPonto = PONTOS_REAIS[q.id];
      if (!infoPonto) return;
      
      const latLngAlvo = L.latLng(infoPonto.lat, infoPonto.lng);
      const distancia = latLngOrigem.distanceTo(latLngAlvo);

      if (distancia <= infoPonto.raio && !progresso.pontosDesbloqueados.includes(q.id)) {
        setProgresso(prev => ({
          ...prev,
          pontosDesbloqueados: [...prev.pontosDesbloqueados, q.id]
        }));
      }
    });
  };

  return (
    <div className="game-screen">
      <header className="game-header">
        <div>
          <h2>MAPA MÁGICO</h2>
          <p className="status-gps">{gpsAtivo ? "🛰️ GPS CONECTADO" : "⚠️ MODO SEQUENCIAL (SEM GPS)"}</p>
        </div>
        <button className="btn-hud" onClick={IrParaInventario}>🎒 Inventário ({progresso.pistasColetadas.length})</button>
      </header>

      <div className="map-wrapper">
        <MapContainer center={[-22.91379, -47.06810]} zoom={18} className="game-map">
          <TileLayer 
            attribution='&copy; OpenStreetMap' 
            url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=YOUR_TOKEN" // Recomendo mapa escuro estilo hacker/cyberpunk
          />
          
          {minhaPosicao && (
            <Marker position={[minhaPosicao.lat, minhaPosicao.lng]}>
              <Popup>Sua Localização Real</Popup>
            </Marker>
          )}

          {QUESTOES.map((q) => {
            const ponto = PONTOS_REAIS[q.id];
            const isDesbloqueado = progresso.pontosDesbloqueados.includes(q.id) || !gpsAtivo;
            const isResolvido = progresso.quizesResolvidos.includes(q.id);

            if (!isDesbloqueado && gpsAtivo) return null; // Névoa de guerra: oculta pontos longe

            return (
              <React.Fragment key={q.id}>
                <Circle 
                  center={[ponto.lat, ponto.lng]} 
                  radius={ponto.raio} 
                  pathOptions={{ color: isResolvido ? 'var(--success)' : 'var(--primary)', fillColor: 'transparent' }} 
                />
                <Marker 
                  position={[ponto.lat, ponto.lng]}
                  eventHandlers={{
                    click: () => {
                      if (!isResolvido) setQuestoSelecionada(q);
                    }
                  }}
                >
                  <Popup>
                    <div className="popup-game">
                      <h3>{ponto.nome}</h3>
                      <p>{isResolvido ? "✅ Mistério Resolvido!" : "❌ Clique para abrir o Quiz do Guardião"}</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      <footer className="game-footer">
        <p>Progresso Geral: {Math.round((progresso.quizesResolvidos.length / QUESTOES.length) * 100)}%</p>
        <button className="btn-danger-sm" onClick={onReset}>Reiniciar Sistema</button>
      </footer>

      {questoselecionada && (
        <QuestionDialog 
          questoes={questoselecionada}
          onClose={() => setQuestoSelecionada(null)}
          progresso={progresso}
          setProgresso={setProgresso}
        />
      )}
    </div>
  );
}