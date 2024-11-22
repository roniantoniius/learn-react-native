import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "react-bootstrap";
import L from "leaflet";
import "../styles/NoteLokasi.css";

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function PickLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const navigate = useNavigate();

  // Handle map click to set the marker
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const handleSaveLocation = () => {
    if (position) {
      // Simpan lokasi ke local storage dengan nama yang spesifik
      localStorage.setItem("selectedLatitude", JSON.stringify(position[0]));
      localStorage.setItem("selectedLongitude", JSON.stringify(position[1]));
      navigate("/baru", { state: { latitude: position[0], longitude: position[1] } }); // Redirect back to the NewNote page
    } else {
      alert("Silakan pilih lokasi terlebih dahulu!");
    }
  };

  return (
    <div className="pick-location-container">
      <MapContainer
        center={[-2.5, 118]} // Default Indonesia location
        zoom={5}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {position && <Marker position={position} icon={markerIcon} />}
      </MapContainer>
      <div className="pick-location-actions">
        <Button variant="primary" onClick={handleSaveLocation} className="custom-button">
          Simpan Lokasi
        </Button>
        <Button variant="secondary" onClick={() => navigate("/baru")} className="custom-button">
          Batal
        </Button>
      </div>
    </div>
  );
}