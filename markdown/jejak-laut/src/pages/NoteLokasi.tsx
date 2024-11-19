import { useState, useEffect } from "react";
import { useNote } from "../layouts/NoteLayout";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Button, Card, Col, Row, Stack, Badge, } from "react-bootstrap";
import "../styles/NoteLokasi.css";
import "leaflet/dist/leaflet.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../styles/NoteList.module.css";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import polyline from "@mapbox/polyline";

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
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {userLocation && <MapFocus userLocation={userLocation} />}
                {userLocation && (
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                        <Popup>Lokasi Kamu!</Popup>
                    </Marker>
                )}
                <Marker position={[note.latitude, note.longitude]}>
                    <Popup>Lokasi Catatan Jejak Laut</Popup>
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