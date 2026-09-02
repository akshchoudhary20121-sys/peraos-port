import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, FileText, Search } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = "peraos-notes";

function loadNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore parse errors, use defaults */ }
  return [
    {
      id: "welcome",
      title: "Welcome to PeraOS",
      content:
        "This is the Notes app! You can create, edit, and delete notes.\n\nYour notes are saved automatically to local storage.",
      updatedAt: Date.now(),
    },
    {
      id: "getting-started",
      title: "Getting Started",
      content:
        "• Double-click desktop icons to open apps\n• Drag windows by their title bar\n• Use the start menu (click PeraOS logo) to launch apps\n• Each window can be minimized, maximized, and closed",
      updatedAt: Date.now() - 1000,
    },
  ];
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [selectedId, setSelectedId] = useState<string | null>(
    notes[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");

  // Persist notes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
  }, []);

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedId === id) {
        setSelectedId(notes.find((n) => n.id !== id)?.id ?? null);
      }
    },
    [selectedId, notes],
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "content">>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n,
        ),
      );
    },
    [],
  );

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-[220px] border-r border-[#e8eaed] flex flex-col shrink-0">
        <div className="p-2 border-b border-[#e8eaed]">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#f1f3f4]">
            <Search className="w-3.5 h-3.5 text-[#5f6368]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-[#202124] placeholder-[#9aa0a6] outline-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[12px] font-medium text-[#5f6368]">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={createNote}
            className="p-1 rounded-md hover:bg-[#f1f3f4] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`w-full text-left px-3 py-2.5 flex items-start gap-2 transition-colors ${
                selectedId === note.id
                  ? "bg-[#E8F0FE]"
                  : "hover:bg-[#f8f9fa]"
              }`}
            >
              <FileText className="w-4 h-4 text-[#5f6368] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#202124] truncate font-medium">
                  {note.title}
                </div>
                <div className="text-[11px] text-[#5f6368] truncate mt-0.5">
                  {note.content.slice(0, 60) || "Empty note"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedNote ? (
          <>
            <div className="px-4 pt-3 flex items-center gap-2">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) =>
                  updateNote(selectedNote.id, { title: e.target.value })
                }
                className="flex-1 text-[18px] font-medium text-[#202124] bg-transparent outline-none placeholder-[#9aa0a6]"
                placeholder="Note title..."
              />
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-[#5f6368] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={selectedNote.content}
              onChange={(e) =>
                updateNote(selectedNote.id, { content: e.target.value })
              }
              className="flex-1 p-4 text-[14px] text-[#202124] bg-transparent outline-none resize-none leading-relaxed placeholder-[#9aa0a6]"
              placeholder="Start writing..."
            />
            <div className="px-4 py-2 text-[11px] text-[#9aa0a6] border-t border-[#e8eaed]">
              Last edited:{" "}
              {new Date(selectedNote.updatedAt).toLocaleString()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#9aa0a6] text-[13px]">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
}
