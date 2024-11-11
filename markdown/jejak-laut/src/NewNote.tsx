import { Col, Stack } from "react-bootstrap";
import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";
import styles from "./NoteList.module.css";
import './Note.css';

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  return (
    <>
      <Col>
        <Stack direction="horizontal" gap={2} className="align-items-center mb-4">
          <img src="/logo1.svg" alt="Logo" style={{ width: '40px', height: '40px' }} />
          <h1 className="mb-0 custom-judul" style={{ fontSize: '1.5em', margin: 0 }}>Catatan Jejak Laut Baru!</h1>
        </Stack>
      </Col>
      <hr className={styles.horizontalDivider} />
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}
