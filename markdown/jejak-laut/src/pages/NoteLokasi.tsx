import { useState, useEffect } from "react";
import { useNote } from "../layouts/NoteLayout";
import { GoogleMap, DirectionsRenderer, useJsApiLoader, Marker, Libraries } from "@react-google-maps/api";
import { Button, Card } from "react-bootstrap";
import "../styles/NoteLokasi.css";

const libraries: Libraries = ["places"]; // Konstanta statis untuk menghindari warning

export function NoteLokasi() {
    const note = useNote();
    const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [isCardVisible, setCardVisible] = useState(true);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error("Error ketika mengambil lokasi: ", error)
            );
        }
    }, []);

    useEffect(() => {
        if (userPosition && note) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userPosition,
                    destination: { lat: note.latitude, lng: note.longitude },
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);
                    } else {
                        console.error("Error ketika mengambil rute: ", status);
                    }
                }
            );
        }
    }, [userPosition, note]);

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={userPosition || { lat: note.latitude, lng: note.longitude }}
                zoom={12}
            >
                {userPosition && (
                    <Marker
                        position={userPosition}
                        title="Posisi Anda"
                    />
                )}
                <Marker
                    position={{ lat: note.latitude, lng: note.longitude }}
                    title="Lokasi Catatan"
                />
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>

            {isCardVisible && (
                <Card className="info-card">
                    <Card.Body>
                        <h4>{note.title}</h4>
                        <p><strong>Tags:</strong> {note.tags.map((tag) => tag.label).join(", ")}</p>
                        <p><strong>Latitude:</strong> {note.latitude}</p>
                        <p><strong>Longitude:</strong> {note.longitude}</p>
                        <p><strong>Deskripsi:</strong> {note.markdown}</p>
                        <Button variant="secondary" onClick={() => setCardVisible(false)}>
                            Sembunyikan Detail
                        </Button>
                    </Card.Body>
                </Card>
            )}

            {!isCardVisible && (
                <Button
                    variant="primary"
                    className="show-details-button"
                    onClick={() => setCardVisible(true)}
                >
                    Tampilkan Detail
                </Button>
            )}
        </div>
    );
}