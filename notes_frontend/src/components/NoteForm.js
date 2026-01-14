import React, { useEffect, useMemo, useState } from "react";
import styles from "./NoteForm.module.css";

/**
 * NoteForm is used for both adding and editing notes.
 * Validation rules:
 * - title required
 * - body required
 */

// PUBLIC_INTERFACE
export default function NoteForm({ mode, note, onCreate, onUpdate, onCancel }) {
  const isEdit = mode === "edit";

  const initial = useMemo(() => {
    if (!isEdit || !note) return { title: "", body: "" };
    return { title: note.title || "", body: note.body || "" };
  }, [isEdit, note]);

  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [touched, setTouched] = useState({ title: false, body: false });

  useEffect(() => {
    // When switching selected note / mode, re-hydrate inputs.
    setTitle(initial.title);
    setBody(initial.body);
    setTouched({ title: false, body: false });
  }, [initial]);

  const titleError = touched.title && !title.trim() ? "Title is required." : "";
  const bodyError = touched.body && !body.trim() ? "Body is required." : "";
  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, body: true });

    if (!canSubmit) return;

    if (isEdit) onUpdate({ title, body });
    else onCreate({ title, body });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label={isEdit ? "Edit note form" : "Add note form"}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="note-title">
          Title
        </label>
        <input
          id="note-title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          placeholder="e.g., Grocery list"
          required
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? "note-title-error" : undefined}
        />
        {titleError ? (
          <div id="note-title-error" className={styles.error} role="alert">
            {titleError}
          </div>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="note-body">
          Body
        </label>
        <textarea
          id="note-body"
          className={styles.textarea}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, body: true }))}
          placeholder="Write your note here..."
          required
          rows={7}
          aria-invalid={Boolean(bodyError)}
          aria-describedby={bodyError ? "note-body-error" : undefined}
        />
        {bodyError ? (
          <div id="note-body-error" className={styles.error} role="alert">
            {bodyError}
          </div>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button type="submit" className="Button ButtonPrimary" disabled={!canSubmit} aria-disabled={!canSubmit}>
          {isEdit ? "Save changes" : "Add note"}
        </button>

        {isEdit ? (
          <button type="button" className="Button ButtonSecondary" onClick={onCancel}>
            Cancel
          </button>
        ) : (
          <button
            type="button"
            className="Button ButtonSecondary"
            onClick={() => {
              setTitle("");
              setBody("");
              setTouched({ title: false, body: false });
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
