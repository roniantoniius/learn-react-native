import { useState, useEffect } from "react";
import { useNote } from "../layouts/NoteLayout";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl } from "react-leaflet";
import { Button, Card, Col, Row, Stack, Badge, } from "react-bootstrap";
import "../styles/NoteLokasi.css";
import "leaflet/dist/leaflet.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../styles/NoteList.module.css";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import polyline from "@mapbox/polyline";
import L from "leaflet";

type Location = {
    latitude: number;
    longitude: number;
}

function MapFocus({ userLocation }: { userLocation: Location }) {
    const map = useMap();

    useEffect(() => {
        if (userLocation) {
            map.flyTo([userLocation.latitude, userLocation.longitude], 13, {
                animate: true,
            });
        }
    }, [map, userLocation]);

    useEffect(() => {
        map.invalidateSize();
    }, [map]);

    return null;
}

export function NoteLokasi() {
    const note = useNote();
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [distance, setDistance] = useState<string | null>(null);
    const [isCardVisible, setIsCardVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [optimizedRoute, setOptimizedRoute] = useState<[number, number][]>([]);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [noteAddress, setNoteAddress] = useState<string | null>(null);

    const redIcon = new L.Icon({
        iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
        iconSize: [25, 41], // Ukuran ikon
        iconAnchor: [12, 41], // Posisi anchor
        popupAnchor: [1, -34], // Posisi popup
        shadowSize: [41, 41], // Ukuran bayangan
    });
    

    // untuk mengambil rute terpendek dari userLocation ke note

    // selain driving itu adaa juga walking, cycling, dan driving-traffic

    // cara ganti warna rute: tambahkan parameter color pada Polyline

    // cara ganti tipe peta dengan mapstyle
    const fetchRoute = async (start: Location, end: Location) => {
        try {
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`
            );
            const route = response.data.routes[0];
            const decodedRoute: [number, number][] = polyline.decode(route.geometry).map(([lat, lng]: [number, number]) => [lat, lng]);
            setOptimizedRoute(decodedRoute);
        } catch (error) {
            console.error("Error saat mengambil rute: ", error);
        }
    };

    const fetchAddy = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: "json",
                },
            });

            const addy = response.data.display_name;
            return addy;
        } catch (error) {
            console.error("Error saat mengambil alamat: ", error);
            return null;
        }
    };

    // Mendapatkan lokasi user saat ini
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(location);
                    fetchRoute(location, { latitude: note.latitude, longitude: note.longitude });
                },
                (error) => {
                    console.error("Error mendapat lokasi: ", error);
                }
            );
        }
    }, [note.latitude, note.longitude]);

    // Menghitung jarak antara userLocation dan note
    useEffect(() => {
        if (userLocation) {
            const R = 6371; //radius bumi
            const dLat = (note.latitude - userLocation.latitude) * (Math.PI / 180);
            const dLon = (note.longitude - userLocation.longitude) * (Math.PI / 180);

            // Rumus Haversine pada a untuk menghitung sudut antara dua titik
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userLocation.latitude * (Math.PI / 180)) *
                    Math.cos(note.latitude * (Math.PI / 180)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            
            // Rumus Haversine pada c untuk menghitung jarak antara dua titik
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            setDistance((R * c).toFixed(2) + " km");
        }
    }, [userLocation, note.latitude, note.longitude]);

    useEffect(() => {
        if (userLocation) {
            fetchAddy(userLocation.latitude, userLocation.longitude).then((addy) => {
                setUserAddress(addy);
            });
        }
    }, [userLocation]);

    useEffect(() => {
        fetchAddy(note.latitude, note.longitude).then((addy) => {
            setNoteAddress(addy);
        });
    }, [note.latitude, note.longitude]);

    const toggleCardVisibility = () => {
        setIsCardVisible((prev) => !prev);
        if (isCardVisible) {
            setIsCardVisible(false);
            setIsMinimized(true);
        } else if (isMinimized) {
            setIsCardVisible(true);
            setIsMinimized(false);
        } else {
            setIsCardVisible(true);
        }
    };

    return (
        <div className="note-lokasi-container">
            <MapContainer 
                center={userLocation ? [userLocation.latitude, userLocation.longitude] : [note.latitude, note.longitude]}
                zoom={13}
                style={{ height: "100vh", width: "100%" }}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="Default">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="CartoDB Positron">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Esri World Imagery">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, NCI, USDA FSA, USGS, AeroGRID, IGN, and the GIS User Community'
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                {userLocation && <MapFocus userLocation={userLocation} />}
                {userLocation && (
                    <Marker position={[userLocation.latitude, userLocation.longitude]} icon={redIcon}>
                        <Popup>
                            <div>
                                <p><strong>Lokasi Kamu Saat Ini!</strong></p>
                                <p><strong>Koordinat</strong></p>
                                <p>{userLocation.latitude}, {userLocation.longitude}</p>
                                <p><strong>Alamat:</strong></p>
                                <p>{userAddress || "Lagi cari alamatnya nih..."}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                <Marker position={[note.latitude, note.longitude]}>
                    <Popup>
                        <div>
                            <h5 className="custom-medium-small-2">Lokasi Catatan {note.title}</h5>
                            <p><strong>Koordinat</strong></p>
                            <p>{note.latitude}, {note.longitude}</p>
                            <p><strong>Alamat:</strong></p>
                            <p>{noteAddress || "Lagi cari alamatnya nih..."}</p>
                        </div>
                    </Popup>
                </Marker>
                {optimizedRoute.length > 0 && (
                    <Polyline positions={optimizedRoute} color="blue" />
                )}
            </MapContainer>
            <div className={`note-lokasi-card ${isCardVisible ? "visible" : isMinimized ? "minimized" : "hidden"}`}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs="auto">
                                <Button
                                    className="accordion-toggle"
                                    variant="link"
                                    onClick={toggleCardVisibility}
                                >
                                    {isCardVisible ? <FaChevronDown /> : <FaChevronUp />}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                    {isMinimized ? (
                        <div className="content-wrapper">
                            <Row>
                                <Col>
                                    <div className="d-flex">
                                        <h1 className="custom-medium-small me-2">{note.title}</h1>
                                        {userLocation && (
                                            <h1 className="custom-medium-small me-2">| {distance}</h1>
                                        )}
                                    </div>
                                    {note.tags.length > 0 && (
                                            <Stack gap={1} direction="horizontal" className="flex-wrap">
                                                {note.tags.map((tag) => (
                                                    <Badge key={tag.id} className="text-truncate custom-tag">
                                                        {tag.label}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                    )}
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="outline-secondary text"
                                        onClick={() => history.back()}
                                    >
                                        Kembali
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <Card.Body>
                            <Row>
                                <Col>
                                    <div className="d-flex">
                                        <h1 className="custom-medium-small me-2">{note.title}</h1>
                                        {userLocation && <h1 className="custom-medium-small me-2">| {distance}</h1>}
                                    </div>
                                    {note.tags.length > 0 && (
                                        <Stack gap={1} direction="horizontal" className="flex-wrap">
                                            {note.tags.map((tag) => (
                                                <Badge key={tag.id} className="text-truncate custom-tag">
                                                    {tag.label}
                                                </Badge>
                                            ))}
                                        </Stack>
                                    )}
                                </Col>
                                <Col xs="auto">
                                    <Button variant="outline-secondary text" onClick={() => history.back()}>Kembali</Button>
                                </Col>
                            </Row>
                            <hr className={styles.horizontalDivider} />
                            <div className={`${styles.markdownContainerLokasi} mt-3`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.markdown}</ReactMarkdown>
                            </div>
                        </Card.Body>
                    )}
                </Card>
            </div>
        </div>
    );
}