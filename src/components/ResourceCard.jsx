const FORMAT_DOMAINS = {
  "Miro":          "miro.com",
  "Genially Game": "genially.com",
  "Wordwall Game": "wordwall.net",
  "YouTube":       "youtube.com",
};

const FORMAT_EMOJI = {
  "Worksheet": "📝",
  "PDF":       "📄",
};

function ResourceCard({ resource, onDeleteRequest, onToggleCollection, onEditResource, onDeleteResource }) {
  const { id, title, topic, level, format, time, age, url, note, isInCollection } = resource;

  const ages   = Array.isArray(age)   ? age   : age   ? [age]   : [];
  const levels = Array.isArray(level) ? level : level ? [level] : [];
  const firstLevelKey = levels[0] ? levels[0].toLowerCase().replace(/[^a-z0-9]/g, "") : "";

  const platformDomain = FORMAT_DOMAINS[format];
  const platformEmoji  = FORMAT_EMOJI[format];

  function handleDelete() {
    if (onDeleteRequest)  onDeleteRequest(id);
    else if (onDeleteResource) onDeleteResource(id);
  }

  return (
    <div className={`resource-card${firstLevelKey ? ` card--${firstLevelKey}` : ""}${isInCollection ? " in-collection" : ""}`}>

      {platformDomain && (
        <img
          src={`https://www.google.com/s2/favicons?domain=${platformDomain}&sz=64`}
          alt={format}
          title={format}
          className="card__platform-icon"
        />
      )}
      {!platformDomain && platformEmoji && (
        <span className="card__platform-icon card__platform-icon--emoji">{platformEmoji}</span>
      )}

      <h3 className="card__title">{title}</h3>
      <div className="card__meta">
        {topic  && <span className="card__tag card__tag--topic">{topic}</span>}
        {levels.map((l) => (
          <span key={l} className={`card__tag card__tag--level card__tag--level-${l.toLowerCase().replace(/[^a-z0-9]/g, "")}`}>{l}</span>
        ))}
        {format && <span className="card__tag card__tag--format">{format}</span>}
        {time   && <span className="card__tag card__tag--time">{time} min</span>}
        {ages.map((a) => (
          <span key={a} className={`card__tag card__tag--age-${a.toLowerCase()}`}>{a}</span>
        ))}
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="card__link">
          Open resource ↗
        </a>
      )}
      {note && (
        <div className="card__note">
          <span className="card__note-label">Note</span>
          <p className="card__note-text">{note}</p>
        </div>
      )}
      <div className="card__actions">
        <button
          className={`card__btn-collection${isInCollection ? " card__btn-collection--active" : ""}`}
          onClick={() => onToggleCollection(id)}
        >
          {isInCollection ? "✓ In lesson" : "+ Add to lesson"}
        </button>
        <button className="card__btn-edit" onClick={() => onEditResource(id)} title="Edit">
          ✏️
        </button>
        {(onDeleteRequest || onDeleteResource) && (
          <button className="card__btn-delete" onClick={handleDelete} title="Delete">
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

export default ResourceCard;
