import React, { useMemo, useState } from "react";
import "./App.css";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import useLocalStorage from "./hooks/useLocalStorage";

/**
 * Generate a reasonably-unique id for notes without adding dependencies.
 * Uses crypto.randomUUID when available, otherwise falls back to time+random.
 */
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
function App() {
  /** Notes persisted in localStorage (single source of truth for note data). */
  const [notes, setNotes] = useLocalStorage("notes.app.notes", []);

  /** Current note selected for editing; null means "adding a new note". */
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  /** Search query for filtering by title. */
  const [query, setQuery] = useState("");

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title || "").toLowerCase().includes(q));
  }, [notes, query]);

  // PUBLIC_INTERFACE
  function handleCreateNote({ title, body }) {
    const now = Date.now();
    const newNote = {
      id: generateId(),
      title: title.trim(),
      body: body.trim(),
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  }

  // PUBLIC_INTERFACE
  function handleUpdateNote({ title, body }) {
    if (!selectedNoteId) return;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== selectedNoteId) return n;
        return {
          ...n,
          title: title.trim(),
          body: body.trim(),
          updatedAt: Date.now(),
        };
      })
    );
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setSelectedNoteId(null);
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(noteId) {
    setSelectedNoteId(noteId);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(noteId) {
    const note = notes.find((n) => n.id === noteId);
    const title = note?.title ? `"${note.title}"` : "this note";
    const ok = window.confirm(`Delete ${title}? This cannot be undone.`);
    if (!ok) return;

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedNoteId === noteId) setSelectedNoteId(null);
  }

  const isEditing = Boolean(selectedNoteId && selectedNote);

  return (
    <div className="App">
      <header className="AppHeader">
        <div>
          <h1 className="AppTitle">Notes</h1>
          <p className="AppSubtitle">Create, edit, search, and keep notes locally in your browser.</p>
        </div>

        <div className="HeaderActions" role="search" aria-label="Search notes">
          <label className="srOnly" htmlFor="search">
            Search notes by title
          </label>
          <input
            id="search"
            className="Input"
            type="search"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="Button ButtonSecondary"
            onClick={() => {
              setSelectedNoteId(null);
            }}
            disabled={!isEditing}
            aria-disabled={!isEditing}
            title={isEditing ? "Switch to add mode" : "Already in add mode"}
          >
            New note
          </button>
        </div>
      </header>

      <main className="Main">
        <section className="Card" aria-label={isEditing ? "Edit note" : "Add a new note"}>
          <div className="CardHeader">
            <h2 className="CardTitle">{isEditing ? "Edit note" : "Add a note"}</h2>
            {isEditing ? (
              <span className="Badge" aria-label="Editing mode">
                Editing
              </span>
            ) : (
              <span className="Badge BadgeInfo" aria-label="Add mode">
                Add
              </span>
            )}
          </div>

          <NoteForm
            mode={isEditing ? "edit" : "add"}
            note={selectedNote}
            onCreate={handleCreateNote}
            onUpdate={handleUpdateNote}
            onCancel={handleCancelEdit}
          />
        </section>

        <section className="Card" aria-label="Notes list">
          <div className="CardHeader">
            <h2 className="CardTitle">Your notes</h2>
            <div className="Meta">
              <span className="MetaItem" aria-label="Total notes">
                Total: <strong>{notes.length}</strong>
              </span>
              <span className="MetaItem" aria-label="Shown notes">
                Shown: <strong>{filteredNotes.length}</strong>
              </span>
            </div>
          </div>

          <NotesList
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelect={handleSelectNote}
            onDelete={handleDeleteNote}
            emptyState={
              query.trim()
                ? "No notes match your search."
                : "No notes yet. Add your first note using the form."
            }
          />
        </section>
      </main>

      <footer className="Footer">
        <span>Saved locally via localStorage. No backend required.</span>
      </footer>
    </div>
  );
}

export default App;
