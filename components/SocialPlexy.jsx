"use client";
import { useState, useEffect, useRef } from "react";

// ── PALETA ────────────────────────────────────────────────────
const RED   = "#FF1A1A";
const LIME  = "#C8FF00";
const WHITE = "#FFFFFF";
const BG    = "#000000";

// ── MEME DATA com imagens reais via picsum/placeholder ────────
// Usamos URLs de imagens reais (landscape e portrait)
const MEMES = [
  {
    id:"m1", type:"gif",
    title:"QUANDO O ALGORITMO TE ABANDONA",
    subtitle:"toda plataforma dark às 3AM",
    img:"https://picsum.photos/seed/meme1/600/400",
    views:"2.1M", likes:"184K", comments:432,
    tag:"TRENDING", tagColor:RED,
    author:"Void_8472", authorColor:"#dc2626",
    date:"17 abr 2026",
  },
  {
    id:"m2", type:"gif",
    title:"EU DEPOIS DE VER O OCEANO PROFUNDO",
    subtitle:"nunca mais durmo",
    img:"https://picsum.photos/seed/meme2/600/338",
    views:"890K", likes:"67K", comments:210,
    tag:"DARK ARTS", tagColor:"#7c3aed",
    author:"Nexus_1023", authorColor:"#7c3aed",
    date:"15 abr 2026",
  },
  {
    id:"m3", type:"gif",
    title:"GLITCH NA MATRIX",
    subtitle:"você também viu isso?",
    img:"https://picsum.photos/seed/meme3/600/800",
    views:"5.4M", likes:"312K", comments:1204,
    tag:"VIRAL", tagColor:"#ff6600",
    author:"Void_8472", authorColor:"#dc2626",
    date:"14 abr 2026",
    tall: true,
  },
  {
    id:"m4", type:"gif",
    title:"ENTIDADE DETECTADA",
    subtitle:"câmera de segurança às 03:33",
    img:"https://picsum.photos/seed/meme4/600/400",
    views:"3.3M", likes:"228K", comments:876,
    tag:"MISTÉRIO", tagColor:"#0891b2",
    author:"Nexus_1023", authorColor:"#7c3aed",
    date:"12 abr 2026",
  },
  {
    id:"m5", type:"gif",
    title:"FREQUÊNCIA PROIBIDA",
    subtitle:"eles não querem que você ouça isso",
    img:"https://picsum.photos/seed/meme5/600/400",
    views:"1.7M", likes:"99K", comments:543,
    tag:"CONSPIRAÇÃO", tagColor:"#d97706",
    author:"Void_8472", authorColor:"#dc2626",
    date:"10 abr 2026",
  },
  {
    id:"m6", type:"gif",
    title:"QUANDO O CÓDIGO COMPILA",
    subtitle:"primeira tentativa",
    img:"https://picsum.photos/seed/meme6/600/800",
    views:"440K", likes:"38K", comments:129,
    tag:"HUMOR", tagColor:"#16a34a",
    author:"Nexus_1023", authorColor:"#7c3aed",
    date:"08 abr 2026",
    tall: true,
  },
];

function fmt(n) {
  if (!n) return "0";
  const s = String(n);
  if (s.includes("M")||s.includes("K")) return s;
  const num = Number(n);
  if (num>=1e6) return (num/1e6).toFixed(1)+"M";
  if (num>=1e3) return (num/1e3).toFixed(1)+"K";
  return s;
}
function uid() { return Math.random().toString(36).slice(2,8); }

// ── WINDMILL ──────────────────────────────────────────────────
function Windmill({ size=28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="5" fill={LIME}/>
      <path d="M32 27C30 18 24 10 16 6C22 14 32 27 32 27Z" fill={LIME}/>
      <path d="M37 32C46 30 54 24 58 16C50 22 37 32 37 32Z" fill={LIME}/>
      <path d="M32 37C34 46 40 54 48 58C42 50 32 37 32 37Z" fill={LIME}/>
      <path d="M27 32C18 34 10 40 6 48C14 42 27 32 27 32Z" fill={LIME}/>
      <rect x="30.5" y="37" width="3" height="22" rx="1.5" fill="white" opacity=".4"/>
      <rect x="24" y="57" width="16" height="3" rx="1.5" fill="white" opacity=".4"/>
    </svg>
  );
}

// ── MEME CARD ─────────────────────────────────────────────────
function MemeCard({ meme, onClick }) {
  const [liked, setLiked] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div onClick={onClick} style={{
      background: "#0a0a0a",
      borderRadius: 16,
      overflow: "hidden",
      cursor: "pointer",
      border: "1.5px solid #1a1a1a",
      position: "relative",
      transition: "transform .18s, box-shadow .18s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform="scale(1.015)"; e.currentTarget.style.boxShadow="0 8px 40px rgba(255,26,26,.18)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}
    >
      {/* THUMBNAIL */}
      <div style={{ position:"relative", background:"#111", minHeight: meme.tall ? 320 : 200, overflow:"hidden" }}>
        {!imgErr ? (
          <img
            src={meme.img}
            alt={meme.title}
            onLoad={() => setLoaded(true)}
            onError={() => setImgErr(true)}
            style={{
              width:"100%",
              height: meme.tall ? 320 : 200,
              objectFit:"cover",
              display:"block",
              opacity: loaded ? 1 : 0,
              transition: "opacity .3s",
            }}
          />
        ) : (
          <div style={{ height: meme.tall ? 320 : 200, background:"#111", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>🎬</div>
        )}

        {/* Gradiente overlay bottom-up forte */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 40%, transparent 70%)" }}/>

        {/* TAG BADGE topo esquerdo — estilo TepiCine */}
        <div style={{
          position:"absolute", top:10, left:10,
          background: meme.tagColor,
          color:"#fff",
          fontSize:10, fontWeight:900,
          padding:"3px 10px", borderRadius:4,
          letterSpacing:1.2,
          fontFamily:"'Bebas Neue',sans-serif",
          textShadow:"0 1px 3px rgba(0,0,0,.5)",
          boxShadow:"0 2px 8px rgba(0,0,0,.4)",
        }}>
          {meme.tag}
        </div>

        {/* GIF badge topo direito */}
        <div style={{
          position:"absolute", top:10, right:10,
          background:"rgba(0,0,0,.7)",
          color: LIME,
          fontSize:10, fontWeight:900,
          padding:"3px 8px", borderRadius:4,
          border:`1px solid ${LIME}55`,
          fontFamily:"monospace",
          letterSpacing:1,
        }}>
          GIF
        </div>

        {/* TÍTULO BOLD com text-stroke — sobre a imagem, parte inferior */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"12px 12px 8px" }}>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize: meme.title.length > 28 ? 20 : 24,
            fontWeight:400,
            color:WHITE,
            lineHeight:1.1,
            letterSpacing:.8,
            textShadow:"2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 3px 12px rgba(0,0,0,.9)",
            marginBottom:4,
          }}>
            {meme.title}
          </div>
          {meme.subtitle && (
            <div style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:13,
              color: RED,
              letterSpacing:.8,
              textShadow:"1px 1px 0 #000, -1px -1px 0 #000",
            }}>
              {meme.subtitle}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER — autor + stats */}
      <div style={{ padding:"10px 12px 12px", display:"flex", alignItems:"center", gap:10 }}>
        {/* Avatar colorido */}
        <div style={{
          width:32, height:32, borderRadius:"50%",
          background: meme.authorColor,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:900, color:"#fff",
          flexShrink:0,
          border:"1.5px solid rgba(255,255,255,.1)",
        }}>
          {meme.author[0].toUpperCase()}
        </div>

        <div style={{ flex:1, overflow:"hidden" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#ccc", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {meme.author}
          </div>
          <div style={{ fontSize:10, color:"#444", fontFamily:"monospace" }}>{meme.date}</div>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={e=>{ e.stopPropagation(); setLiked(l=>!l); }}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, color: liked ? RED : "#555", fontSize:13, fontWeight:700, fontFamily:"'Bebas Neue',sans-serif", padding:0, letterSpacing:.5 }}>
            {liked?"❤️":"🤍"} <span>{fmt(meme.likes)}</span>
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:4, color:"#444", fontSize:12, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:.5 }}>
            💬 {fmt(meme.comments)}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:3, color:"#333", fontSize:11, fontFamily:"monospace" }}>
            👁 {meme.views}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MODAL DE MEME EXPANDIDO ───────────────────────────────────
function MemeModal({ meme, onClose, currentUser, requireAuth, addToast }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id:"c1", user:"darkfan99", text:"KKKKKKKKKK IGUAL EU TODO DIA", ts:"há 2h", color:"#7c3aed" },
    { id:"c2", user:"glitch_arte", text:"isso é muito real mano 💀", ts:"há 5h", color:"#dc2626" },
  ]);
  const [liked, setLiked] = useState(false);

  function send() {
    if (!currentUser) { requireAuth(); return; }
    if (!comment.trim()) return;
    setComments(cs=>[...cs, { id:uid(), user:currentUser.name, text:comment.trim(), ts:"agora", color:currentUser.color }]);
    addToast("Comentário enviado!","ok");
    setComment("");
  }

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.95)", zIndex:800, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ width:"100%", maxWidth:560, background:"#0a0a0a", border:"1.5px solid #1e1e1e", borderRadius:"20px 20px 0 0", maxHeight:"92vh", overflowY:"auto", paddingBottom:20 }}>
        {/* Handle bar */}
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 8px" }}>
          <div style={{ width:40, height:4, borderRadius:2, background:"#2a2a2a" }}/>
        </div>

        {/* Imagem */}
        <div style={{ position:"relative" }}>
          <img src={meme.img} alt="" style={{ width:"100%", maxHeight:300, objectFit:"cover", display:"block" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,.9) 0%, transparent 60%)" }}/>
          <div style={{ position:"absolute", bottom:16, left:16, right:16 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:WHITE, textShadow:"2px 2px 0 #000", lineHeight:1.1, letterSpacing:.8 }}>{meme.title}</div>
            {meme.subtitle && <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:RED, letterSpacing:.8, textShadow:"1px 1px 0 #000", marginTop:4 }}>{meme.subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ position:"absolute", top:12, right:12, width:32, height:32, borderRadius:"50%", background:"rgba(0,0,0,.7)", border:"1px solid #333", color:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Ações */}
        <div style={{ display:"flex", gap:8, padding:"12px 16px" }}>
          {[
            { icon:liked?"❤️":"🤍", label: liked?"Curtido":"Curtir", onClick:()=>setLiked(l=>!l), active:liked },
            { icon:"🔗", label:"Compartilhar", onClick:()=>{ navigator.clipboard?.writeText("https://socialplexy.com/m/"+meme.id).catch(()=>{}); addToast("Link copiado!","ok"); } },
            { icon:"⬇️", label:"Salvar", onClick:()=>addToast("Salvo!","ok") },
          ].map((a,i)=>(
            <button key={i} onClick={a.onClick} style={{ flex:1, padding:"9px 0", background: a.active ? RED+"22" : "#111", border:`1.5px solid ${a.active?RED:"#1e1e1e"}`, borderRadius:10, cursor:"pointer", color: a.active ? RED : "#666", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:.5, display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .15s" }}>
              <span style={{ fontSize:18 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>

        {/* Comentários */}
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#e0e0e0", letterSpacing:.8, marginBottom:12 }}>
            💬 COMENTÁRIOS ({comments.length})
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder={currentUser?"Escreva algo engraçado...":"Faça login pra comentar"} onClick={()=>!currentUser&&requireAuth()}
              style={{ flex:1, background:"#111", border:"1.5px solid #1e1e1e", borderRadius:10, padding:"10px 13px", color:"#e8e8e8", fontSize:13, fontFamily:"'Bebas Neue',sans-serif", outline:"none", letterSpacing:.3 }}
              onKeyDown={e=>e.key==="Enter"&&send()}
              onFocus={e=>e.target.style.borderColor=RED} onBlur={e=>e.target.style.borderColor="#1e1e1e"}/>
            <button onClick={send} style={{ padding:"0 16px", background:RED, color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:.5, fontWeight:700 }}>ENVIAR</button>
          </div>
          {comments.map(c=>(
            <div key={c.id} style={{ display:"flex", gap:10, marginBottom:12, paddingBottom:12, borderBottom:"1px solid #0d0d0d" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#fff", flexShrink:0 }}>{c.user[0].toUpperCase()}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#aaa", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:.5, marginBottom:2 }}>{c.user}</div>
                <div style={{ fontSize:13, color:"#777", lineHeight:1.5 }}>{c.text}</div>
                <div style={{ fontSize:10, color:"#333", marginTop:3, fontFamily:"monospace" }}>{c.ts}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AUTH MODAL ────────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [age, setAge]   = useState("");

  function submit() {
    if (!name.trim() || !age) return;
    const colors = ["#dc2626","#7c3aed","#059669","#d97706","#0891b2","#be185d"];
    onSuccess({ id:uid(), name:name.trim(), age:Number(age), color:colors[Math.floor(Math.random()*colors.length)] });
  }

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(8px)" }}>
      <div style={{ background:"#0a0a0a", border:"1.5px solid #1e1e1e", borderRadius:20, padding:"28px 22px", width:"100%", maxWidth:360, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#141414", border:"1px solid #222", borderRadius:"50%", width:28, height:28, cursor:"pointer", color:"#555", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:16 }}><Windmill size={40}/></div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:1, marginBottom:4, color:WHITE }}>ENTRAR NA PLEXY</div>
        <div style={{ fontSize:12, color:"#555", marginBottom:20 }}>Crie sua conta para curtir e comentar.</div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome de usuário" style={{ width:"100%", background:"#111", border:"1.5px solid #1e1e1e", borderRadius:10, padding:"11px 13px", color:"#e8e8e8", fontSize:14, fontFamily:"monospace", outline:"none", marginBottom:10, boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=RED} onBlur={e=>e.target.style.borderColor="#1e1e1e"}/>
        <input value={age} onChange={e=>setAge(e.target.value)} type="number" placeholder="Sua idade" style={{ width:"100%", background:"#111", border:"1.5px solid #1e1e1e", borderRadius:10, padding:"11px 13px", color:"#e8e8e8", fontSize:14, fontFamily:"monospace", outline:"none", marginBottom:18, boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=RED} onBlur={e=>e.target.style.borderColor="#1e1e1e"}/>
        <button onClick={submit} style={{ width:"100%", padding:"13px", background:RED, color:"#fff", border:"none", borderRadius:11, fontSize:15, fontWeight:900, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1.5 }}>
          CRIAR CONTA →
        </button>
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────
function Toasts({ list }) {
  return (
    <div style={{ position:"fixed", bottom:86, left:"50%", transform:"translateX(-50%)", zIndex:9999, display:"flex", flexDirection:"column", gap:6, alignItems:"center", pointerEvents:"none" }}>
      {list.map(t=>(
        <div key={t.id} style={{ background:"#111", border:`1.5px solid ${t.type==="ok"?LIME:RED}`, borderRadius:40, padding:"8px 18px", fontSize:12, fontWeight:700, color:t.type==="ok"?LIME:RED, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1, boxShadow:"0 8px 32px #000a", animation:"fadeUp .2s ease", whiteSpace:"nowrap" }}>
          {t.type==="ok"?"✓ ":"✕ "}{t.text.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────
export default function SocialPlexy() {
  const [activeMeme, setActiveMeme] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [toasts, setToasts]   = useState([]);
  const [tab, setTab]         = useState("foryou");
  const [search, setSearch]   = useState("");
  const [memes, setMemes]     = useState(MEMES);

  const TABS = [
    { id:"foryou",  label:"PARA VOCÊ" },
    { id:"trending",label:"🔥 TRENDING" },
    { id:"dark",    label:"🌑 DARK ARTS" },
    { id:"humor",   label:"😂 HUMOR" },
  ];

  const filtered = tab==="foryou" ? memes
    : tab==="trending" ? memes.filter(m=>["TRENDING","VIRAL"].includes(m.tag))
    : tab==="dark"     ? memes.filter(m=>["DARK ARTS","MISTÉRIO","CONSPIRAÇÃO"].includes(m.tag))
    : memes.filter(m=>m.tag==="HUMOR");

  function addToast(text, type="info") {
    const t = { id:uid(), text, type };
    setToasts(ts=>[...ts,t]);
    setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==t.id)), 2600);
  }

  function requireAuth() { setShowAuth(true); }

  function authSuccess(user) {
    setCurrentUser(user);
    setShowAuth(false);
    addToast("Bem-vindo, "+user.name+"!","ok");
  }

  // Upload meme
  const uploadRef = useRef();
  function handleUpload(e) {
    if (!currentUser) { requireAuth(); return; }
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const novo = {
      id: uid(), type:"gif",
      title: f.name.replace(/\.[^.]+$/,"").toUpperCase(),
      subtitle: "enviado por " + currentUser.name,
      img: url,
      views:"0", likes:"0", comments:0,
      tag:"NOVO", tagColor:LIME,
      author:currentUser.name, authorColor:currentUser.color,
      date:"18 abr 2026",
    };
    setMemes(ms=>[novo,...ms]);
    addToast("Meme publicado!","ok");
    e.target.value="";
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        html, body { background:${BG}; color:${WHITE}; min-height:100vh; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { width:2px; }
        ::-webkit-scrollbar-track { background:#080808; }
        ::-webkit-scrollbar-thumb { background:#222; border-radius:2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px) translateX(-50%)} to{opacity:1;transform:translateY(0) translateX(-50%)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .tab-btn {
          padding: 8px 18px;
          border-radius: 40px;
          border: 1.5px solid #1a1a1a;
          background: transparent;
          color: #444;
          font-size: 11px;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
          cursor: pointer;
          white-space: nowrap;
          transition: all .15s;
        }
        .tab-btn:hover { border-color:#333; color:#888; }
        .tab-btn.active { background:${RED}; color:${WHITE}; border-color:${RED}; }
        .nav-btn {
          display: flex; flex-direction:column; align-items:center; gap:3px;
          cursor:pointer; color:#333; font-size:10px;
          font-family:'Bebas Neue',sans-serif; letter-spacing:.8px;
          background:none; border:none; padding:4px 8px; transition:color .15s;
          min-width:48px;
        }
        .nav-btn.active { color:${RED}; }
        .nav-btn:hover { color:#666; }
        .nav-btn span { font-size:9px; }
        .meme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        @media (max-width: 600px) {
          .meme-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header style={{ position:"sticky", top:0, zIndex:300, background:"rgba(0,0,0,.97)", backdropFilter:"blur(16px)", borderBottom:`1px solid #111`, height:54, display:"flex", alignItems:"center", padding:"0 16px", gap:12 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, userSelect:"none" }}>
          <Windmill size={26}/>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:1.5, color:WHITE }}>
            SOCIAL<span style={{ color:RED }}>PLEXY</span>
          </span>
        </div>

        {/* Search */}
        <div style={{ flex:1, maxWidth:360, position:"relative" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Pesquisar memes..."
            style={{ width:"100%", background:"#0d0d0d", border:"1.5px solid #161616", borderRadius:40, padding:"7px 16px 7px 14px", color:"#e8e8e8", fontSize:12, fontFamily:"'JetBrains Mono',monospace", outline:"none", transition:"border-color .15s" }}
            onFocus={e=>e.target.style.borderColor=RED} onBlur={e=>e.target.style.borderColor="#161616"}/>
        </div>

        {/* User */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          {currentUser ? (
            <div style={{ width:34, height:34, borderRadius:"50%", background:currentUser.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:"#fff", border:"2px solid rgba(255,255,255,.1)", cursor:"pointer" }}>
              {currentUser.name[0].toUpperCase()}
            </div>
          ) : (
            <button onClick={()=>setShowAuth(true)} style={{ padding:"7px 16px", background:RED, color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:1 }}>
              ENTRAR
            </button>
          )}
        </div>
      </header>

      {/* ── TABS ────────────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:6, padding:"10px 16px", overflowX:"auto", scrollbarWidth:"none", background:BG, borderBottom:"1px solid #0a0a0a", position:"sticky", top:54, zIndex:200 }}>
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── FEED ────────────────────────────────────────────────── */}
      <main style={{ padding:"16px 16px 96px", maxWidth:1200, margin:"0 auto" }}>
        {/* Banner topo estilo TepiCine */}
        <div style={{
          background:"linear-gradient(135deg,#1a0000,#0d0000)",
          border:"2px solid "+RED,
          borderRadius:14,
          padding:"14px 20px",
          marginBottom:20,
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:12,
          flexWrap:"wrap",
        }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:WHITE, letterSpacing:1.5, textShadow:"0 0 20px "+RED+"88" }}>
              🔥 10.000+ MEMES E GIFs GRATUITOS!
            </div>
            <div style={{ fontSize:12, color:"#666", fontFamily:"'JetBrains Mono',monospace", marginTop:4 }}>
              Dark arts · Mistério · Humor · Conspiração
            </div>
          </div>
          <div style={{
            background: RED,
            color:"#fff",
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:14,
            letterSpacing:1.5,
            padding:"8px 20px",
            borderRadius:8,
            flexShrink:0,
          }}>
            GRÁTIS
          </div>
        </div>

        {/* Grid de memes */}
        <div className="meme-grid">
          {(search ? memes.filter(m=>m.title.toLowerCase().includes(search.toLowerCase())) : filtered).map(m=>(
            <MemeCard key={m.id} meme={m} onClick={()=>setActiveMeme(m)}/>
          ))}
        </div>

        {filtered.length===0 && !search && (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#222", fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1 }}>
            NADA AQUI AINDA
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ──────────────────────────────────────────── */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(0,0,0,.98)", backdropFilter:"blur(20px)", borderTop:"1px solid #111", display:"flex", justifyContent:"space-around", alignItems:"center", padding:"8px 0 18px", zIndex:200 }}>
        <button className={`nav-btn${tab==="foryou"?" active":""}`} onClick={()=>setTab("foryou")}>
          <span style={{ fontSize:20 }}>🏠</span>
          <span>INÍCIO</span>
        </button>
        <button className={`nav-btn${tab==="trending"?" active":""}`} onClick={()=>setTab("trending")}>
          <span style={{ fontSize:20 }}>🔥</span>
          <span>TRENDS</span>
        </button>

        {/* Upload central */}
        <div style={{ position:"relative" }}>
          <input ref={uploadRef} type="file" accept="image/*,video/gif" style={{ display:"none" }} onChange={handleUpload}/>
          <button onClick={()=>currentUser?uploadRef.current.click():requireAuth()} style={{
            width:54, height:54, borderRadius:"50%",
            background:`linear-gradient(135deg,${RED},#ff6600)`,
            border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            marginTop:-14, flexShrink:0,
            boxShadow:`0 0 30px ${RED}88`,
            fontSize:24,
            transition:"transform .15s, box-shadow .15s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow=`0 0 40px ${RED}`; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`0 0 30px ${RED}88`; }}
          >
            +
          </button>
        </div>

        <button className={`nav-btn${tab==="dark"?" active":""}`} onClick={()=>setTab("dark")}>
          <span style={{ fontSize:20 }}>🌑</span>
          <span>DARK</span>
        </button>
        <button className="nav-btn" onClick={()=>currentUser?null:requireAuth()}>
          <span style={{ fontSize:20 }}>{currentUser?"😈":"👤"}</span>
          <span>PERFIL</span>
        </button>
      </nav>

      {/* ── MODALS ──────────────────────────────────────────────── */}
      {activeMeme && (
        <MemeModal meme={activeMeme} onClose={()=>setActiveMeme(null)} currentUser={currentUser} requireAuth={requireAuth} addToast={addToast}/>
      )}
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onSuccess={authSuccess}/>}
      <Toasts list={toasts}/>
    </>
  );
}
