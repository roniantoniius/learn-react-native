import { Col, Row, Form, Stack, Button } from "react-bootstrap";
import CreatableReactSelect from "react-select/creatable";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import '../styles/Note.css';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
  longitude = 0,
  latitude = 0,
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
      longitude: parseFloat(longitudeRef.current!.value),
      latitude: parseFloat(latitudeRef.current!.value),
    });

    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label className="custom-small">Judul</Form.Label>
              <Form.Control className="text" ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label className="custom-small">Kategori</Form.Label>
              <CreatableReactSelect className="text"
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
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
        <Col>
          <Form.Group controlId="markdown" className="mb-3">
            <Form.Label className="text custom-small">Badan Catatan</Form.Label>
            <Form.Control className="text"
              defaultValue={markdown}
              required
              as="textarea"
              ref={markdownRef}
              rows={15}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end mt-3">
            <Button type="submit" variant="primary custom-button">
              Simpan
            </Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary text">
                Batal
              </Button>
            </Link>
          </Stack>
        </Col>
        <Row>
          <Col>
            <Form.Group controlId="latitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                ref={latitudeRef}
                defaultValue={latitude}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="longitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                ref={longitudeRef}
                defaultValue={longitude}
              />
            </Form.Group>
          </Col>
        </Row>
      </Stack>
    </Form>
  );
}
