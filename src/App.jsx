import React, { useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import {
  BarChart3,
  Users,
  MapPin,
  Save,
  Trophy,
  RefreshCcw,
} from "lucide-react";

import "./App.css";
import logo from "./assets/AIC.jpg";

const APP_VERSION = "v1.1.1";

const firebaseConfig = {
  apiKey: "AIzaSyDnlv6pfjMcqBo55NhWiBevenyf5bNN018",
  authDomain: "spoglio-massa.firebaseapp.com",
  databaseURL:
    "https://spoglio-massa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spoglio-massa",
  storageBucket: "spoglio-massa.firebasestorage.app",
  messagingSenderId: "969567374845",
  appId: "1:969567374845:web:17a2c477399ab69698dd94",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const liveRef = ref(db, "spoglioLiveMassa2026");

const PASSWORD = "1234";

const lists = [
  {
    id: "azione",
    name: "Azione in Comune",
    mayor: "Michele Pollio",
    color: "#f97316",
  },
  {
    id: "insieme",
    name: "Insieme per Massa Lubrense",
    mayor: "Liberato Staiano detto Lello",
    color: "#2563eb",
  },
];

const sections = [
  { id: 1, zona: "Massa", ref: "Mandato - Mario" },
  { id: 2, zona: "Massa", ref: "Fusillo" },
  { id: 3, zona: "Annunziata Marciano", ref: "Carla" },
  { id: 4, zona: "Massa-Turro", ref: "Mimmo" },
  { id: 5, zona: "S. Agata Centro", ref: "Ivan" },
  { id: 6, zona: "Torca", ref: "Carmen + Carmen" },
  { id: 7, zona: "Acquara-Pastena", ref: "Vanna - Nando" },
  { id: 8, zona: "Monticchio", ref: "Pietro - Angela" },
  { id: 9, zona: "Termini", ref: "Umberto" },
  { id: 10, zona: "Nerano", ref: "Maurizio" },
  { id: 11, zona: "Monticchio Ovest", ref: "Pietro - Angela" },
  { id: 12, zona: "S. Agata Est", ref: "Fabio - Michele" },
  { id: 13, zona: "S. Agata Ovest", ref: "Luigi - Antonina" },
];

const candidates = [
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
];

const emptyData = () => ({
  updatedAt: null,
  updatedBy: "",
  listVotes: Object.fromEntries(
    sections.flatMap((s) =>
      lists.map((l) => [`${s.id}_${l.id}`, ""])
    )
  ),
  prefVotes: Object.fromEntries(
    sections.flatMap((s) =>
      candidates.map((c) => [`${s.id}_${c.id}`, ""])
    )
  ),
});

function toNum(v) {
  return Number(v || 0) || 0;
}

function pct(part, total) {
  return total > 0
    ? ((part / total) * 100).toFixed(1)
    : "0.0";
}

export default function App() {
  const [tab, setTab] = useState("live");
  const [unlocked, setUnlocked] = useState(false);

  const [activeSection, setActiveSection] = useState(1);

  const [sectionConfirmed, setSectionConfirmed] =
    useState(false);

  const [operator, setOperator] = useState(
    localStorage.getItem("operatorName") || ""
  );

  const [data, setDataState] = useState(emptyData());

  const [status, setStatus] =
    useState("Connessione...");

  useEffect(() => {
    const unsub = onValue(
      liveRef,
      (snap) => {
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
      updatedAt: new Date().toLocaleString(
        "it-IT"
      ),
      updatedBy: operator || "Operatore",
    };

    set(liveRef, payload);
  };

  const setListVote = (
    sectionId,
    listId,
    value
  ) => {
    saveData({
      ...data,
      listVotes: {
        ...data.listVotes,
        [`${sectionId}_${listId}`]: value,
      },
    });
  };

  const setPrefVote = (
    sectionId,
    candId,
    value
  ) => {
    saveData({
      ...data,
      prefVotes: {
        ...data.prefVotes,
        [`${sectionId}_${candId}`]: value,
      },
    });
  };

  const totals = useMemo(() => {
    const listTotals = Object.fromEntries(
      lists.map((l) => [
        l.id,
        sections.reduce(
          (sum, s) =>
            sum +
            toNum(
              data.listVotes?.[
                `${s.id}_${l.id}`
              ]
            ),
          0
        ),
      ])
    );

    const totalVotes = Object.values(
      listTotals
    ).reduce((a, b) => a + b, 0);

    const counted = sections.filter((s) =>
      lists.some(
        (l) =>
          toNum(
            data.listVotes?.[
              `${s.id}_${l.id}`
            ]
          ) > 0
      )
    ).length;

    const leader = lists
      .slice()
      .sort(
        (a, b) =>
          listTotals[b.id] -
          listTotals[a.id]
      )[0];

    const prefTotals = candidates
      .map((c) => ({
        ...c,
        votes: sections.reduce(
          (sum, s) =>
            sum +
            toNum(
              data.prefVotes?.[
                `${s.id}_${c.id}`
              ]
            ),
          0
        ),
      }))
      .sort((a, b) => b.votes - a.votes);

    return {
      listTotals,
      totalVotes,
      counted,
      leader,
      prefTotals,
    };
  }, [data]);

  const resetAll = () => {
    const pass = prompt(
      "Password reset totale"
    );

    if (pass !== "4321") {
      alert("Password errata");
      return;
    }

    if (
      window.confirm(
        "Azzerare tutti i dati?"
      )
    ) {
      saveData(emptyData());
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="title-row">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />

          <div>
            <p className="eyebrow">
              Massa Lubrense 2026 · dati non
              ufficiali
            </p>

            <h1>Spoglio Live</h1>

            <div className="status">
              <span className="dot"></span>

              {status} · ultimo aggiornamento:
              {" "}
              {data.updatedAt || "—"} ·{" "}
              {APP_VERSION}
            </div>
          </div>
        </div>

        <div className="operator-box">
          <h3>Operatore</h3>

          <input
            value={operator}
            placeholder="Nome"
            onChange={(e) => {
              setOperator(e.target.value);

              localStorage.setItem(
                "operatorName",
                e.target.value
              );
            }}
          />
        </div>
      </header>

      <section className="stats-grid">
        <Stat
          label="Sezioni scrutinate"
          value={`${totals.counted}/13`}
        />

        <Stat
          label="Totale voti lista"
          value={totals.totalVotes}
        />

        <Stat
          label="Leader"
          value={
            totals.leader?.mayor?.split(
              " "
            )[0] || "—"
          }
        />

        <Stat
          label="Distacco"
          value={Math.abs(
            (totals.listTotals.azione || 0) -
              (totals.listTotals.insieme ||
                0)
          )}
        />
      </section>

      <nav className="tabs">
        <button
          className={
            tab === "live" ? "active" : ""
          }
          onClick={() => setTab("live")}
        >
          <BarChart3 size={22} />
          Live
        </button>

        <button
          className={
            tab === "insert"
              ? "active"
              : ""
          }
          onClick={() => {
            if (!unlocked) {
              const pass = prompt(
                "Password inserimento"
              );

              if (pass === PASSWORD) {
                setUnlocked(true);
                setSectionConfirmed(false);
                setTab("insert");
              } else {
                alert("Password errata");
              }
            } else {
              setSectionConfirmed(false);
              setTab("insert");
            }
          }}
        >
          <Save size={22} />
          Inserisci
        </button>

        <button
          className={
            tab === "candidates"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("candidates")
          }
        >
          <Users size={22} />
          Candidati
        </button>

        <button
          className={
            tab === "sections"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("sections")
          }
        >
          <MapPin size={22} />
          Seggi
        </button>
      </nav>

      <main className="stack">
        {tab === "live" && (
          <>
            <section className="card">
              <h2>
                <BarChart3 size={28} />
                Risultato liste
              </h2>

              {lists.map((l) => {
                const votes =
                  totals.listTotals[l.id] ||
                  0;

                return (
                  <div
                    className="list-row"
                    key={l.id}
                  >
                    <div className="list-header">
                      <h3>{l.name}</h3>

                      <div>
                        {votes} voti ·{" "}
                        {pct(
                          votes,
                          totals.totalVotes
                        )}
                        %
                      </div>
                    </div>

                    <div className="bar-bg">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${totals.totalVotes > 0 ? (votes / totals.totalVotes) * 100 : 0}%`,
                          background:
                            l.color,
                        }}
                      />
                    </div>

                    <div className="mayor">
                      {l.mayor}
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="card">
              <h2>
                <Trophy size={28} />
                Top preferenze
              </h2>

              {totals.prefTotals
                .slice(0, 10)
                .map((c, i) => (
                  <div
                    className="candidate-row"
                    key={c.id}
                  >
                    <div>
                      <h3>
                        #{i + 1} {c.name}
                      </h3>

                      <p>
                        {
                          lists.find(
                            (l) =>
                              l.id === c.list
                          )?.name
                        }
                      </p>
                    </div>

                    <strong>
                      {c.votes}
                    </strong>
                  </div>
                ))}
            </section>
          </>
        )}

        {tab === "insert" && (
          <>
            <section className="card">
              <label className="fieldLabel">
                Seggio
              </label>

              <select
                value={activeSection}
                onChange={(e) =>
                  setActiveSection(
                    Number(
                      e.target.value
                    )
                  )
                }
              >
                {sections.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                  >
                    Seggio {s.id} ·{" "}
                    {s.zona}
                  </option>
                ))}
              </select>

              <p className="muted">
                Responsabile:{" "}
                {
                  sections.find(
                    (s) =>
                      s.id ===
                      activeSection
                  )?.ref
                }
              </p>
            </section>

            {!sectionConfirmed && (
              <section className="card highlight">
                <h2>
                  Conferma seggio
                </h2>

                <p className="muted">
                  Hai selezionato il
                  Seggio{" "}
                  {activeSection}
                </p>

                <button
                  className="danger"
                  style={{
                    background:
                      "#071225",
                    color: "white",
                  }}
                  onClick={() =>
                    setSectionConfirmed(
                      true
                    )
                  }
                >
                  Conferma e inserisci
                  dati
                </button>
              </section>
            )}

            {sectionConfirmed && (
              <>
                <section className="card highlight">
                  <h2>
                    Voti lista · Seggio{" "}
                    {activeSection}
                  </h2>

                  {lists.map((l) => (
                    <div
                      className="inputRow"
                      key={l.id}
                    >
                      <label>
                        {l.name}
                      </label>

                      <input
                        type="number"
                        value={
                          data.listVotes?.[
                            `${activeSection}_${l.id}`
                          ] || ""
                        }
                        onChange={(e) =>
                          setListVote(
                            activeSection,
                            l.id,
                            e.target
                              .value
                          )
                        }
                      />
                    </div>
                  ))}
                </section>

                {lists.map((l) => (
                  <section
                    className="card"
                    key={l.id}
                  >
                    <h2>
                      Preferenze ·{" "}
                      {l.name}
                    </h2>

                    {candidates
                      .filter(
                        (c) =>
                          c.list ===
                          l.id
                      )
                      .map((c) => (
                        <div
                          className="inputRow"
                          key={c.id}
                        >
                          <label>
                            {c.name}
                          </label>

                          <input
                            type="number"
                            value={
                              data
                                .prefVotes?.[
                                `${activeSection}_${c.id}`
                              ] || ""
                            }
                            onChange={(
                              e
                            ) =>
                              setPrefVote(
                                activeSection,
                                c.id,
                                e.target
                                  .value
                              )
                            }
                          />
                        </div>
                      ))}
                  </section>
                ))}
              </>
            )}
          </>
        )}

        {tab === "candidates" && (
  <div className="stack">
    {lists.map((l) => {
      const rows = totals.prefTotals.filter(
        (c) => c.list === l.id
      );

      const isWinner =
        totals.listTotals["azione"] >
        totals.listTotals["insieme"]
          ? l.id === "azione"
          : l.id === "insieme";

      return (
        <section className="card" key={l.id}>
          <h2>
            <Users size={28} />
            Preferenze · {l.name}
          </h2>

          {rows.map((c, i) => (
            <div
              className="candidate-row"
              key={c.id}
            >
              <div>
                <h3>
                  #{i + 1} {c.name}

                  {isWinner && i < 10 && (
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "#16a34a",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      • ELETTO
                    </span>
                  )}

                  {!isWinner && i < 5 && (
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "#2563eb",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      • OPPOSIZIONE
                    </span>
                  )}
                </h3>
              </div>

              <strong>{c.votes}</strong>
            </div>
          ))}
        </section>
      );
    })}
  </div>
)}

        {tab === "sections" && (
          <section className="card">
            <h2>
              <MapPin size={28} />
              Seggi
            </h2>

            {sections.map((s) => {
  const azione = toNum(data.listVotes?.[`${s.id}_azione`]);
  const insieme = toNum(data.listVotes?.[`${s.id}_insieme`]);

  const totale = azione + insieme;

  const rows = [
    {
      name: "Azione in Comune",
      votes: azione,
      color: "#f97316",
    },
    {
      name: "Insieme per Massa Lubrense",
      votes: insieme,
      color: "#2563eb",
    },
  ].sort((a, b) => b.votes - a.votes);

  return (
    <div
      className="candidate-row"
      key={s.id}
    >
      <div>
        <h3>
          Seggio {s.id} · {s.zona}
        </h3>

        <p>
          Responsabile: {s.ref}
        </p>

        {rows.map((r) => (
          <p key={r.name}>
            <strong
              style={{ color: r.color }}
            >
              {r.name}
            </strong>
            : {r.votes} voti ·{" "}
            {totale > 0
              ? (
                  (r.votes / totale) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </p>
        ))}
      </div>

      <strong>{totale}</strong>
    </div>
  );
})}
          </section>
        )}

        <button
          className="danger"
          onClick={resetAll}
        >
          <RefreshCcw size={18} />
          Reset totale
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