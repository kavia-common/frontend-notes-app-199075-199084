import React from "react";
import styles from "./NoteItem.module.css";

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export default function NoteItem({ note, isSelected, onSelect, onDelete }) {
  return (
    <li className={styles.item}>
      <button
        type="button"
        className={`${styles.selectButton} ${isSelected ? styles.selected : ""}`}
        onClick={onSelect}
        aria-pressed={isSelected}
      >
        <div className={styles.titleRow}>
          <span className={styles.title}>{note.title}</span>
          {note.updatedAt ? <span className={styles.date}>{formatDate(note.updatedAt)}</span> : null}
        </div>
        <div className={styles.preview}>{note.body}</div>
      </button>

      <div className={styles.actions} aria-label={`Actions for note ${note.title}`}>
        <button type="button" className="IconButton" onClick={onSelect} aria-label={`Edit note ${note.title}`}>
          Edit
        </button>
        <button
          type="button"
          className="IconButton IconButtonDanger"
          onClick={onDelete}
          aria-label={`Delete note ${note.title}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
