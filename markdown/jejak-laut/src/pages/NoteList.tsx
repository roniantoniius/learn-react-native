import { useMemo, useState } from "react";
import { Row, Col, Stack, Button, Form, Card, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../App";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
  longitude: number;
  latitude: number;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
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
              {/* Bagian 1 */}
              <Col xs={12} md={4}>
                <Card className={`text-center ${styles.subCard}`}>
                  <Card.Body>
                    <img src="/1.png" alt="Step 1" className={styles.guideImage} />
                    <p className="custom-medium mt-2">1. Buat Catatan Jejak Baru Kamu!</p>
                  </Card.Body>
                </Card>
              </Col>
              {/* Bagian 2 */}
              <Col xs={12} md={4}>
                <Card className={`text-center ${styles.subCard}`}>
                  <Card.Body>
                    <img src="/2.png" alt="Step 2" className={styles.guideImage} />
                    <p className="custom-medium mt-2">
                      2. Format Kategori Yang Efisien
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              {/* Bagian 3 */}
              <Col xs={12} md={4}>
                <Card className={`text-center ${styles.subCard}`}>
                  <Card.Body>
                    <img src="/3.png" alt="Step 3" className={styles.guideImage} />
                    <p className="custom-medium mt-2">3. Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!</p>
                  </Card.Body>
                </Card>
              </Col>
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

function NoteCard({ id, title, tags, longitude, latitude }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5 custom-medium">{title}</span>
          {tags.length > 0 && (
            <><Stack
              gap={2}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge key={tag.id} className="custom-tag text-truncate">
                  {" "}
                  {tag.label}
                </Badge>
              ))}
            </Stack>
                <h5 className="fs-5 custom-very-small">{latitude}, {longitude}</h5>
              </>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="custom-text-color custom-medium">Ubah Kategori</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
