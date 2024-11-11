import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./NoteList.module.css";

type NoteProps = {
  onDelete: (id: string) => void;
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote();
  const navigate = useNavigate();

  return (
    <>
      <Row className="align-items-center mb-4">
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
            <Link to={`/${note.id}/edit`}>
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
            <Link to="/">
              <Button variant="outline-secondary text">Kembali</Button>
            </Link>
          </Stack>
        </Col>
      </Row>

      {/* Garis pembatas horizontal */}
      <hr className={styles.horizontalDivider} />

      {/* Kontainer untuk Markdown dengan jarak di bagian atas */}
      <div className={`${styles.markdownContainer} mt-3`}>
        <ReactMarkdown>{note.markdown}</ReactMarkdown>
      </div>
    </>
  );
}