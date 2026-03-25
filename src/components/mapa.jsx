import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { useEffect, useState, useRef } from "react";
import { marker } from "leaflet";


export default function Mapa() {

    const centroInicial = [-22.913933, -47.00];
    const [posicao, setPosicao] = useState(null);
    const [erro, setErro] = useState("");
    const [pontos, setPontos] = useState([]);
    const idRef = useRef(1);
    
    function calcularDistanciaM(alvo, origem) {
        if(!origem) return null;

        const a = L.latLng(origem)
        const b = L.latLng(alvo.lat, alvo.lng)
        return a.distanceTo(b);
    }


    function formatarM(metros) {
        if(metros == null) return "--"
        if(metros < 1000) return `${metros.toFixed(0)}m`
        return `${(metros / 1000).toFixed(2)}km`
    }


    function adicionarPonto({lat, lng}) {
        const novo = {
            id: idRef.current++,
            lat,
            lng,
            distanciaM: calcularDistanciaM({lat, lng}, local)
        }
        setPontos( (prev) => [...prev,novo] )
    }


    function limparPontos() {
        setPontos([])
        idRef.current = 1
    }


    const pontosOrdenados = [...pontos].sort((a,b) => {
        const da = a.distanciaM ?? Infinity
        const db = b.distanciaM ?? Infinity
        return da - db;
    })


    useEffect(() => {

        if (!("geolocation" in navigator)) {
            setErro("Seu navegador não tem suporte para geolocalização!")
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({
                    lat: pos.coords.latitude,
                    Ing: pos.coords.longitude,
                });
            },
            () => {
                setErro("Não foi possivel obter sua localização.")
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    }, []);

    const local = [-22.9137900, -47.0681000]
    const zoomInicial = local ? 15 : 13;

    function ClickHandler ({onAdd}) {
        useMapEvents({
            click(e) {
                const {lat, lng} = e.latlng;
                onAdd({lat, lng});
            },
        });
        return null;
    }

    return (
        <section className="mapa">
            <h1>Mapa :3</h1>

            {erro && <div className="erro">{erro}</div>}

            <section className="painel">
                <div className="painel-topo">
                    <span>Pontos Adicionados</span>
                    <button className="botao"
                            onClick={limparPontos}>
                        Limpar Pontos!
                    </button>
                </div>

                {pontos.length === 0 ?(
                    <p>Nenhum ponto adicionado. Clique no mapa para adicionar</p>
                ) : (
                    <ul className="lista-pontos">
                        {pontosOrdenados.map((p) => (
                            <li key={p.id} className="lista-pontos-item">
                                <span>#{p.id}</span>
                                <span>
                                    {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                                </span>
                                <span className="dist">
                                    {formatarM(p.distanciaM)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <MapContainer
                center={posicao ? local : centroInicial}
                zoom={zoomInicial}
                scrollWheelZoom={true}
                className="mapazinho"
            >
                <TileLayer
                    attribution="&copy; OpenstreetMap"
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
                                <p>Distancia: {formatarM(p.distanciaM)}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <ClickHandler onAdd={adicionarPonto} />
            </MapContainer>
        </section>
    )
}