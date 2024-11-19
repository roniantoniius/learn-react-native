import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "../layouts/NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "../styles/NoteList.module.css";
import remarkGfm from "remark-gfm";
import '../styles/Note.css';

type NoteProps = {
  onDelete: (id: string) => void;
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote();
  const navigate = useNavigate();

  return (
    <>
      <Row className="align-items-center mb-4">
        <img src="/dark-nobg.svg" alt="Logo" style={{ width: '85px', height: '60px' }} />
        <Col>
          <h1 className="custom-medium">{note.title}</h1>
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
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/ubah`}>
              <Button variant="primary custom-button">Ubah</Button>
            </Link>
            <Button
              onClick={() => {
                onDelete(note.id);
                navigate("/");
              }}
              variant="outline-danger text"
            >
              Hapus
            </Button>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="outline-secondary text">Kembali</Button>
            </Link>
          </Stack>
        </Col>
      </Row>

      <hr className={styles.horizontalDivider} />

      <Row className="mt-3">
        <Col>
          <div className={`${styles.markdownContainer} mt-3 mb-3`}>
            <h5>Latitude</h5>
            <p>{note.latitude}</p>
          </div>
        </Col>
        <Col>
          <div className={`${styles.markdownContainer} mt-3`}>
            <h5>Longitude</h5>
            <p>{note.longitude}</p>
          </div>
        </Col>
      </Row>

      <div className={`${styles.markdownContainer} mt-3 mb-4`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.markdown}</ReactMarkdown>
      </div>

      <div className="d-flex align-items-center mt-3">
      <div className="flex-grow-1 me-2">
        <Link to={`/${note.id}/ubah`} style={{ textDecoration: 'none' }}>
          <Button variant="primary custom-button d-flex align-items-center justify-content-center w-100">
            <img src="/christmas-stars.png" alt="stars" className="me-2" style={{ width: "20px", height: "20px" }} />
            Selesaikan Dengan AI
          </Button>
        </Link>
      </div>
      <div>
        <Link to={`/${note.id}/lokasi`} style={{ textDecoration: 'none' }}>
          <Button variant="primary custom-button-2 text w-100">
            Periksa Lokasi
          </Button>
        </Link>
      </div>
    </div>
    </>
  );
}
