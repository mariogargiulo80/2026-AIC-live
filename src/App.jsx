import React, { useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { BarChart3, Users, MapPin, Save, Trophy, RefreshCcw } from "lucide-react";
import "./App.css";
import logo from "./assets/AIC.jpg";
const APP_VERSION = "v1.0.3";
const firebaseConfig = {
  apiKey: "AIzaSyDnlv6pfjMcqBo55NhWiBevenyf5bNN018",
  authDomain: "spoglio-massa.firebaseapp.com",
  databaseURL: "https://spoglio-massa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spoglio-massa",
  storageBucket: "spoglio-massa.firebasestorage.app",
  messagingSenderId: "969567374845",
  appId: "1:969567374845:web:17a2c477399ab69698dd94"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const liveRef = ref(db, "spoglioLiveMassa2026");

const lists = [
  { id: "azione", name: "Azione in Comune", mayor: "Michele Pollio", color: "#f97316" },
  { id: "insieme", name: "Insieme per Massa Lubrense", mayor: "Liberato Staiano detto Lello", color: "#2563eb" },
];

const sections = [
  { id: 1, zona: "Massa", details: "Vescovado - Partenope - Puolo - Roma - Vigliano - Filangieri - San Montano", ref: "Mandato - Mario" },
  { id: 2, zona: "Massa", details: "Lobra - Cristoforo Colombo - IV Novembre - San Liberatore - Sirignano", ref: "Fusillo" },
  { id: 3, zona: "Annunziata Marciano", details: "Annunziata - Baccoli - Caselle - Nastro d'Oro - Parate - Pietrapiana - San Liberat - Marciano - S. Maria a Schiazzano", ref: "Carla" },
  { id: 4, zona: "Massa-Turro", details: "San Francesco - Bagnulo - Arolella - Gesina a San Francesco - Mortella - Montecorbo", ref: "Mimmo" },
  { id: 5, zona: "S. Agata Centro", details: "Corso S. Agata - Deserto - Casola - Pagliaio di Sandalo - Ghezzi", ref: "Ivan" },
  { id: 6, zona: "Torca", details: "Gesine a Torca - Botteghe di Sopra e Sotto - Del Galli - Gargiulo - Monticello - Nula - Schioppa - Terranova - Torricella", ref: "Carmen + Carmen" },
  { id: 7, zona: "Acquara-Pastena", details: "Rotabile Turro Pastena - Cigliari - San Vito - Castagneto - Pastena - Colli di Acquara - Pignatelli - Regina Margherita - Reola a Pastena - San Nicola - San Vito - Torre al Deserto - Torre - Triliulo", ref: "Vanna - Nando" },
  { id: 8, zona: "Monticchio", details: "Turro Pastena - Titigliano - Gradoni - Caprile - S. Maria della Neve - Bozzaoptra - Calella - Severio Caputo", ref: "Pietro - Angela" },
  { id: 9, zona: "Termini", details: "Termini - Via delle Tore - Campanelle - Via del Monte - Cap d'Arco - Monte Arso - Petriere", ref: "Umberto" },
  { id: 10, zona: "Nerano", details: "Argentina - Delle Sirene - Capod'Arco Nerano - Amerigo Vespucci - Grottone - Nerano - Cantone", ref: "Maurizio" },
  { id: 11, zona: "Monticchio Ovest", details: "Casa - Tuoro - Torvillo - Colarusso - La Cava - Spina", ref: "Pietro - Angela" },
  { id: 12, zona: "S. Agata Est", details: "Pigna - Ceraseto - Crapolla - Croce - Fontana di Forma - Forma - Padara - Reola S. Agata S. Maria la Neve - Torricella", ref: "Fabio - Michele" },
  { id: 13, zona: "S. Agata Ovest", details: "Canale - Casapastena - Dei Campi - Nastro Verde - Nastro Azzurro - Termine - Pontone", ref: "Luigi - Antonina" },
];

const candidates = [
  { id: "bove", name: "Bove Pasquale", list: "insieme" },
  { id: "buoninconti", name: "Buoninconti Massimo", list: "insieme" },
  { id: "cangiano", name: "Cangiano Salvatore", list: "insieme" },
  { id: "caputo", name: "Caputo Anna Maria", list: "insieme" },
  { id: "corcione", name: "Corcione Francesco Saverio", list: "insieme" },
  { id: "degregorio", name: "De Gregorio Vittorio", list: "insieme" },
  { id: "espositof", name: "Esposito Francesco", list: "insieme" },
  { id: "espositog", name: "Esposito Giovanni", list: "insieme" },
  { id: "fiorentino", name: "Fiorentino Luca", list: "insieme" },
  { id: "gargiulomf", name: "Gargiulo Maria Francesca detta Checca", list: "insieme" },
  { id: "gargiulos", name: "Gargiulo Salvatore detto Chichiullo", list: "insieme" },
  { id: "iaccarino", name: "Iaccarino Dorina detta Dora", list: "insieme" },
  { id: "manna", name: "Manna Giuseppe", list: "insieme" },
  { id: "mazzella", name: "Mazzella Carolina", list: "insieme" },
  { id: "minieri", name: "Minieri Gelsomina detta Mina", list: "insieme" },
  { id: "scolari", name: "Scolari Francesca Maria", list: "insieme" },
  { id: "fusillo", name: "Fusillo Alfonso", list: "azione" },
  { id: "siviero", name: "Siviero Angela", list: "azione" },
  { id: "espositoc", name: "Esposito Carla", list: "azione" },
  { id: "terminiello", name: "Terminiello Carmela", list: "azione" },
  { id: "espositoa", name: "Esposito Antonina", list: "azione" },
  { id: "celentano", name: "Celentano Carmen", list: "azione" },
  { id: "petagna", name: "Petagna Fabio", list: "azione" },
  { id: "casa", name: "Casa Ferdinando", list: "azione" },
  { id: "staianog", name: "Staiano Giovanna", list: "azione" },
  { id: "apreda", name: "Apreda Giuseppe", list: "azione" },
  { id: "smith", name: "Smith Ivan", list: "azione" },
  { id: "espositolf", name: "Esposito Luigi Federico", list: "azione" },
  { id: "mandato", name: "Mandato Francesco", list: "azione" },
  { id: "mellino", name: "Mellino Maurizio", list: "azione" },
  { id: "diprisco", name: "Di Prisco Pietro", list: "azione" },
  { id: "albano", name: "Albano Umberto", list: "azione" },
];

const emptyData = () => ({
  updatedAt: null,
  updatedBy: "",
  listVotes: Object.fromEntries(sections.flatMap(s => lists.map(l => [`${s.id}_${l.id}`, ""]))),
  prefVotes: Object.fromEntries(sections.flatMap(s => candidates.map(c => [`${s.id}_${c.id}`, ""]))),
});

function toNum(v) {
  return Number(v || 0) || 0;
}

function pct(part, total) {
  return total > 0 ? ((part / total) * 100).toFixed(1) : "0.0";
}

export default function App() {
  const [tab, setTab] = useState("live");
  const [unlocked, setUnlocked] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [candidateFilter, setCandidateFilter] = useState("all");
  const [operator, setOperator] = useState(localStorage.getItem("operatorName") || "");
  const [data, setDataState] = useState(emptyData());
  const [status, setStatus] = useState("Connessione...");

  useEffect(() => {
    const unsub = onValue(
      liveRef,
      snap => {
        setDataState(snap.val() || emptyData());
        setStatus("Live");
      },
      () => setStatus("Errore database")
    );

    return () => unsub();
  }, []);

  const saveData = (next) => {
    const payload = {
      ...next,
      updatedAt: new Date().toLocaleString("it-IT"),
      updatedBy: operator || "Operatore"
    };

    set(liveRef, payload);
  };

  const setListVote = (sectionId, listId, value) => {
    saveData({
      ...data,
      listVotes: {
        ...data.listVotes,
        [`${sectionId}_${listId}`]: value
      }
    });
  };

  const setPrefVote = (sectionId, candId, value) => {
    saveData({
      ...data,
      prefVotes: {
        ...data.prefVotes,
        [`${sectionId}_${candId}`]: value
      }
    });
  };

  const totals = useMemo(() => {
    const listTotals = Object.fromEntries(
      lists.map(l => [
        l.id,
        sections.reduce((sum, s) => sum + toNum(data.listVotes?.[`${s.id}_${l.id}`]), 0)
      ])
    );

    const totalVotes = Object.values(listTotals).reduce((a, b) => a + b, 0);

    const counted = sections.filter(s =>
      lists.some(l => toNum(data.listVotes?.[`${s.id}_${l.id}`]) > 0)
    ).length;

    const leader = lists.slice().sort((a, b) => listTotals[b.id] - listTotals[a.id])[0];

    const prefTotals = candidates
      .map(c => ({
        ...c,
        votes: sections.reduce((sum, s) => sum + toNum(data.prefVotes?.[`${s.id}_${c.id}`]), 0)
      }))
      .sort((a, b) => b.votes - a.votes);

    return { listTotals, totalVotes, counted, leader, prefTotals };
  }, [data]);

const resetAll = () => {
  const pass = prompt("Password reset totale");

  if (pass !== "1234") {
    alert("Password errata");
    return;
  }

  if (window.confirm("Azzerare tutti i dati live per tutti?")) {
    saveData(emptyData());
  }
};

  return (
    <div className="app">
      <header className="hero">
        <div>
          <div className="title-row">
            <img src={logo} alt="logo" className="logo" />

            <div>
              <p className="eyebrow">Massa Lubrense 2026 · dati non ufficiali</p>
              <h1>Spoglio Live</h1>
              <div className="status">
                <span className="dot" />
                {status} · ultimo aggiornamento: {data.updatedAt || "—"} · {APP_VERSION}
              </div>
            </div>
          </div>
        </div>

        <div className="operator-box">
          <h3>Operatore</h3>
          <input
            value={operator}
            placeholder="Nome"
            onChange={e => {
              setOperator(e.target.value);
              localStorage.setItem("operatorName", e.target.value);
            }}
          />
        </div>
      </header>

      <section className="stats-grid">
        <Stat label="Sezioni scrutinate" value={`${totals.counted}/13`} />
        <Stat label="Totale voti lista" value={totals.totalVotes} />
        <Stat label="Leader" value={totals.leader?.mayor?.split(" ")[0] || "—"} />
        <Stat
          label="Distacco"
          value={Math.abs((totals.listTotals.azione || 0) - (totals.listTotals.insieme || 0))}
        />
      </section>

      <nav className="tabs">
        <Tab active={tab === "live"} onClick={() => setTab("live")} icon={<BarChart3 />} label="Live" />
        <Tab
  active={tab === "insert"}
  onClick={() => {
    if (!unlocked) {
      const pass = prompt("Password inserimento");

      if (pass === "1234") {
        setUnlocked(true);
        setTab("insert");
      } else {
        alert("Password errata");
      }
    } else {
      setTab("insert");
    }
  }}
  icon={<Save />}
  label="Inserisci"
/>
        <Tab active={tab === "candidates"} onClick={() => setTab("candidates")} icon={<Users />} label="Candidati" />
        <Tab active={tab === "sections"} onClick={() => setTab("sections")} icon={<MapPin />} label="Seggi" />
      </nav>

      <main>
        {tab === "live" && <Live totals={totals} />}
        {tab === "insert" && (
          <Insert
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            data={data}
            setListVote={setListVote}
            setPrefVote={setPrefVote}
          />
        )}
        {tab === "candidates" && (
          <Candidates
            totals={totals}
            filter={candidateFilter}
            setFilter={setCandidateFilter}
          />
        )}
        {tab === "sections" && <Sections />}

        <button className="danger" onClick={resetAll}>
          <RefreshCcw size={16} /> Reset totale
        </button>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Tab({ active, onClick, icon, label }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      {React.cloneElement(icon, { size: 22 })}
      {label}
    </button>
  );
}

function Live({ totals }) {
  const max = Math.max(...Object.values(totals.listTotals), 1);

  return (
    <div className="stack">
      <section className="card">
        <h2>
          <BarChart3 size={28} /> Risultato liste
        </h2>

        {lists.map(l => {
          const votes = totals.listTotals[l.id] || 0;

          return (
            <div className="list-row" key={l.id}>
              <div className="list-header">
                <h3>{l.name}</h3>
                <div>
                  {votes} voti · {pct(votes, totals.totalVotes)}%
                </div>
              </div>

              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.max((votes / max) * 100, votes ? 6 : 0)}%`,
                    background: l.color
                  }}
                />
              </div>

              <div className="mayor">{l.mayor}</div>
            </div>
          );
        })}
      </section>

      <section className="card">
        <h2>
          <Trophy size={28} /> Top preferenze
        </h2>

        {totals.prefTotals.slice(0, 12).map((c, i) => (
          <div className="candidate-row" key={c.id}>
            <div>
              <h3>
                #{i + 1} {c.name}
              </h3>
              <p>{lists.find(l => l.id === c.list)?.name}</p>
            </div>

            <strong>{c.votes}</strong>
          </div>
        ))}
      </section>
    </div>
  );
}

function Insert({ activeSection, setActiveSection, data, setListVote, setPrefVote }) {
  const sec = sections.find(s => s.id === Number(activeSection));

  return (
    <div className="stack">
      <section className="card">
        <label className="fieldLabel">Seggio</label>

        <select value={activeSection} onChange={e => setActiveSection(Number(e.target.value))}>
          {sections.map(s => (
            <option key={s.id} value={s.id}>
              Seggio {s.id} · {s.zona}
            </option>
          ))}
        </select>

        <p className="muted">{sec.details}</p>
        <p className="muted">Responsabile: {sec.ref}</p>
      </section>

      <section className="card highlight">
        <h2>Voti lista · Seggio {sec.id}</h2>

        {lists.map(l => (
          <div className="inputRow" key={l.id}>
            <label>{l.name}</label>
            <input
              type="number"
              inputMode="numeric"
              value={data.listVotes?.[`${sec.id}_${l.id}`] || ""}
              onChange={e => setListVote(sec.id, l.id, e.target.value)}
            />
          </div>
        ))}
      </section>

      {lists.map(l => (
        <section className="card" key={l.id}>
          <h2>Preferenze · {l.name}</h2>

          {candidates
            .filter(c => c.list === l.id)
            .map(c => (
              <div className="inputRow compact" key={c.id}>
                <label>{c.name}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={data.prefVotes?.[`${sec.id}_${c.id}`] || ""}
                  onChange={e => setPrefVote(sec.id, c.id, e.target.value)}
                />
              </div>
            ))}
        </section>
      ))}
    </div>
  );
}

function Candidates({ totals, filter, setFilter }) {
  const rows = totals.prefTotals.filter(c => filter === "all" || c.list === filter);

  return (
    <section className="card">
      <div className="toolbar">
        <h2>Classifica candidati</h2>

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tutti</option>
          {lists.map(l => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {rows.map((c, i) => (
        <div className="candidate-row" key={c.id}>
          <div>
            <h3>
              #{i + 1} {c.name}
            </h3>
            <p>{lists.find(l => l.id === c.list)?.name}</p>
          </div>

          <strong>{c.votes}</strong>
        </div>
      ))}
    </section>
  );
}

function Sections() {
  return (
    <div className="stack">
      {sections.map(s => (
        <section className="card" key={s.id}>
          <div className="sectionHead">
            <div>
              <span>Seggio {s.id}</span>
              <h2>{s.zona}</h2>
            </div>

            <b>{s.ref}</b>
          </div>
        </section>
      ))}
    </div>
  );
}