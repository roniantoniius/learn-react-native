import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import CreatableReactSelect from 'react-select/creatable';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useRef } from "react";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid"

type Tag = {
    id: string;
    label: string;
};

type NoteData = {
    title: string;
    body: string; // Ganti markdown dengan body
    tags: Tag[];
};


type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
    
        onSubmit({
            title: titleRef.current!.value,
            body: markdownRef.current!.value,
            tags: selectedTags,
        })
    
        navigate("..")
    }
    return (<Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Judul</Form.Label>
                        <Form.Control ref={titleRef} required />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Kategori</Form.Label>
                        <CreatableReactSelect 
                        onCreateOption={label => {
                            const newTag = {id: uuidV4(), label }
                            onAddTag(newTag)
                            setSelectedTags(prev => [...prev, newTag])
                        }} value={selectedTags.map(tag => {
                            return { label: tag.label, value: tag.id}
                        })}
                        options={availableTags.map(tag => {
                            return { label: tag.label, value: tag.id}
                        })}
                        onChange={tags => {
                            setSelectedTags(tags.map(tag => {
                                return {label: tag.label, id: tag.value}
                            }))
                        }} isMulti />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markdown">
                <Form.Label>Catatan</Form.Label>
                <Form.Control required as="textarea" ref={markdownRef} rows={15} />
            </Form.Group>
            <Stack direction="horizontal" gap={2} className="justify-content-end">
                <Button type="submit" variant="primary">Simpan</Button>

                {/* button ke home */}
                <Link to="..">
                    <Button type="button" variant="outline-secondary">Batal</Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
    )
}