import { useState } from "react";

function Layout({ title, collectionCount, collectionResources, onToggleCollection, onClearCollection, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const totalTime = collectionResources.reduce((sum, r) => {
    const str = String(r.time ?? "").trim();
    if (!str) return sum;
    if (str.includes("-")) {
      const [, b] = str.split("-");
      return sum + (parseFloat(b) || 0);
    }
    return sum + (parseFloat(str) || 0);
  }, 0);

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-left">
          <h1 className="layout__title">{title}</h1>
          <p className="layout__subtitle">Resource Library</p>
        </div>
        <button
          className={`btn-collection-preview${collectionCount > 0 ? " btn-collection-preview--filled" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          📋 Lesson plan
          {collectionCount > 0 && (
            <span className="collection-badge">{collectionCount}</span>
          )}
        </button>
      </header>

      <main className="layout__main">{children}</main>

      {isOpen && (
        <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className={`drawer${isOpen ? " drawer--open" : ""}`}>
        <div className="drawer__header">
          <h2 className="drawer__title">Lesson materials</h2>
          <button className="drawer__close" onClick={() => setIsOpen(false)} title="Close">✕</button>
        </div>

        <div className="drawer__body">
          {collectionResources.length === 0 ? (
            <div className="drawer__empty">
              <span className="drawer__empty-icon">📋</span>
              <p className="drawer__empty-text">No materials yet</p>
              <p className="drawer__empty-hint">Click «+ Add to lesson» on any card</p>
            </div>
          ) : (
            collectionResources.map((r) => {
              const levels = Array.isArray(r.level) ? r.level : r.level ? [r.level] : [];
              const firstLevel = levels[0] ? levels[0].toLowerCase().replace(/[^a-z0-9]/g, "") : "";
              return (
                <div key={r.id} className={`drawer__item${firstLevel ? ` drawer__item--${firstLevel}` : ""}`}>
                  <div className="drawer__item-info">
                    <span className="drawer__item-title">{r.title}</span>
                    <div className="drawer__item-tags">
                      {levels.map((l) => (
                        <span key={l} className={`drawer__tag drawer__tag--level drawer__tag--level-${l.toLowerCase().replace(/[^a-z0-9]/g, "")}`}>{l}</span>
                      ))}
                      {r.format && <span className="drawer__tag drawer__tag--format">{r.format}</span>}
                    </div>
                  </div>
                  {r.time && <span className="drawer__item-time">{r.time} min</span>}
                  <button
                    className="drawer__item-remove"
                    onClick={() => onToggleCollection(r.id)}
                    title="Remove from lesson"
                  >✕</button>
                </div>
              );
            })
          )}
        </div>

        {collectionResources.length > 0 && (
          <div className="drawer__footer">
            {totalTime > 0 && (
              <span className="drawer__total">Total: <strong>{totalTime} min</strong></span>
            )}
            <button className="btn-clear-collection" onClick={onClearCollection}>
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
