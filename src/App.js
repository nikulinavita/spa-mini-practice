import ResourceFilter from "./components/FilterPanel";
import ResourceList   from "./components/ResourceList";
import ResourceForm   from "./components/ResourceForm";
import Modal          from "./components/Modal";
import { useState, useEffect, useMemo } from "react";
import Layout from "./components/Layout";
import "./App.css";

/* Парсит "15", "7.5" или "7-15" → { min, max } для фильтрации и сортировки */
function parseTimeRange(timeStr) {
  const str = String(timeStr ?? "").trim();
  if (!str) return { min: 0, max: 0 };
  if (str.includes("-")) {
    const [a, b] = str.split("-");
    return { min: parseFloat(a) || 0, max: parseFloat(b) || 0 };
  }
  const val = parseFloat(str) || 0;
  return { min: val, max: val };
}

const INITIAL_RESOURCES = [
  { id: 1,  title: "Irregular Verbs First Lesson",                              topic: "Irregular Verbs",                        level: ["A1"],        format: "Genially Game",  note: "", isInCollection: false, time: "15",   age: ["Teens"],          url: "https://view.genially.com/67d188ea757100616a0fe016" },
  { id: 2,  title: "Regular Verbs Drilling",                                    topic: "Regular Verbs",                          level: ["A2"],        format: "Genially Game",  note: "", isInCollection: false, time: "10",   age: ["Teens"],          url: "" },
  { id: 3,  title: "Modal Verbs Warm-up",                                       topic: "Modal Verbs",                            level: ["B1"],        format: "Wordwall Game",  note: "", isInCollection: false, time: "10",   age: ["Adults"],         url: "" },
  { id: 4,  title: "Phrasal Verbs Full Lesson",                                 topic: "Phrasal Verbs",                          level: ["B1"],        format: "Miro",           note: "", isInCollection: false, time: "45",   age: ["Adults"],         url: "" },
  { id: 5,  title: "Adverbs of Manner Drilling",                                topic: "Adverbs of Manner",                      level: ["A1"],        format: "Genially Game",  note: "", isInCollection: false, time: "10",   age: ["Kids"],           url: "" },
  { id: 6,  title: "Adverbs of Place Full Lesson for YL",                       topic: "Adverbs of Place",                       level: ["A1", "A2"],  format: "Miro",           note: "", isInCollection: false, time: "30-45",age: ["Kids", "Teens"],  url: "" },
  { id: 7,  title: "Adverbs of Frequency Full Lesson",                          topic: "Adverbs of Frequency",                   level: ["A1"],        format: "Miro",           note: "", isInCollection: false, time: "45",   age: ["Kids"],           url: "" },
  { id: 8,  title: "Comparative and Superlative Adjectives Full Lesson for YL", topic: "Comparative and Superlative Adjectives", level: ["A2"],        format: "Miro",           note: "", isInCollection: false, time: "40-45",age: ["Kids"],           url: "" },
  { id: 9,  title: "Prepositions of Time Warm-Up",                              topic: "Prepositions of Time",                   level: ["A2"],        format: "Worksheet",      note: "", isInCollection: false, time: "10",   age: ["Teens"],          url: "" },
  { id: 10, title: "Prepositions of Place Drilling",                            topic: "Prepositions of Place",                  level: ["A2"],        format: "PDF",            note: "", isInCollection: false, time: "7.5",  age: [],                 url: "" },

  // — Miro boards from Telegram —
  { id: 11, title: "Comparative & Superlative Adjectives (Go Getter 3 Unit 2)", topic: "Comparative and Superlative Adjectives", level: ["A2"],         format: "Miro",           note: "Matching adjective halves, placing adjectives in columns, making sentences, talking about yourself. Go Getter 3 Unit 2.", isInCollection: false, time: "40",    age: ["Kids", "Teens"],          url: "https://miro.com/app/live-embed/uXjVMEEfG40=/?embedMode=view_only_without_ui&moveToViewport=-6154%2C17001%2C2632%2C1302&embedId=608030033708" },
  { id: 12, title: "Don't Drop the Fire! Warm-up",                              topic: "Speaking / Q&A",                         level: ["A1", "A2"],   format: "Miro",           note: "Interactive warm-up based on cartoon Elementy. Students answer questions — wrong answer drops a fire drop! Perfect lesson starter.", isInCollection: false, time: "10",    age: ["Kids", "Teens"],          url: "https://miro.com/app/board/uXjVJziaVeM=/?share_link_id=939096774025" },
  { id: 13, title: "Present Simple Speaking Activity",                          topic: "Present Simple",                         level: ["A1"],          format: "Miro",           note: "Speaking and vocabulary practice. Pictures help students speak and practice grammar. Can be used to review to be / Present Simple / vocabulary.", isInCollection: false, time: "15",    age: ["Kids", "Teens", "Adults"], url: "https://miro.com/app/board/uXjVJQtq54s=/?share_link_id=215144069555" },
  { id: 14, title: "Harry Potter HBO — Discussion Lesson",                      topic: "Discussion / Speaking",                  level: ["A2"],          format: "Miro",           note: "Watching the HBO trailer, sharing impressions, comparing film vs series, discussing new actors and characters.", isInCollection: false, time: "45",    age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVG4gEx04=/?share_link_id=399071561377" },
  { id: 15, title: "Aladdin Style — Past Simple Lesson",                        topic: "Past Simple",                            level: ["A2"],          format: "Miro",           note: "Studying tenses with Disney characters. Listening, vocabulary, watching, grammar, speaking. From My Disney Stars and Heroes textbook.", isInCollection: false, time: "45",    age: ["Kids", "Teens"],          url: "https://miro.com/app/board/uXjVGRTrFi4=/?share_link_id=708039069895" },
  { id: 16, title: "Find Your Animal Twin — Personality Adjectives",            topic: "Personality Adjectives",                 level: ["A2"],          format: "Miro",           note: "12 envelopes, 12 adjectives. Read short texts about animals and figure out adjective meaning through context, then match.", isInCollection: false, time: "30",    age: ["Teens"],                  url: "https://miro.com/app/board/uXjVGh2omTY=/?share_link_id=556814554462" },
  { id: 17, title: "Fortune Telling Warm-up",                                   topic: "Speaking / Future Tenses",               level: ["A2"],          format: "Miro",           note: "Help Cat Bob learn his future — choose a fortune card and make a prediction. Activates vocabulary and grammar.", isInCollection: false, time: "10",    age: ["Kids", "Teens"],          url: "https://miro.com/app/board/uXjVGiWgUPQ=/?share_link_id=841553795617" },
  { id: 18, title: "Compound Nouns & Airplane Vocabulary",                      topic: "Compound Nouns",                         level: ["A2"],          format: "Miro",           note: "Based on Solutions Pre-Intermediate. Compound nouns + airplane vocabulary, interesting text, listening, speaking practice. 60–90 min.", isInCollection: false, time: "60-90", age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVIeMqHTM=/?share_link_id=215900183981" },
  { id: 19, title: "Things I've Never Done — Present Perfect Lesson",           topic: "Present Perfect",                        level: ["A2"],          format: "Miro",           note: "New experiences and comfort zone. Warm-up, speaking, article + activities, Present Perfect revision, big discussion task.", isInCollection: false, time: "60",    age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVICryu9I=/?share_link_id=420717174496" },
  { id: 20, title: "Why Are We Afraid of Silence?",                             topic: "Discussion / Speaking",                  level: ["A2"],          format: "Miro",           note: "Warm-up, lead-in, vocabulary, reading + post-reading tasks, speaking, cool-down. Free board.", isInCollection: false, time: "45",    age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVHeCXBnQ=/?share_link_id=12992342310" },
  { id: 21, title: "Infinitive and Gerund Grammar Lesson",                      topic: "Infinitive and Gerund",                  level: ["A2"],          format: "Miro",           note: "Grammar, speaking, and writing tasks. Suitable for grades 6–8 or adults at A2. Free lesson from a grammar course.", isInCollection: false, time: "45",    age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVIu0UA7I=/?share_link_id=966488212321" },
  { id: 22, title: "Can — Summer Edition Lesson",                               topic: "Modal Verb: Can",                        level: ["A1", "A2"],   format: "Miro",           note: "Complete lesson on modal verb 'can' with a summer design. Also available on Holst.", isInCollection: false, time: "45",    age: ["Kids", "Teens", "Adults"], url: "https://miro.com/app/board/uXjVHVlFvgo=/" },
  { id: 23, title: "Capy Birthday — Degrees of Comparison",                     topic: "Degrees of Comparison",                  level: ["A2"],          format: "Miro",           note: "10 tasks: mood drawing, cake decoration, reading, capybara games, Wordwall mini-games. Birthday-themed. Includes glossary and homework.", isInCollection: false, time: "60",    age: ["Kids", "Teens"],          url: "https://miro.com/app/board/uXjVJOTytUw=/?share_link_id=875378874230" },
  { id: 24, title: "Present Continuous — For the Birds",                        topic: "Present Continuous",                     level: ["A1", "A2"],   format: "Miro",           note: "Free lesson practicing Present Continuous with the Pixar short film 'For the Birds'.", isInCollection: false, time: "30",    age: ["Kids", "Teens"],          url: "https://miro.com/app/board/uXjVGEwkmqc=/?share_link_id=366948240546" },
  { id: 25, title: "Ted Bundy — Hot Villains Series",                           topic: "Discussion / Crime Vocabulary",          level: ["B1", "B2"],   format: "Miro",           note: "Warm-up, vocabulary, YouTube video, post-watching discussion, podcast role-play. For mature adult students only.", isInCollection: false, time: "60-90", age: ["Adults"],                  url: "https://miro.com/app/board/uXjVLgBMdBA=/?share_link_id=475745393186" },
  { id: 26, title: "Clothes Vocabulary Warm-up",                                topic: "Clothes / suit vs match vs fit",         level: ["A2"],          format: "Miro",           note: "Warm-up on clothes and the difference between suit/match/fit/go with. Present Simple & Continuous. Great for pair work.", isInCollection: false, time: "15",    age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVHMX1dGs=/?share_link_id=528501664285" },
  { id: 27, title: "Summer So Far — Present Perfect Lesson",                    topic: "Present Perfect",                        level: ["A2", "B1"],   format: "Miro",           note: "Summer vocabulary, texts, discussion of summer plans. Reviews Present Perfect. Includes a writing assignment.", isInCollection: false, time: "60",    age: ["Adults"],                  url: "https://miro.com/app/board/uXjVLW6cmT4=/?moveToWidget=3458764673801735128&cot=14" },
  { id: 28, title: "Present & Past Tenses Revision",                            topic: "Tenses Revision",                        level: ["A1", "A2"],   format: "Miro",           note: "Review completed material, identify gaps and set goals. A full revision lesson.", isInCollection: false, time: "45",    age: ["Kids", "Teens", "Adults"], url: "https://miro.com/app/board/uXjVGinVfDY=/" },
  { id: 29, title: "Boomers & Zoomers — Generation Gap",                        topic: "Discussion / Reading",                   level: ["A2", "B1"],   format: "Miro",           note: "Generation differences as a debate topic. Reading material with discussion of the generation gap.", isInCollection: false, time: "45",    age: ["Teens", "Adults"],        url: "https://miro.com/app/board/uXjVIuKjYRM=/?moveToWidget=3458764671904552557&cot=14" },
  { id: 30, title: "Summer Activities Vocabulary Warm-up",                      topic: "Summer Vocabulary",                      level: ["A1", "A2"],   format: "Miro",           note: "Rearrange letter shells to spell summer activity words (kayaking to staycation). For all ages 5+.", isInCollection: false, time: "10",    age: ["Kids", "Teens", "Adults"], url: "https://miro.com/app/board/uXjVHKnW_us=/?share_link_id=640696841575" },

  // — Genially games from Telegram —
  { id: 31, title: "Past Simple — Enchanted Objects Game",                      topic: "Past Simple",                            level: ["A2"],          format: "Genially Game",  note: "Search for enchanted objects with a magic wand and complete Past Simple tasks.", isInCollection: false, time: "15",    age: ["Kids", "Teens"],          url: "https://view.genially.com/659e766fd91fdf0014bd674d" },
  { id: 32, title: "Gravity Falls — Comparative Degree Game",                   topic: "Comparative Adjectives",                 level: ["A2"],          format: "Genially Game",  note: "Short interactive activity for practicing comparative degree of adjectives. Gravity Falls theme.", isInCollection: false, time: "10",    age: ["Teens"],                  url: "https://view.genially.com/63bf0d802284c7001a3e470c/interactive-content-gravity-falls-comparative-degree" },
  { id: 33, title: "Future Simple WILL — Labubi Escape Game",                   topic: "Future Simple: will",                    level: ["A2"],          format: "Genially Game",  note: "Help Labubi escape from the store! Choose a toy and escape, but obstacles appear — make sentences in the future tense.", isInCollection: false, time: "15",    age: ["Kids", "Teens"],          url: "https://view.genially.com/6859177e28e3c9b55300f15e" },
  { id: 34, title: "Verb Catcher — Regular & Irregular Verbs",                  topic: "Regular and Irregular Verbs",            level: ["A1", "A2"],   format: "Genially Game",  note: "Catch falling verbs! Level 1: irregular, Level 2: regular. Max 3 errors. Works as warm-up or review for all ages.", isInCollection: false, time: "10",    age: ["Kids", "Teens", "Adults"], url: "https://view.genially.com/696b3853bb318c294a5691cb" },
  { id: 35, title: "Autumn Warm-up — There is / There are",                     topic: "There is / There are",                   level: ["A1", "A2"],   format: "Genially Game",  note: "Spot the differences activity. Also includes reading and conversation tasks for teens. Suitable for age 5+.", isInCollection: false, time: "10",    age: ["Kids", "Teens"],          url: "https://view.genially.com/66d444b21779704991549bae/interactive-content-autumn-warm-up" },

  // — Wordwall games from Telegram —
  { id: 36, title: "Shopping Vocabulary — Cards (Go Getter 3 Unit 2)",          topic: "Shopping Vocabulary",                    level: ["A2"],          format: "Wordwall Game",  note: "Flashcard format. Go Getter 3 Unit 2.", isInCollection: false, time: "5",     age: ["Teens"],                  url: "https://wordwall.net/resource/91666569" },
  { id: 37, title: "Shopping Vocabulary — Flying Fruits (Go Getter 3 Unit 2)", topic: "Shopping Vocabulary",                    level: ["A2"],          format: "Wordwall Game",  note: "Flying fruits game format. Go Getter 3 Unit 2.", isInCollection: false, time: "5",     age: ["Teens"],                  url: "https://wordwall.net/resource/91666727" },
  { id: 38, title: "Shopping Vocabulary — Anagram (Go Getter 3 Unit 2)",       topic: "Shopping Vocabulary",                    level: ["A2"],          format: "Wordwall Game",  note: "Anagram format. Go Getter 3 Unit 2.", isInCollection: false, time: "5",     age: ["Teens"],                  url: "https://wordwall.net/resource/91666746" },
  { id: 39, title: "Shops Vocabulary — Cards (Go Getter 3 Unit 2)",             topic: "Shops Vocabulary",                       level: ["A2"],          format: "Wordwall Game",  note: "Flashcard format — types of shops. Go Getter 3 Unit 2.", isInCollection: false, time: "5",     age: ["Teens"],                  url: "https://wordwall.net/resource/92020256" },
  { id: 40, title: "Shops Vocabulary — Pair Match (Go Getter 3 Unit 2)",        topic: "Shops Vocabulary",                       level: ["A2"],          format: "Wordwall Game",  note: "Pair/no pair matching game — types of shops. Go Getter 3 Unit 2.", isInCollection: false, time: "5",     age: ["Teens"],                  url: "https://wordwall.net/resource/92021229" },

  // — YouTube from Telegram —
  { id: 41, title: "Past Simple Review Video",                                   topic: "Past Simple",                            level: ["A1", "A2"],   format: "YouTube",        note: "Listen to a text excerpt, write down new words, practice gist/detail listening, then retell. 5 comprehension questions.", isInCollection: false, time: "20",    age: ["Teens", "Adults"],        url: "https://www.youtube.com/watch?v=WDg85KdxFHU" },
];

function App() {
  const [resources, setResources] = useState(() => {
    function normalize(r) {
      return {
        note: "", isInCollection: false, time: "", age: [], url: "",
        ...r,
        time: r.time ? String(r.time) : "",
        level: Array.isArray(r.level)
          ? r.level
          : r.level ? String(r.level).split(/[,/]/).map((s) => s.trim()).filter(Boolean) : [],
        age: Array.isArray(r.age)
          ? r.age
          : r.age ? [r.age] : [],
      };
    }
    try {
      const saved = localStorage.getItem("resources-storage");
      if (saved) {
        const parsed = JSON.parse(saved).map(normalize);
        const savedIds = new Set(parsed.map((r) => r.id));
        const newSeeds = INITIAL_RESOURCES.filter((r) => !savedIds.has(r.id));
        return [...parsed, ...newSeeds];
      }
      return INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  useEffect(() => {
    localStorage.setItem("resources-storage", JSON.stringify(resources));
  }, [resources]);

  /* ── Фильтры и поиск ── */
  const [searchQuery,  setSearchQuery]  = useState("");
  const [levelFilter,  setLevelFilter]  = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [timeFilter,   setTimeFilter]   = useState("Any");
  const [ageFilter,    setAgeFilter]    = useState("All");
  const [sortOrder,    setSortOrder]    = useState("default");

  function handleClearFilters() {
    setSearchQuery("");
    setLevelFilter("All");
    setFormatFilter("All");
    setTimeFilter("Any");
    setAgeFilter("All");
    setSortOrder("default");
  }

  /* ── Модальные окна ── */
  const [isAddModalOpen,    setIsAddModalOpen]    = useState(false);
  const [editingResource,   setEditingResource]   = useState(null);
  const [deletingResourceId, setDeletingResourceId] = useState(null);

  /* ── Handlers ── */
  function handleAddResource(data) {
    setResources((prev) => [
      ...prev,
      { isInCollection: false, ...data, id: Date.now() },
    ]);
  }

  function handleEditResource(data) {
    setResources((prev) =>
      prev.map((r) => (r.id === editingResource.id ? { ...r, ...data } : r))
    );
  }

  function handleOpenEdit(id) {
    setEditingResource(resources.find((r) => r.id === id));
  }

  function handleDeleteResource(id) {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setDeletingResourceId(null);
  }

  function handleToggleCollection(id) {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isInCollection: !r.isInCollection } : r))
    );
  }

  function handleClearCollection() {
    setResources((prev) => prev.map((r) => ({ ...r, isInCollection: false })));
  }

  /* ── Фильтрация и сортировка ──
     useMemo кэширует результат: пересчёт происходит только когда меняется
     один из перечисленных в массиве зависимостей ресурс или параметр фильтра. */
  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase();

    const filtered = resources.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q)  ||
        r.topic.toLowerCase().includes(q)  ||
        r.format.toLowerCase().includes(q);

      const rLevels = Array.isArray(r.level) ? r.level : r.level ? [r.level] : [];
      const rAges   = Array.isArray(r.age)   ? r.age   : r.age   ? [r.age]   : [];

      const matchesLevel  = levelFilter  === "All" || rLevels.includes(levelFilter);
      const matchesFormat = formatFilter === "All" || r.format === formatFilter;
      const matchesAge    = ageFilter === "All"
        || rAges.length === 0
        || rAges.includes("All")
        || rAges.includes(ageFilter);

      const { min: tMin, max: tMax } = parseTimeRange(r.time);
      const matchesTime =
        timeFilter === "Any"  ||
        (timeFilter === "0-15"  && tMax > 0  && tMin <= 15) ||
        (timeFilter === "15-30" && tMax > 15 && tMin <= 30) ||
        (timeFilter === "30+"   && tMax > 30);

      return matchesSearch && matchesLevel && matchesFormat && matchesAge && matchesTime;
    });

    const mid = (r) => { const { min, max } = parseTimeRange(r.time); return (min + max) / 2; };
    if (sortOrder === "alpha-asc")  return [...filtered].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    if (sortOrder === "alpha-desc") return [...filtered].sort((a, b) => b.title.localeCompare(a.title, "ru"));
    if (sortOrder === "time-asc")   return [...filtered].sort((a, b) => mid(a) - mid(b));
    if (sortOrder === "time-desc")  return [...filtered].sort((a, b) => mid(b) - mid(a));
    return filtered;
  }, [resources, searchQuery, levelFilter, formatFilter, timeFilter, ageFilter, sortOrder]);

  const collectionResources = resources.filter((r) => r.isInCollection);
  const totalCollectionTime = collectionResources.reduce(
    (sum, r) => sum + parseTimeRange(r.time).max,
    0
  );

  return (
    <Layout
      title="English Learning Resources"
      collectionCount={collectionResources.length}
      collectionResources={collectionResources}
      onToggleCollection={handleToggleCollection}
      onClearCollection={handleClearCollection}
    >
      <ResourceFilter
        searchQuery={searchQuery}     onSearchChange={setSearchQuery}
        activeLevel={levelFilter}     onLevelChange={setLevelFilter}
        activeFormat={formatFilter}   onFormatChange={setFormatFilter}
        timeFilter={timeFilter}       onTimeFilterChange={setTimeFilter}
        ageFilter={ageFilter}         onAgeFilterChange={setAgeFilter}
        onClearAll={handleClearFilters}
        onAddClick={() => setIsAddModalOpen(true)}
        sortOrder={sortOrder}         onSortChange={setSortOrder}
        resultCount={filteredResources.length}
        totalCount={resources.length}
      />


<ResourceList
        resources={filteredResources}
        onDeleteRequest={setDeletingResourceId}
        onToggleCollection={handleToggleCollection}
        onEditResource={handleOpenEdit}
      />

      {/* ── Модальное окно: добавление ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить материал"
      >
        <ResourceForm
          onSubmit={handleAddResource}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* ── Модальное окно: редактирование ── */}
      <Modal
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        title="Edit material"
      >
        {editingResource && (
          <ResourceForm
            initialData={editingResource}
            onSubmit={handleEditResource}
            onClose={() => setEditingResource(null)}
          />
        )}
      </Modal>

      {/* ── Модальное окно: подтверждение удаления ── */}
      {(() => {
        const target = resources.find((r) => r.id === deletingResourceId);
        return (
          <Modal
            isOpen={!!deletingResourceId}
            onClose={() => setDeletingResourceId(null)}
            title="Delete material?"
          >
            {target && (
              <div className="confirm-delete">
                <p className="confirm-delete__text">Are you sure you want to delete</p>
                <p className="confirm-delete__name">«{target.title}»</p>
                <p className="confirm-delete__warning">This action cannot be undone.</p>
                <div className="form__footer">
                  <button className="btn-secondary" onClick={() => setDeletingResourceId(null)}>
                    Cancel
                  </button>
                  <button className="btn-danger" onClick={() => handleDeleteResource(deletingResourceId)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Modal>
        );
      })()}
    </Layout>
  );
}

export default App;
