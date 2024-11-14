import { Badge, Col, Stack } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { NoteForm } from "../components/NoteForm";
import { useNote } from "../layouts/NoteLayout";
import styles from "../styles/NoteList.module.css";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
  const note = useNote();
  return (
    <>
      <Col>
        <h1 className="custom-medium">Ubah {note.title}</h1>
        {note.tags.length > 0 && (
          <Stack gap={2} direction="horizontal" className="flex-wrap">
            {note.tags.map((tag) => (
              <Badge key={tag.id} className="text-truncate custom-tag">
                {tag.label}
              </Badge>
            ))}
          </Stack>
        )}
      </Col>
      <hr className={styles.horizontalDivider} />
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        longitude={note.longitude}
        latitude={note.latitude}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}
