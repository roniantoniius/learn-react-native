import { Col, Stack, Button } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { NoteForm } from "../components/NoteForm";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect } from "react";

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  const navigate = useNavigate();
  
  // Use local storage for latitude and longitude
  const [selectedLat, setSelectedLat] = useLocalStorage<number | null>("selectedLatitude", null);
  const [selectedLng, setSelectedLng] = useLocalStorage<number | null>("selectedLongitude", null);

  // Effect to retrieve stored latitude and longitude from local storage
  useEffect(() => {
    const storedLatitude = localStorage.getItem("selectedLatitude");
    const storedLongitude = localStorage.getItem("selectedLongitude");

    if (storedLatitude) {
      setSelectedLat(JSON.parse(storedLatitude));
    }
    if (storedLongitude) {
      setSelectedLng(JSON.parse(storedLongitude));
    }
  }, [setSelectedLat, setSelectedLng]);

  return (
    <>
      <Col>
        <Stack direction="horizontal" gap={2} className="align-items-center mb-4">
          <img src="/dark-nobg.svg" alt="Logo" style={{ width: '40px', height: '40px' }} />
          <h1 className="mb-0 custom-judul" style={{ fontSize: '1.5em', margin: 0 }}>Catatan Jejak Laut Baru!</h1>
        </Stack>
      </Col>
      <hr className={styles.horizontalDivider} />

      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
        latitude={selectedLat || 0}
        longitude={selectedLng || 0}
      />
      <div className="mb-3">
        <Button variant="outline-danger text" onClick={() => navigate("/pilihlokasi")}>Pilih lokasi di Peta</Button>
      </div>
    </>
  );
}