import React from "react";
import NoteItem from "./NoteItem";
import styles from "./NotesList.module.css";

// PUBLIC_INTERFACE
export default function NotesList({ notes, selectedNoteId, onSelect, onDelete, emptyState }) {
  if (!notes || notes.length === 0) {
    return (
      <div className={styles.empty} role="status" aria-live="polite">
        <div className={styles.emptyTitle}>Nothing here</div>
        <div className={styles.emptyBody}>{emptyState}</div>
      </div>
    );
  }

  return (
    <ul className={styles.list} aria-label="Notes">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={() => onSelect(note.id)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </ul>
  );
}
