import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, MapPin, Save, RotateCcw, Download, Upload, Clock, Trophy } from "lucide-react";
function Card({ children, className = "" }) {
  return <div className={`bg-white border border-slate-200 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`border px-3 py-2 bg-white hover:bg-slate-100 ${className}`}
    >
      {children}
    </button>
  );
}
const lists = [
  { id: "insieme", name: "Insieme per Massa Lubrense", mayor: "Liberato Staiano detto Lello", color: "bg-blue-600" },
  { id: "azione", name: "Azione in Comune", mayor: "Michele Pollio", color: "bg-orange-500" },
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
  listVotes: Object.fromEntries(sections.flatMap(s => lists.map(l => [`${s.id}_${l.id}`, ""]))),
  prefVotes: Object.fromEntries(sections.flatMap(s => candidates.map(c => [`${s.id}_${c.id}`, ""]))),
});

function n(v) { return Number(v || 0) || 0; }

export default function SpoglioLiveMassaLubrense() {
  const [tab, setTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState(1);
  const [candidateFilter, setCandidateFilter] = useState("all");
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("spoglio_massa_2026")) || emptyData(); } catch { return emptyData(); }
  });

  useEffect(() => localStorage.setItem("spoglio_massa_2026", JSON.stringify(data)), [data]);

  const totals = useMemo(() => {
    const listTotals = Object.fromEntries(lists.map(l => [l.id, sections.reduce((sum, s) => sum + n(data.listVotes[`${s.id}_${l.id}`]), 0)]));
    const prefTotals = candidates.map(c => ({ ...c, votes: sections.reduce((sum, s) => sum + n(data.prefVotes[`${s.id}_${c.id}`]), 0) })).sort((a,b) => b.votes - a.votes);
    const counted = sections.filter(s => lists.some(l => n(data.listVotes[`${s.id}_${l.id}`]) > 0)).length;
    return { listTotals, prefTotals, counted, totalVotes: Object.values(listTotals).reduce((a,b)=>a+b,0) };
  }, [data]);

  const setListVote = (sectionId, listId, value) => setData(d => ({ ...d, updatedAt: new Date().toLocaleString("it-IT"), listVotes: { ...d.listVotes, [`${sectionId}_${listId}`]: value } }));
  const setPrefVote = (sectionId, candId, value) => setData(d => ({ ...d, updatedAt: new Date().toLocaleString("it-IT"), prefVotes: { ...d.prefVotes, [`${sectionId}_${candId}`]: value } }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "spoglio-massa-lubrense.json"; a.click();
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { setData(JSON.parse(reader.result)); } catch { alert("File non valido"); } };
    reader.readAsText(file);
  };

  const reset = () => {
    if (confirm("Azzerare tutti i dati inseriti?")) setData(emptyData());
  };

  return <div className="min-h-screen bg-slate-100 text-slate-950 pb-24">
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black leading-tight">Spoglio Live</h1>
            <p className="text-xs text-slate-500">Massa Lubrense 2026 · dati non ufficiali</p>
          </div>
          <div className="text-right text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {data.updatedAt || "non aggiornato"}</div>
        </div>
      </div>
    </div>

    <main className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Sezioni" value={`${totals.counted}/13`} />
        <Stat label="Voti lista" value={totals.totalVotes} />
        <Stat label="Leader" value={lists.slice().sort((a,b)=>totals.listTotals[b.id]-totals.listTotals[a.id])[0]?.mayor.split(" ")[0] || "-"} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <NavButton active={tab==="dashboard"} onClick={()=>setTab("dashboard")} icon={<BarChart3/>} label="Live" />
        <NavButton active={tab==="insert"} onClick={()=>setTab("insert")} icon={<Save/>} label="Inserisci" />
        <NavButton active={tab==="candidates"} onClick={()=>setTab("candidates")} icon={<Users/>} label="Candidati" />
        <NavButton active={tab==="sections"} onClick={()=>setTab("sections")} icon={<MapPin/>} label="Seggi" />
      </div>

      {tab === "dashboard" && <Dashboard totals={totals} />}
      {tab === "insert" && <Insert activeSection={activeSection} setActiveSection={setActiveSection} data={data} setListVote={setListVote} setPrefVote={setPrefVote} />}
      {tab === "candidates" && <Candidates totals={totals} filter={candidateFilter} setFilter={setCandidateFilter} />}
      {tab === "sections" && <Sections />}

      <Card className="rounded-2xl shadow-sm"><CardContent className="p-4 space-y-3">
        <h2 className="font-bold">Backup dati</h2>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={exportJson} variant="outline" className="rounded-xl"><Download className="w-4 h-4 mr-1"/> Export</Button>
          <label className="rounded-xl border h-10 flex items-center justify-center text-sm cursor-pointer bg-white"><Upload className="w-4 h-4 mr-1"/> Import<input type="file" accept="application/json" className="hidden" onChange={importJson}/></label>
          <Button onClick={reset} variant="outline" className="rounded-xl"><RotateCcw className="w-4 h-4 mr-1"/> Reset</Button>
        </div>
      </CardContent></Card>
    </main>
  </div>;
}

function Stat({label, value}) { return <Card className="rounded-2xl shadow-sm"><CardContent className="p-3"><div className="text-xs text-slate-500">{label}</div><div className="text-xl font-black truncate">{value}</div></CardContent></Card>; }
function NavButton({active, onClick, icon, label}) { return <button onClick={onClick} className={`rounded-2xl p-3 text-xs font-bold flex flex-col items-center gap-1 border ${active ? "bg-slate-950 text-white border-slate-950" : "bg-white border-slate-200"}`}>{React.cloneElement(icon,{className:"w-5 h-5"})}{label}</button>; }

function Dashboard({ totals }) {
  const max = Math.max(...Object.values(totals.listTotals), 1);
  return <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
    <Card className="rounded-2xl shadow-sm"><CardContent className="p-4 space-y-4">
      <h2 className="font-black text-lg">Risultato liste</h2>
      {lists.map(l => <div key={l.id}>
        <div className="flex justify-between text-sm mb-1"><span className="font-bold">{l.name}</span><span>{totals.listTotals[l.id]} voti</span></div>
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden"><div className={`${l.color} h-full rounded-full`} style={{width:`${(totals.listTotals[l.id]/max)*100}%`}} /></div>
      </div>)}
    </CardContent></Card>

    <Card className="rounded-2xl shadow-sm"><CardContent className="p-4">
      <h2 className="font-black text-lg mb-3 flex items-center gap-2"><Trophy className="w-5 h-5"/> Top preferenze</h2>
      <div className="space-y-2">{totals.prefTotals.slice(0,10).map((c,i)=><div key={c.id} className="flex justify-between items-center border-b pb-2"><div><span className="text-slate-500 mr-2">#{i+1}</span><span className="font-semibold">{c.name}</span><div className="text-xs text-slate-500">{lists.find(l=>l.id===c.list)?.name}</div></div><div className="font-black">{c.votes}</div></div>)}</div>
    </CardContent></Card>
  </motion.div>;
}

function Insert({ activeSection, setActiveSection, data, setListVote, setPrefVote }) {
  const sec = sections.find(s => s.id === Number(activeSection));
  return <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
    <Card className="rounded-2xl shadow-sm"><CardContent className="p-4 space-y-3">
      <label className="text-sm font-bold">Seleziona seggio</label>
      <select value={activeSection} onChange={e=>setActiveSection(Number(e.target.value))} className="w-full rounded-xl border p-3 bg-white font-bold">
        {sections.map(s => <option key={s.id} value={s.id}>Seggio {s.id} · {s.zona}</option>)}
      </select>
      <p className="text-xs text-slate-500">{sec.details}</p>
    </CardContent></Card>

    <Card className="rounded-2xl shadow-sm"><CardContent className="p-4 space-y-3">
      <h2 className="font-black text-lg">Voti liste · Seggio {sec.id}</h2>
      {lists.map(l => <div key={l.id} className="grid grid-cols-[1fr_110px] gap-3 items-center"><label className="font-bold">{l.name}</label><input type="number" inputMode="numeric" value={data.listVotes[`${sec.id}_${l.id}`]} onChange={e=>setListVote(sec.id,l.id,e.target.value)} className="rounded-xl border p-3 text-right text-lg font-black" /></div>)}
    </CardContent></Card>

    {lists.map(l => <Card key={l.id} className="rounded-2xl shadow-sm"><CardContent className="p-4 space-y-3">
      <h2 className="font-black text-lg">Preferenze · {l.name}</h2>
      {candidates.filter(c=>c.list===l.id).map(c => <div key={c.id} className="grid grid-cols-[1fr_90px] gap-3 items-center"><label className="text-sm font-semibold">{c.name}</label><input type="number" inputMode="numeric" value={data.prefVotes[`${sec.id}_${c.id}`]} onChange={e=>setPrefVote(sec.id,c.id,e.target.value)} className="rounded-xl border p-2 text-right font-black" /></div>)}
    </CardContent></Card>)}
  </motion.div>;
}

function Candidates({ totals, filter, setFilter }) {
  const rows = totals.prefTotals.filter(c => filter === "all" || c.list === filter);
  return <Card className="rounded-2xl shadow-sm"><CardContent className="p-4 space-y-3">
    <div className="flex items-center justify-between gap-3"><h2 className="font-black text-lg">Classifica candidati</h2><select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-xl border p-2 bg-white text-sm"><option value="all">Tutti</option>{lists.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
    {rows.map((c,i)=><div key={c.id} className="flex justify-between items-center border-b pb-2"><div><span className="text-slate-500 mr-2">#{i+1}</span><span className="font-semibold">{c.name}</span><div className="text-xs text-slate-500">{lists.find(l=>l.id===c.list)?.name}</div></div><div className="font-black text-lg">{c.votes}</div></div>)}
  </CardContent></Card>;
}

function Sections() {
  return <div className="space-y-3">{sections.map(s=><Card key={s.id} className="rounded-2xl shadow-sm"><CardContent className="p-4"><div className="flex justify-between gap-3"><div><div className="text-xs text-slate-500">Seggio {s.id}</div><h3 className="font-black text-lg">{s.zona}</h3></div><div className="text-right text-sm font-bold">{s.ref}</div></div><p className="text-sm text-slate-600 mt-2">{s.details}</p></CardContent></Card>)}</div>;
}
