import { Stack, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tag } from "../App";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';


export type SimplifiedNote = {
    tags: Tag[];
    title: string;
    id: string;
    longitude: number;
    latitude: number;
};

export function NoteCard({ id, title, tags, longitude, latitude }: SimplifiedNote) {
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