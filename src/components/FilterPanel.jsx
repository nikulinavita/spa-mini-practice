import { useState, useRef, useEffect } from "react";

const LEVELS  = ["A1", "A2", "B1", "B2", "C1"];
const FORMATS = ["Genially Game", "Wordwall Game", "Miro", "Worksheet", "PDF", "YouTube"];
const TIMES   = ["Any", "0-15", "15-30", "30+"];
const AGES    = ["All", "Kids", "Teens", "Adults"];

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "alpha-asc",  label: "A → Z" },
  { value: "alpha-desc", label: "Z → A" },
  { value: "time-asc",   label: "Time ↑" },
  { value: "time-desc",  label: "Time ↓" },
];

function FilterPanel({
  searchQuery, onSearchChange,
  activeLevel, onLevelChange,
  activeFormat, onFormatChange,
  timeFilter, onTimeFilterChange,
  ageFilter, onAgeFilterChange,
  onClearAll, onAddClick,
  sortOrder, onSortChange,
  resultCount, totalCount,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeCount = [
    activeLevel  !== "All",
    activeFormat !== "All",
    timeFilter   !== "Any",
    ageFilter    !== "All",
  ].filter(Boolean).length;

  const chips = [
    activeLevel  !== "All" && { label: `Level: ${activeLevel}`,   clear: () => onLevelChange("All") },
    activeFormat !== "All" && { label: `Format: ${activeFormat}`, clear: () => onFormatChange("All") },
    timeFilter   !== "Any" && { label: `Time: ${timeFilter} min`, clear: () => onTimeFilterChange("Any") },
    ageFilter    !== "All" && { label: `Age: ${ageFilter}`,       clear: () => onAgeFilterChange("All") },
  ].filter(Boolean);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "Sort";

  return (
    <div className="filter-panel">
      <div className="filter-search-row">
        <div className="filter-search-wrapper">
          <span className="filter-search-icon">🔍</span>
          <input
            type="search"
            className="filter-search-input"
            placeholder="Search by title, topic, format…"
            maxLength={100}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="filter-search-clear" onClick={() => onSearchChange("")}>✕</button>
          )}
        </div>
        <button
          className={`btn-filters-toggle${filtersOpen ? " btn-filters-toggle--open" : ""}${activeCount > 0 ? " btn-filters-toggle--active" : ""}`}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          Filters
          {activeCount > 0 && <span className="filters-badge">{activeCount}</span>}
          <span className="filters-arrow">▾</span>
        </button>
        <div className="sort-wrapper" ref={sortRef}>
          <button
            className={`btn-filters-toggle${sortOpen ? " btn-filters-toggle--open" : ""}${sortOrder !== "default" ? " btn-filters-toggle--active" : ""}`}
            onClick={() => setSortOpen((v) => !v)}
          >
            {sortLabel} <span className="filters-arrow">▾</span>
          </button>
          {sortOpen && (
            <div className="sort-dropdown">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`sort-option${sortOrder === o.value ? " sort-option--active" : ""}`}
                  onClick={() => { onSortChange(o.value); setSortOpen(false); }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="btn-add" onClick={onAddClick}>+ Add</button>
      </div>

      <div className={`filter-dropdown${filtersOpen ? " filter-dropdown--open" : ""}`}>
        <div className="filter-dropdown__inner">
          <div className="filter-panel__row">
            <span className="filter-panel__label">Level</span>
            <button className={activeLevel === "All" ? "active" : ""} onClick={() => onLevelChange("All")}>All</button>
            {LEVELS.map((l) => (
              <button key={l} className={activeLevel === l ? "active" : ""} onClick={() => onLevelChange(l)}>{l}</button>
            ))}
          </div>
          <div className="filter-panel__row">
            <span className="filter-panel__label">Format</span>
            <button className={activeFormat === "All" ? "active" : ""} onClick={() => onFormatChange("All")}>All</button>
            {FORMATS.map((f) => (
              <button key={f} className={activeFormat === f ? "active" : ""} onClick={() => onFormatChange(f)}>{f}</button>
            ))}
          </div>
          <div className="filter-panel__row">
            <span className="filter-panel__label">Time</span>
            {TIMES.map((t) => (
              <button key={t} className={timeFilter === t ? "active" : ""} onClick={() => onTimeFilterChange(t)}>
                {t === "Any" ? "Any" : `${t} min`}
              </button>
            ))}
          </div>
          <div className="filter-panel__row">
            <span className="filter-panel__label">Age</span>
            {AGES.map((a) => (
              <button key={a} className={ageFilter === a ? "active" : ""} onClick={() => onAgeFilterChange(a)}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="filter-footer">
          <div className="filter-chips">
            {chips.map((chip) => (
              <span key={chip.label} className="filter-chip">
                {chip.label}
                <button onClick={chip.clear}>✕</button>
              </span>
            ))}
            <button className="filter-chip-clear" onClick={onClearAll}>Clear all</button>
          </div>
          <span className="filter-results-count">
            <strong>{resultCount}</strong> of {totalCount}
          </span>
        </div>
      ) : (
        <div className="filter-count-plain">
          <strong>{totalCount}</strong> materials in library
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
