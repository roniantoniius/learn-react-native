import { Col, Stack, Button } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { NoteForm } from "../components/NoteForm";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  const [selectedLat, setSelectedLat] = useState(0);
  const [selectedLng, setSelectedLng] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLatitude = localStorage.getItem("selectedLatitude");
    const savedLongitude = localStorage.getItem("selectedLongitude");
    if (savedLatitude && savedLongitude) {
      setSelectedLat(JSON.parse(savedLatitude));
      setSelectedLng(JSON.parse(savedLongitude));
      localStorage.removeItem("selectedLatitude");
      localStorage.removeItem("selectedLongitude");
    }
  }, []);

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
        latitude={selectedLat}
        longitude={selectedLng}
      />
      <div className="mb-3">
        <Button variant="outline-primary" onClick={() => navigate("/pilihlokasi")}>Pilih lokasi di Peta</Button>
        {selectedLat !== 0 && selectedLng !== 0 && (
          <div className="mt-2">
            <strong>Lokasi: </strong> {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
          </div>
        )}
      </div>
    </>
  );
}