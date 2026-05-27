import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import L from "leaflet"; // Garante que a instância global do Leaflet 'L' está acessível

export default function Mapa() {
    const centroInicial = [-22.913933, -47.00];
    const [posicao, setPosicao] = useState(null);
    const [erro, setErro] = useState("");
    const [pontos, setPontos] = useState([]);
    const idRef = useRef(1);
    
    const local = [-22.9137900, -47.0681000];
    const zoomInicial = local ? 15 : 13;

    function calcularDistanciaM(alvo, origem) {
        if (!origem) return null;
        const a = L.latLng(origem);
        const b = L.latLng(alvo.lat, alvo.lng);
        return a.distanceTo(b);
    }

    function formatarM(metros) {
        if (metros == null) return "--";
        if (metros < 1000) return `${metros.toFixed(0)}m`;
        return `${(metros / 1000).toFixed(2)}km`;
    }

    function adicionarPonto({ lat, lng }) {
        const novo = {
            id: idRef.current++,
            lat,
            lng,
            distanciaM: calcularDistanciaM({ lat, lng }, local)
        };
        setPontos((prev) => [...prev, novo]);
    }

    function limparPontos() {
        setPontos([]);
        idRef.current = 1;
    }

    const pontosOrdenados = [...pontos].sort((a, b) => {
        const da = a.distanciaM ?? Infinity;
        const db = b.distanciaM ?? Infinity;
        return da - db;
    });

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setErro("Seu navegador não tem suporte para geolocalização!");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude, // Corrigido 'Ing' para 'lng'
                });
            },
            () => {
                setErro("Não foi possível obter sua localização.");
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    }, []);

    function ClickHandler({ onAdd }) {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                onAdd({ lat, lng });
            },
        });
        return null;
    }

    return (
        <section className="mapa" style={{ padding: '1rem' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Mapa 🕸️</h1>

            {erro && <div className="erro" style={{ color: 'var(--error)' }}>{erro}</div>}

            <section className="painel" style={{ background: 'var(--bg2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div className="painel-topo" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Pontos Adicionados</span>
                    <button className="btn" style={{ background: 'var(--primary)', color: '#fff', padding: '4px 12px', fontSize: '0.85rem' }} onClick={limparPontos}>
                        Limpar Pontos!
                    </button>
                </div>

                {pontos.length === 0 ? (
                    <p style={{ color: '#a0a0a5' }}>Nenhum ponto adicionado. Clique no mapa para adicionar</p>
                ) : (
                    <ul className="lista-pontos" style={{ listStyle: 'none' }}>
                        {pontosOrdenados.map((p) => (
                            <li key={p.id} className="lista-pontos-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                <span>#{p.id}</span>
                                <span>{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</span>
                                <span className="dist" style={{ color: 'var(--ring)', fontWeight: 'bold' }}>{formatarM(p.distanciaM)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <MapContainer
                center={posicao ? [posicao.lat, posicao.lng] : centroInicial}
                zoom={zoomInicial}
                scrollWheelZoom={true}
                className="mapazinho"
                style={{ height: '50vh', borderRadius: '12px', border: '3px solid var(--primary)' }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {local && (
                    <Marker position={local}>
                        <Popup>Você está aqui!</Popup>
                    </Marker>
                )}

                {pontos.map((p) => (
                    <Marker key={p.id} position={[p.lat, p.lng]}>
                        <Popup>
                            <div>
                                <strong>Ponto #{p.id}</strong>
                                <p>Distância: {formatarM(p.distanciaM)}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <ClickHandler onAdd={adicionarPonto} />
            </MapContainer>
        </section>
    );
}