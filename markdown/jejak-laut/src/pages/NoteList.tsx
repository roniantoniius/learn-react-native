import { useMemo, useState } from "react";
import { Row, Col, Stack, Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../App";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';
import { GuideStep } from "../components/GuideStep";
import { EditTagsModal } from "../components/EditTagsModel";
import { NoteCard, SimplifiedNote } from "../components/NoteCard";

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLocaleLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <Stack direction="horizontal" gap={2}>
            <img src="/dark-nobg.svg" alt="Logo" style={{ width: '40px', height: '40px'}} />
            <h1 style={{ fontSize: '1.5em', margin: 0 }} className="custom-judul">Jejak Laut</h1>
          </Stack>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/baru">
              <Button variant="primary custom-button">Tambah Jejak Baru</Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary text"
            >
              Perbarui Kategori
            </Button>
          </Stack>
        </Col>
      </Row>
      <hr className={styles.horizontalDivider} />
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label className="custom-medium">Cari judul catatan kamu!</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label className="custom-medium">Kategori</Form.Label>
              <ReactSelect className="text"
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Card className={`h-100 text-reset text-decoration-none ${styles.card} ${styles.guideCard}`}>
        <Card.Body>
          <Stack gap={4} className="align-items-center justify-content-center">
            <span className="fs-5 custom-medium">Panduan Jejak Laut</span>
            <Row className="g-3 justify-content-center">
              <GuideStep stepNumber={1} imageSrc="/1.png" description="Buat Catatan Jejak Baru Kamu!" />
              <GuideStep stepNumber={2} imageSrc="/2.png" description="Format Kategori Yang Efisien" />
              <GuideStep stepNumber={3} imageSrc="/3.png" description="Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!" />
            </Row>
          </Stack>
        </Card.Body>
      </Card>

      <Row xs={1} sm={2} lg={3} xl={2} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} latitude={note.latitude} longitude={note.longitude} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}