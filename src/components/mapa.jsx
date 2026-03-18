import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react";
import { marker } from "leaflet";


export default function Mapa() {

    const centroInicial = [-22.913933, -47.00];
    const [posicao, setPosicao] = useState(null);
    const [erro, setErro] = useState("");

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

    return (
        <section className="mapa">
            <h1>Mapa :3</h1>

            {erro && <div className="erro">{erro}</div>}

            <MapContainer
                center={posicao ? local : centroInicial}
                zoom={zoomInicial}
                scrollWheelZoom={true}
                className="mapazinho"
            >
                <TileLayer
                    attribution="&copy; OpenstreeMap"
                    url="https://{s}.title.openstreeetmap.org/{z}/{x/{y}.png"
                />

                {local && (
                    <Marker position={local}>
                        <Popup>Você está aqui!</Popup>
                    </Marker>
                )}

            </MapContainer>
        </section>
    )
}