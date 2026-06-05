import { useState } from "react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const FORMATS = ["Genially Game", "Wordwall Game", "Miro", "Worksheet", "PDF", "YouTube"];
const AGES    = ["All", "Kids", "Teens", "Adults"];

function ResourceForm({ initialData, onSubmit, onClose }) {
  const [title,  setTitle]  = useState(initialData?.title  ?? "");
  const [topic,  setTopic]  = useState(initialData?.topic  ?? "");
  const [level,  setLevel]  = useState(
    Array.isArray(initialData?.level)
      ? initialData.level
      : initialData?.level ? [initialData.level] : []
  );
  const [format, setFormat] = useState(initialData?.format ?? "");
  const [time,   setTime]   = useState(initialData?.time   ?? "");
  const [age,    setAge]    = useState(
    Array.isArray(initialData?.age)
      ? initialData.age
      : initialData?.age ? [initialData.age] : []
  );
  const [url,    setUrl]    = useState(initialData?.url    ?? "");
  const [note,   setNote]   = useState(initialData?.note   ?? "");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, topic, level, format, time, age, url, note });
    onClose();
  }

  const isValid = title.trim() && topic.trim();

  function toggleLevel(l) {
    setLevel((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }

  function toggleAge(a) {
    setAge((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  // если в данных был нестандартный уровень — показываем его тоже
  const extraLevels = level.filter((l) => !LEVELS.includes(l));
  const allLevels = [...LEVELS, ...extraLevels];

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          className="form-input"
          placeholder="Title *"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="form-input"
          placeholder="Topic *"
          maxLength={60}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <select
          className="form-select"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">— Format —</option>
          {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          className="form-input form-input--time"
          placeholder="e.g. 15 or 10-20"
          value={time}
          maxLength={7}
          onChange={(e) => setTime(e.target.value.replace(/[^0-9.\-]/g, ""))}
        />
      </div>

      <div className="form-field-group">
        <span className="form-field-label">Level</span>
        <div className="form-pill-row">
          {allLevels.map((l) => (
            <button
              key={l}
              type="button"
              className={`form-pill${level.includes(l) ? " form-pill--active" : ""}`}
              onClick={() => toggleLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field-group">
        <span className="form-field-label">Age group</span>
        <div className="form-pill-row">
          {AGES.map((a) => (
            <button
              key={a}
              type="button"
              className={`form-pill form-pill--age${age.includes(a) ? " form-pill--active" : ""}`}
              onClick={() => toggleAge(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <input
        className="form-input form-input--url"
        placeholder="URL (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="form-note-section">
        <span className="form-note-label">Note</span>
        <textarea
          className="form-input form-textarea"
          placeholder="Optional note…"
          maxLength={400}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {note.length > 300 && (
          <span className="form-note-counter">{note.length}/400</span>
        )}
      </div>

      <div className="form__footer">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="form-submit-btn" disabled={!isValid}>
          {initialData ? "Save changes" : "Add resource"}
        </button>
      </div>
    </form>
  );
}

export default ResourceForm;
