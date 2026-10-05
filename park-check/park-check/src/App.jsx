import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Car, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Clock3, Home, LocateFixed, MapPin, ParkingCircle, Search, Timer, X } from "lucide-react";

const places = [
  { id: 1, name: "Sveavägen 44", distance: "120 m", status: "allowed", summary: "Tillåtet till 16.00", detail: "Högst 2 timmar · 20 kr per timme" },
  { id: 2, name: "Tegnérgatan 12", distance: "260 m", status: "warning", summary: "Servicetid börjar 14.00", detail: "Flytta bilen senast 13.55" },
  { id: 3, name: "Drottninggatan 86", distance: "410 m", status: "blocked", summary: "Parkering inte tillåten", detail: "Förbud på hela sträckan" },
];

const status = {
  allowed: { color: "green", icon: CheckCircle2 },
  warning: { color: "amber", icon: Clock3 },
  blocked: { color: "red", icon: CircleAlert },
};

function Button({ children, className = "", disabled, onClick, variant = "dark" }) {
  return <button disabled={disabled} onClick={onClick} className={`button ${variant} ${className}`}>{children}</button>;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(places[0]);
  const [flowOpen, setFlowOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [carSelected, setCarSelected] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const filtered = useMemo(() => places.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const openFlow = () => { setStep(0); setCarSelected(false); setFlowOpen(true); };
  const openPlace = p => { setSelected(p); setScreen("result"); };

  return <div className="page"><div className="phone">
    <header><button className="brand" onClick={() => setScreen("home")}><span className="logo"><ParkingCircle size={28}/></span><span><b>Park Check</b><small>Parkera med bättre koll</small></span></button><button className="round" onClick={openFlow}><Camera size={19}/></button></header>
    <main><AnimatePresence mode="wait">
      {screen === "home" && <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}}>
        <section className="hero"><p>God förmiddag</p><h1>Får du parkera här?</h1><div className="lead">Ta två bilder. Vi hjälper dig att förstå platsen och skylten.</div><Button onClick={openFlow}><Camera size={19}/>Kontrollera parkering</Button></section>
        <section className="steps">{[["1","Fota bilen"],["2","Markera bilen"],["3","Fota skylten"]].map(x=><div key={x[0]}><span>{x[0]}</span><small>{x[1]}</small></div>)}</section>
        <section className="near"><div className="section-title"><h2>Platser nära dig</h2><button onClick={()=>setScreen("map")}>Visa karta</button></div><div className="list">{filtered.map((p,i)=>{const I=status[p.status].icon;return <button className={i?"row border":"row"} key={p.id} onClick={()=>openPlace(p)}><span className={`status ${status[p.status].color}`}><I size={20}/></span><span className="rowtext"><b>{p.name}</b><small>{p.summary}</small></span><small>{p.distance}</small><ChevronRight size={17}/></button>})}</div></section>
      </motion.div>}
      {screen === "map" && <motion.div key="map" className="content" initial={{opacity:0}} animate={{opacity:1}}><h1>Karta</h1><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök gata eller plats"/></div><div className="map">{places.map((p,i)=><button key={p.id} onClick={()=>openPlace(p)} className={`pin ${status[p.status].color}`} style={{left:`${17+i*29}%`,top:`${25+(i%2)*34}%`}}><MapPin size={21}/></button>)}<button className="locate"><LocateFixed size={20}/></button></div></motion.div>}
      {screen === "result" && <motion.div key="result" className="content" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}}><button className="back" onClick={()=>setScreen("home")}><ChevronLeft size={18}/>Tillbaka</button><div className="result">{React.createElement(status[selected.status].icon,{size:54,className:status[selected.status].color})}<p>{selected.name}</p><h1>{selected.summary}</h1><div>{selected.detail}</div></div><div className="notice"><b><Check size={19}/>Bilen och skylten har kontrollerats</b><p>Beskedet är vägledande. Kontrollera alltid skyltningen på plats.</p></div>{selected.status!=="blocked"&&<Button onClick={()=>{setTimerActive(true);setScreen("timer")}}><Timer size={19}/>Starta påminnelse</Button>}</motion.div>}
      {screen === "timer" && <motion.div key="timer" className="content" initial={{opacity:0}} animate={{opacity:1}}><h1>Min parkering</h1>{timerActive?<div className="timer"><p>Tid kvar</p><strong>1:42</strong><p>{selected.name}</p><div className="notice">Du får en påminnelse 15 minuter innan tiden går ut.</div><Button variant="light" onClick={()=>setTimerActive(false)}>Avsluta parkering</Button></div>:<div className="empty"><Timer size={48}/><h2>Ingen aktiv parkering</h2><p>Kontrollera en plats för att starta en påminnelse.</p></div>}</motion.div>}
    </AnimatePresence></main>
    <nav>{[["home",Home,"Hem"],["map",MapPin,"Karta"],["timer",Timer,"Parkering"]].map(([id,I,label])=><button key={id} onClick={()=>setScreen(id)} className={screen===id||(id==="home"&&screen==="result")?"active":""}><I size={20}/><span>{label}</span></button>)}</nav>
    <AnimatePresence>{flowOpen&&<motion.div className="flow" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="flowtop"><button className="round" onClick={()=>step>0?setStep(step-1):setFlowOpen(false)}>{step>0?<ChevronLeft/>:<X/>}</button><span>{Math.min(step+1,4)} av 4</span><i/></div><div className="progress"><motion.div animate={{width:`${((step+1)/4)*100}%`}}/></div><div className="flowbody">
      {step===0&&<><h1>Fota bilen och platsen</h1><p>Se till att hela bilen, vägkanten och området runt bilen syns.</p><div className="camera"><Car size={48}/><div className="carframe"/><small>Placera bilen i ramen</small></div><Button onClick={()=>setStep(1)}><Camera size={19}/>Ta bild</Button></>}
      {step===1&&<><h1>Vilken bil är din?</h1><p>Tryck på din bil. Du kan ändra markeringen om den hamnar fel.</p><div className="demo"><button className={`democar ${carSelected?"chosen":""}`} onClick={()=>setCarSelected(true)}><i/><i/>{carSelected&&<span><Check/></span>}</button><small>Demobild</small></div><Button disabled={!carSelected} onClick={()=>setStep(2)}>Detta är min bil</Button></>}
      {step===2&&<><h1>Fota hela skylten</h1><p>Ta med huvudskylten och alla mindre skyltar under den.</p><div className="camera"><div className="sign"><ParkingCircle size={58}/></div><small>Placera alla skyltar i ramen</small></div><Button onClick={()=>setStep(3)}><Camera size={19}/>Ta bild</Button></>}
      {step===3&&<div className="done"><span><CheckCircle2 size={42}/></span><h1>Klart</h1><p>Vi har hittat din bil och läst skylten. Du får parkera här i högst 2 timmar.</p><Button onClick={()=>{setFlowOpen(false);openPlace(places[0])}}>Visa besked</Button></div>}
    </div></motion.div>}</AnimatePresence>
  </div></div>
}
