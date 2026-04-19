"use client";
import { useState, useEffect, useRef } from "react";

const DOMAIN = "@plexysocial.com";
const ACCENT = "#C8FF00";
const ACCENT2 = "#FF2D55";
const CATS = ["Para você","Trending","Dark Arts","Mistério","Tecnologia","Natureza","Ciência","História"];

function ageRating(a) {
  const n = Number(a);
  if (n < 10) return { label:"Livre", color:"#22c55e" };
  if (n < 14) return { label:"10+",  color:"#eab308" };
  if (n < 16) return { label:"14+",  color:"#f97316" };
  if (n < 18) return { label:"16+",  color:"#ef4444" };
  return       { label:"18+",  color:"#a855f7" };
}
function uid() { return Math.random().toString(36).slice(2,10); }
function fmt(n) {
  if (n>=1e6) return (n/1e6).toFixed(1)+"M";
  if (n>=1e3) return (n/1e3).toFixed(1)+"K";
  return String(n);
}
function fmtTime(s) {
  const m=Math.floor(s/60), sec=s%60;
  return `${m}:${sec.toString().padStart(2,"0")}`;
}

// ─── BOTS COM THUMBNAILS VISUAIS ──────────────────────────────
const BOTS = [
  { id:"bot1", name:"Nexus_1023", email:"nexus1023"+DOMAIN, age:22,
    bio:"Explorando os limites do digital e do real.", color:"#7c3aed",
    initials:"N", verified:true, joined:"05 set 2025", followers:12400, photo:null,
    bannerGrad:"linear-gradient(135deg,#1a0040,#7c3aed,#3b0080)" },
  { id:"bot2", name:"Void_8472", email:"void8472"+DOMAIN, age:25,
    bio:"Arte sombria, experimental e fenômenos inexplicáveis.", color:"#dc2626",
    initials:"V", verified:true, joined:"05 set 2025", followers:8900, photo:null,
    bannerGrad:"linear-gradient(135deg,#200000,#dc2626,#400000)" },
];

// Thumbnails visuais animados em SVG/CSS para cada vídeo
const VIDEO_THUMBS = {
  v1: { type:"ocean", label:"🌊", grad:"linear-gradient(180deg,#000d1a 0%,#001a3a 40%,#003366 70%,#0055a0 100%)", particles:"#4fc3f7" },
  v2: { type:"glitch", label:"⚡", grad:"linear-gradient(135deg,#0d0020,#1a0040,#2d0066)", particles:"#a855f7" },
  v3: { type:"radio", label:"📡", grad:"linear-gradient(135deg,#0a0500,#1a0e00,#2d1800)", particles:"#f59e0b" },
  v4: { type:"shadow", label:"👤", grad:"linear-gradient(135deg,#050510,#0a0a20,#0f0f30)", particles:"#8b5cf6" },
  v5: { type:"arch", label:"🏛️", grad:"linear-gradient(135deg,#0a0600,#1a0e00,#2d2000)", particles:"#d97706" },
  v6: { type:"entity", label:"👁️", grad:"linear-gradient(135deg,#07000f,#0f001a,#180030)", particles:"#9333ea" },
  v7: { type:"code", label:"💻", grad:"linear-gradient(135deg,#0d0000,#1a0000,#2d0000)", particles:"#ef4444" },
  v8: { type:"echo", label:"🔊", grad:"linear-gradient(135deg,#000a0a,#001515,#002020)", particles:"#06b6d4" },
};

const INIT_VIDEOS = [
  { id:"v1", title:"A Escuridão do Oceano Profundo", desc:"Uma jornada às profundezas onde a luz nunca chega. Criaturas jamais catalogadas habitam estas águas.", authorId:"bot1", dur:48, views:128400, likes:4820, cat:"Mistério", short:false, comments:[], date:"12 abr 2026", tags:["oceano","dark","mistério"], videoUrl:null },
  { id:"v2", title:"Glitch", desc:"Curto experimental sobre falhas digitais e realidade fragmentada.", authorId:"bot2", dur:18, views:89200, likes:6100, cat:"Dark Arts", short:true, comments:[], date:"15 abr 2026", tags:["glitch","arte","digital"], videoUrl:null },
  { id:"v3", title:"Frequências Ocultas", desc:"Investigação sobre frequências de rádio suprimidas por governos.", authorId:"bot1", dur:52, views:210000, likes:9300, cat:"Mistério", short:false, comments:[], date:"10 abr 2026", tags:["rádio","conspiração","oculto"], videoUrl:null },
  { id:"v4", title:"Sombra", desc:"Curto artístico sobre isolamento e identidade digital.", authorId:"bot2", dur:22, views:44000, likes:2800, cat:"Dark Arts", short:true, comments:[], date:"17 abr 2026", tags:["arte","sombra","identidade"], videoUrl:null },
  { id:"v5", title:"Arquitetura Proibida", desc:"Edifícios apagados dos mapas, bunkers secretos e construções proibidas.", authorId:"bot1", dur:61, views:305000, likes:14200, cat:"História", short:false, comments:[], date:"08 abr 2026", tags:["arquitetura","história","segredo"], videoUrl:null },
  { id:"v6", title:"Entidade", desc:"Animação experimental sobre consciência e dissolução.", authorId:"bot2", dur:15, views:67000, likes:5500, cat:"Dark Arts", short:true, comments:[], date:"16 abr 2026", tags:["entidade","animação","dark"], videoUrl:null },
  { id:"v7", title:"Código Vermelho", desc:"Os algoritmos que controlam o que você vê na internet.", authorId:"bot1", dur:55, views:180000, likes:7600, cat:"Tecnologia", short:false, comments:[], date:"05 abr 2026", tags:["tecnologia","algoritmo","controle"], videoUrl:null },
  { id:"v8", title:"Eco", desc:"O som do silêncio — experiência sonora e visual.", authorId:"bot2", dur:28, views:33000, likes:3100, cat:"Dark Arts", short:true, comments:[], date:"14 abr 2026", tags:["som","silêncio","arte"], videoUrl:null },
];

// ─── GIF MEMES EMOJIS (substituindo GIFs externos) ────────────
const MEME_GIFS = ["😱","🤯","💀","👀","🫠","🔥","⚡","🌀","👾","🎭","🕳️","🌑"];

// ─── THUMBNAIL VISUAL COMPONENT ───────────────────────────────
function VisualThumb({ videoId, short, dur, showBadge=true, onClick, big=false }) {
  const th = VIDEO_THUMBS[videoId] || { label:"🎬", grad:"linear-gradient(135deg,#111,#222)", particles:"#fff" };
  const [tick, setTick] = useState(0);
  const ratio = short ? "9/16" : "16/9";
  const pts = useRef(Array.from({length:8},()=>({ x:Math.random()*100, y:Math.random()*100, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, s:Math.random()*4+2 })));

  useEffect(()=>{
    const id = setInterval(()=>setTick(t=>t+1), 80);
    return ()=>clearInterval(id);
  },[]);

  useEffect(()=>{
    pts.current = pts.current.map(p=>{
      let nx=p.x+p.vx, ny=p.y+p.vy;
      if(nx<0||nx>100) p.vx*=-1;
      if(ny<0||ny>100) p.vy*=-1;
      return {...p,x:Math.max(0,Math.min(100,nx)),y:Math.max(0,Math.min(100,ny))};
    });
  },[tick]);

  return (
    <div onClick={onClick} style={{ aspectRatio:ratio, background:th.grad, borderRadius:big?12:10, position:"relative", cursor:onClick?"pointer":"default", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      {/* Partículas animadas */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {pts.current.map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r={p.s*.4} fill={th.particles} opacity={0.4+Math.sin(tick/8+i)*0.3}/>
        ))}
        {/* Linhas de conexão */}
        {pts.current.slice(0,4).map((p,i)=>(
          <line key={`l${i}`} x1={p.x} y1={p.y} x2={pts.current[(i+1)%4].x} y2={pts.current[(i+1)%4].y} stroke={th.particles} strokeWidth="0.3" opacity="0.2"/>
        ))}
      </svg>

      {/* Ícone central grande */}
      <div style={{ fontSize:big?48:28, filter:"drop-shadow(0 0 12px "+th.particles+"88)", userSelect:"none", zIndex:2, transform:`scale(${1+Math.sin(tick/12)*.05})`, transition:"transform .1s" }}>
        {th.label}
      </div>

      {/* Overlay gradiente bottom */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 50%)", zIndex:3 }}/>

      {/* SHORT badge */}
      {showBadge && short && (
        <div style={{ position:"absolute", top:8, left:8, background:ACCENT2, color:"#fff", fontSize:9, fontWeight:900, padding:"2px 6px", borderRadius:4, letterSpacing:1, zIndex:4, fontFamily:"'Space Grotesk',sans-serif" }}>SHORT</div>
      )}

      {/* Duração */}
      <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,.85)", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4, zIndex:4, fontFamily:"monospace" }}>
        {fmtTime(dur)}
      </div>

      {/* Play button */}
      {onClick && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:4, opacity:0 }} className="thumb-play">
          <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"1.5px solid rgba(255,255,255,.3)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" fill="#fff" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AVATAR ────────────────────────────────────────────────────
function Avatar({ user, size=36 }) {
  if (!user) return <div style={{ width:size, height:size, borderRadius:"50%", background:"#1a1a1a", flexShrink:0 }}/>;
  if (user.photo) return <img src={user.photo} alt="" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:user.color||"#333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:900, color:"#fff", flexShrink:0, border:"1.5px solid rgba(255,255,255,.1)", letterSpacing:"-1px" }}>
      {(user.initials||user.name?.[0]||"?").toUpperCase()}
    </div>
  );
}

// ─── TOASTS ────────────────────────────────────────────────────
function Toasts({ list }) {
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", zIndex:9999, display:"flex", flexDirection:"column", gap:6, alignItems:"center", pointerEvents:"none" }}>
      {list.map(t=>(
        <div key={t.id} style={{ background:"#111", border:`1.5px solid ${t.type==="ok"?ACCENT:t.type==="err"?ACCENT2:"#333"}`, borderRadius:40, padding:"8px 18px", fontSize:12, fontWeight:700, color:t.type==="ok"?ACCENT:t.type==="err"?ACCENT2:"#ccc", display:"flex", alignItems:"center", gap:6, boxShadow:"0 8px 32px #000a", animation:"toastIn .2s ease", whiteSpace:"nowrap", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:.3 }}>
          {t.type==="ok"?"✓":t.type==="err"?"✗":"→"} {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── WINDMILL LOGO ─────────────────────────────────────────────
function Windmill({ size=30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="5" fill={ACCENT}/>
      <path d="M32 27C30 18 24 10 16 6C22 14 32 27 32 27Z" fill={ACCENT} opacity="0.9"/>
      <path d="M37 32C46 30 54 24 58 16C50 22 37 32 37 32Z" fill={ACCENT} opacity="0.9"/>
      <path d="M32 37C34 46 40 54 48 58C42 50 32 37 32 37Z" fill={ACCENT} opacity="0.9"/>
      <path d="M27 32C18 34 10 40 6 48C14 42 27 32 27 32Z" fill={ACCENT} opacity="0.9"/>
      <rect x="30.5" y="37" width="3" height="22" rx="1.5" fill="white" opacity=".5"/>
      <rect x="24" y="57" width="16" height="3" rx="1.5" fill="white" opacity=".5"/>
    </svg>
  );
}

// ─── VIDEO CARD (cubo/quadrado, TikTok+YT) ────────────────────
function VideoCard({ video, allUsers, onClick }) {
  const author = allUsers.find(u=>u.id===video.authorId);
  const [hov, setHov] = useState(false);

  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"#0c0c0c", border:`1.5px solid ${hov?"#2a2a2a":"#161616"}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-3px) scale(1.01)":"none", transition:"all .2s cubic-bezier(.4,0,.2,1)", boxShadow:hov?"0 8px 32px rgba(0,0,0,.6)":"none" }}>

      {/* Thumbnail */}
      <div style={{ position:"relative" }}>
        <VisualThumb videoId={video.id} short={video.short} dur={video.dur} showBadge={true}/>
      </div>

      {/* Info */}
      <div style={{ padding:"10px 12px 12px" }}>
        {/* Título com fonte bold */}
        <div style={{ fontSize:13, fontWeight:800, lineHeight:1.4, marginBottom:8, color:"#f0f0f0", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"-.3px" }}>
          {video.title}
        </div>

        {/* Autor + data + views — como TikTok */}
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <Avatar user={author} size={22}/>
          <div style={{ flex:1, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#888", fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{author?.name}</span>
              {author?.verified && <span style={{ fontSize:8, background:"#3b82f6", color:"#fff", borderRadius:"50%", width:12, height:12, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✓</span>}
            </div>
            <div style={{ fontSize:10, color:"#404040", fontFamily:"monospace" }}>{video.date} · 👁 {fmt(video.views)}</div>
          </div>
          <div style={{ fontSize:10, color:"#303030", background:"#111", border:"1px solid #1a1a1a", borderRadius:4, padding:"1px 6px", fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
            {video.cat}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHORT CARD (cubo vertical) ────────────────────────────────
function ShortCard({ video, allUsers, onClick }) {
  const author = allUsers.find(u=>u.id===video.authorId);
  const [hov, setHov] = useState(false);

  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ flexShrink:0, width:130, cursor:"pointer", transform:hov?"scale(1.04)":"scale(1)", transition:"transform .2s" }}>
      <div style={{ borderRadius:12, overflow:"hidden", border:`1.5px solid ${hov?ACCENT2+"44":"#1a1a1a"}`, position:"relative" }}>
        <VisualThumb videoId={video.id} short={true} dur={video.dur} showBadge={false}/>
      </div>
      {/* Info abaixo do short */}
      <div style={{ marginTop:6, padding:"0 2px" }}>
        <div style={{ fontSize:11, fontWeight:800, color:"#e0e0e0", lineHeight:1.35, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"-.2px" }}>
          {video.title}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
          <Avatar user={author} size={14}/>
          <span style={{ fontSize:10, color:"#555", fontFamily:"'Space Grotesk',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{author?.name}</span>
        </div>
        <div style={{ fontSize:9, color:"#333", marginTop:1, fontFamily:"monospace" }}>{video.date}</div>
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────
function Modal({ onClose, children, wide }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(8px)" }}>
      <div style={{ background:"#0a0a0a", border:"1.5px solid #1e1e1e", borderRadius:20, padding:"26px 22px", width:"100%", maxWidth:wide?560:400, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#141414", border:"1px solid #2a2a2a", borderRadius:"50%", width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#555" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width:"100%", background:"#111", border:"1.5px solid #1e1e1e", borderRadius:10, padding:"11px 13px", color:"#e8e8e8", fontSize:14, fontFamily:"'Space Grotesk',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color .15s" };

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:13 }}>
      <div style={{ fontSize:10, fontWeight:700, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:5, fontFamily:"'Space Grotesk',sans-serif" }}>{label}</div>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ width:"100%", padding:"13px", background:danger?ACCENT2:hov?"#d4ff00":ACCENT, color:"#000", border:"none", borderRadius:11, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:.3, transition:"background .15s", ...style }}>
      {children}
    </button>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [age, setAge]   = useState("");
  const [emailN, setEmailN] = useState("");
  const emailFull = emailN ? `${emailN.toLowerCase().replace(/[^a-z0-9._-]/g,"")}${DOMAIN}` : "";
  const rating = age ? ageRating(age) : null;

  function submit() {
    if (!name.trim()||!age||!emailN.trim()) return;
    const colors = ["#7c3aed","#dc2626","#059669","#d97706","#0891b2","#be185d","#c026d3"];
    onSuccess({ id:uid(), name:name.trim(), email:emailFull, age:Number(age), bio:"", color:colors[Math.floor(Math.random()*colors.length)], initials:name.trim()[0].toUpperCase(), verified:false, joined:"18 abr 2026", followers:0, photo:null, bannerGrad:"linear-gradient(135deg,#0a0a0a,#1a1a1a)" });
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:"center", marginBottom:18 }}><Windmill size={40}/></div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800, marginBottom:4, letterSpacing:"-.5px" }}>Criar Email Plex</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:20, lineHeight:1.6 }}>Sua identidade única na Social Plexy.</div>
      <Field label="Nome de usuário"><input style={inputStyle} placeholder="darkvoid99" value={name} onChange={e=>setName(e.target.value)}/></Field>
      <Field label="Idade"><input style={inputStyle} type="number" placeholder="Sua idade" value={age} onChange={e=>setAge(e.target.value)} min="1" max="120"/></Field>
      {rating && <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:rating.color+"22", color:rating.color, fontSize:11, fontWeight:700, marginBottom:13, fontFamily:"'Space Grotesk',sans-serif" }}>🛡 Classificação: {rating.label}</div>}
      <Field label="Nome do Email Plex"><input style={inputStyle} placeholder="nomeescolhido" value={emailN} onChange={e=>setEmailN(e.target.value)}/></Field>
      {emailFull && <div style={{ background:"#0d0d0d", border:"1px solid #1e1e1e", borderRadius:8, padding:"10px 13px", fontSize:12, color:ACCENT, marginBottom:13, fontFamily:"monospace", letterSpacing:".5px" }}>{emailFull}</div>}
      <PrimaryBtn onClick={submit}>Criar conta e entrar →</PrimaryBtn>
    </Modal>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────
function UploadModal({ onClose, user, onUpload }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc]   = useState("");
  const [cat, setCat]     = useState("Dark Arts");
  const [isShort, setIsShort] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    if (!title) setTitle(f.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," "));
  }

  function submit() {
    if (!title.trim()) return;
    onUpload({ id:uid(), title:title.trim(), desc:desc.trim(), authorId:user.id, dur:isShort?Math.floor(Math.random()*55+5):Math.floor(Math.random()*60+45), views:0, likes:0, cat, short:isShort, comments:[], date:"18 abr 2026", tags:[cat.toLowerCase()], videoUrl:preview });
    onClose();
  }

  return (
    <Modal onClose={onClose} wide>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, marginBottom:4, letterSpacing:"-.3px" }}>📤 Publicar vídeo</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:18 }}>Selecione o vídeo da sua galeria.</div>
      <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={pickFile}/>
      <div onClick={()=>fileRef.current.click()} style={{ border:"2px dashed #222", borderRadius:12, padding:"24px 16px", textAlign:"center", cursor:"pointer", marginBottom:14, background:"#080808", transition:"border-color .15s" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor=ACCENT} onMouseLeave={e=>e.currentTarget.style.borderColor="#222"}>
        {preview
          ? <video src={preview} style={{ width:"100%", borderRadius:8, maxHeight:200, objectFit:"cover" }}/>
          : <><div style={{ fontSize:32, marginBottom:8 }}>🎬</div><div style={{ fontSize:13, color:"#555" }}>Toque para selecionar um vídeo</div></>
        }
      </div>
      <Field label="Título"><input style={inputStyle} placeholder="Título do vídeo" value={title} onChange={e=>setTitle(e.target.value)}/></Field>
      <Field label="Descrição"><textarea style={{...inputStyle, resize:"none", minHeight:70}} placeholder="Sobre este vídeo..." value={desc} onChange={e=>setDesc(e.target.value)}/></Field>
      <Field label="Categoria">
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{...inputStyle}}>
          {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
        </select>
      </Field>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:"10px 13px", background:"#0d0d0d", border:"1px solid #1e1e1e", borderRadius:10 }}>
        <span style={{ fontSize:13, color:"#888", fontFamily:"'Space Grotesk',sans-serif", flex:1 }}>⚡ É um Short?</span>
        <div onClick={()=>setIsShort(s=>!s)} style={{ width:40, height:22, borderRadius:11, background:isShort?ACCENT:"#222", cursor:"pointer", position:"relative", transition:"background .2s" }}>
          <div style={{ position:"absolute", top:3, left:isShort?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
        </div>
      </div>
      <PrimaryBtn onClick={submit}>Publicar agora</PrimaryBtn>
    </Modal>
  );
}

// ─── EDIT PROFILE ─────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio]   = useState(user.bio||"");
  const [photo, setPhoto] = useState(user.photo);
  const fileRef = useRef();

  function pickPhoto(e) {
    const f = e.target.files[0];
    if (f) setPhoto(URL.createObjectURL(f));
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, marginBottom:18, letterSpacing:"-.3px" }}>✏️ Editar perfil</div>
      <div style={{ textAlign:"center", marginBottom:16 }}>
        <div style={{ position:"relative", display:"inline-block" }} onClick={()=>fileRef.current.click()}>
          <Avatar user={{...user,photo,name}} size={72}/>
          <div style={{ position:"absolute", bottom:0, right:0, background:ACCENT, borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"2px solid #050505" }}>
            <span style={{ fontSize:11 }}>📷</span>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={pickPhoto}/>
      </div>
      <Field label="Nome"><input style={inputStyle} value={name} onChange={e=>setName(e.target.value)}/></Field>
      <Field label="Bio"><textarea style={{...inputStyle,resize:"none",minHeight:70}} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Fale sobre você..."/></Field>
      <PrimaryBtn onClick={()=>onSave({...user,name:name.trim()||user.name,bio,photo})}>Salvar alterações</PrimaryBtn>
    </Modal>
  );
}

// ─── REPORT MODAL ─────────────────────────────────────────────
function ReportModal({ onClose, onReport }) {
  const opts = ["Direitos autorais","Conteúdo impróprio","Conteúdo adulto (+18)","Violência extrema","Desinformação","Spam"];
  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, marginBottom:5 }}>🚩 Denunciar</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:16 }}>Selecione o motivo:</div>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {opts.map(o=>(
          <button key={o} onClick={()=>onReport(o)} style={{ padding:"11px 14px", background:"#0d0d0d", border:"1.5px solid #1e1e1e", borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:"'Space Grotesk',sans-serif", color:"#aaa", fontSize:13, transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT2;e.currentTarget.style.color=ACCENT2;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e1e";e.currentTarget.style.color="#aaa";}}>
            {o}
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ─── NOTIFS PANEL ─────────────────────────────────────────────
function NotifsPanel({ notifs, onClose }) {
  const icons = { like:"❤️", comment:"💬", report:"🚨", system:"🔔", removed:"🗑️" };
  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, marginBottom:16 }}>🔔 Notificações</div>
      {notifs.length===0
        ? <div style={{ color:"#333", textAlign:"center", padding:"24px 0", fontSize:14 }}>Nada por aqui ainda</div>
        : notifs.map((n,i)=>(
          <div key={i} style={{ display:"flex", gap:12, padding:"11px 0", borderBottom:"1px solid #111", alignItems:"flex-start" }}>
            <div style={{ fontSize:20 }}>{icons[n.type]||"🔔"}</div>
            <div>
              <div style={{ fontSize:13, color:"#bbb", lineHeight:1.5, fontFamily:"'Space Grotesk',sans-serif" }}>{n.text}</div>
              <div style={{ fontSize:11, color:"#333", marginTop:2, fontFamily:"monospace" }}>{n.time}</div>
            </div>
          </div>
        ))
      }
    </Modal>
  );
}

// ─── PLAYER PAGE ──────────────────────────────────────────────
function PlayerPage({ video, allUsers, currentUser, setVideos, addNotif, addToast, requireAuth, goBack, goProfile, videos }) {
  const author = allUsers.find(u=>u.id===video.authorId);
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const [comment, setComment] = useState("");
  const [showRep, setShowRep] = useState(false);
  const [memeIdx, setMemeIdx] = useState(Math.floor(Math.random()*MEME_GIFS.length));

  useEffect(()=>{
    let t;
    if (playing) t = setInterval(()=>setProg(p=>p>=100?100:p+0.2),80);
    return ()=>clearInterval(t);
  },[playing]);

  // Rodar meme GIF
  useEffect(()=>{
    const id = setInterval(()=>setMemeIdx(i=>(i+1)%MEME_GIFS.length), 800);
    return ()=>clearInterval(id);
  },[]);

  function like() {
    if (!currentUser) { requireAuth(); return; }
    setLiked(l=>!l);
    setVideos(vs=>vs.map(v=>v.id===video.id?{...v,likes:v.likes+(liked?-1:1)}:v));
  }

  function sendComment() {
    if (!currentUser) { requireAuth(); return; }
    if (!comment.trim()) return;
    const c = { id:uid(), userId:currentUser.id, text:comment.trim(), ts:"agora" };
    setVideos(vs=>vs.map(v=>v.id===video.id?{...v,comments:[...v.comments,c]}:v));
    addNotif({ type:"comment", text:`Novo comentário em "${video.title}"`, time:"agora" });
    addToast("Comentário publicado!","ok");
    setComment("");
  }

  function share() {
    navigator.clipboard?.writeText(`https://socialplexy.com/v/${video.id}`).catch(()=>{});
    addToast("Link copiado!","ok");
  }

  function doReport(reason) {
    setShowRep(false);
    addToast("Denúncia enviada.","info");
    addNotif({ type:"report", text:`Denúncia: "${reason}" — EquipePlexy analisando.`, time:"agora" });
  }

  // Related videos
  const related = videos.filter(v=>v.id!==video.id).slice(0,4);
  const th = VIDEO_THUMBS[video.id] || { label:"🎬", grad:"linear-gradient(135deg,#111,#222)", particles:"#fff" };

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>
      {showRep && <ReportModal onClose={()=>setShowRep(false)} onReport={doReport}/>}

      <button onClick={goBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontSize:13, marginBottom:16, padding:0, fontWeight:600 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg> Voltar
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }} className="player-grid">
        {/* COLUNA ESQUERDA */}
        <div>
          {/* PLAYER PRINCIPAL */}
          <div style={{ borderRadius:16, overflow:"hidden", position:"relative", marginBottom:16, background:th.grad, aspectRatio:video.short?"9/16":"16/9" }}>
            {video.videoUrl
              ? <video src={video.videoUrl} controls style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }}/>
              : <>
                  {/* Fundo animado */}
                  <VisualThumb videoId={video.id} short={video.short} dur={video.dur} showBadge={false} big={true}/>
                  {/* Overlay de controle */}
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", background:"linear-gradient(transparent 40%,rgba(0,0,0,.9))", zIndex:10 }}>
                    {/* Barra de progresso */}
                    <div style={{ padding:"0 16px 8px" }}>
                      <div style={{ height:3, background:"rgba(255,255,255,.15)", borderRadius:2, overflow:"hidden", marginBottom:10, cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)));}}>
                        <div style={{ width:`${prog}%`, height:"100%", background:ACCENT, borderRadius:2, transition:"width .08s" }}/>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        {/* Play/Pause */}
                        <button onClick={()=>setPlaying(p=>!p)} style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.12)", border:"1.5px solid rgba(255,255,255,.2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", backdropFilter:"blur(8px)", flexShrink:0 }}>
                          {playing
                            ? <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                            : <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                        </button>
                        {/* Tempo */}
                        <span style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontFamily:"monospace", flexShrink:0 }}>{fmtTime(Math.floor(prog/100*video.dur))} / {fmtTime(video.dur)}</span>
                        <span style={{ flex:1 }}/>
                        {/* Fullscreen icon */}
                        <button style={{ background:"none", border:"none", color:"rgba(255,255,255,.5)", cursor:"pointer" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
            }
          </div>

          {/* TÍTULO GRANDE */}
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, marginBottom:6, lineHeight:1.3, letterSpacing:"-.4px", color:"#f0f0f0" }}>{video.title}</div>

          {/* META */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:"#404040", display:"flex", alignItems:"center", gap:3, fontFamily:"monospace" }}>👁 {fmt(video.views)}</span>
            <span style={{ color:"#1e1e1e" }}>·</span>
            <span style={{ fontSize:12, color:"#404040", fontFamily:"monospace" }}>{video.date}</span>
            <span style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:5, padding:"2px 8px", fontSize:10, color:"#555", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700 }}>{video.cat}</span>
          </div>

          {/* AÇÕES */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {[
              { icon: liked?"❤️":"🤍", label:`${fmt(video.likes+(liked?1:0))}`, onClick:like, active:liked, color:liked?"#f43f5e":"#555" },
              { icon:"💬", label:`${video.comments.length}`, onClick:null, color:"#555" },
              { icon:"🔗", label:"Compartilhar", onClick:share, color:"#555" },
              { icon:"🚩", label:"Denunciar", onClick:()=>setShowRep(true), color:"#3a1a1a" },
            ].map((a,i)=>(
              <button key={i} onClick={a.onClick||undefined}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#0d0d0d", border:`1.5px solid ${a.active?"#f43f5e33":"#1e1e1e"}`, borderRadius:40, color:a.color, cursor:a.onClick?"pointer":"default", fontSize:13, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, transition:"all .15s" }}
                onMouseEnter={e=>{ if(a.onClick) e.currentTarget.style.borderColor=ACCENT; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=a.active?"#f43f5e33":"#1e1e1e"; }}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>

          {/* DESCRIÇÃO */}
          <div style={{ background:"#080808", border:"1.5px solid #141414", borderRadius:12, padding:"14px 16px", fontSize:13, color:"#666", lineHeight:1.8, marginBottom:20, fontFamily:"'Space Grotesk',sans-serif" }}>
            {video.desc || "Sem descrição."}
          </div>

          {/* TAGS */}
          {video.tags?.length>0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
              {video.tags.map(t=><span key={t} style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:20, padding:"3px 10px", fontSize:11, color:"#444", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600 }}>#{t}</span>)}
            </div>
          )}

          {/* COMENTÁRIOS */}
          <div style={{ fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Space Grotesk',sans-serif", color:"#e0e0e0", letterSpacing:"-.2px" }}>
            💬 Comentários ({video.comments.length})
          </div>

          {/* Input comentário */}
          <div style={{ display:"flex", gap:10, marginBottom:18, alignItems:"flex-start" }}>
            {currentUser && <Avatar user={currentUser} size={32}/>}
            <textarea value={comment} onChange={e=>setComment(e.target.value)} onClick={()=>!currentUser&&requireAuth()} placeholder={currentUser?"Escreva um comentário...":"Faça login para comentar"} rows={2}
              style={{ flex:1, background:"#0d0d0d", border:"1.5px solid #1e1e1e", borderRadius:10, padding:"10px 13px", color:"#e8e8e8", fontSize:13, fontFamily:"'Space Grotesk',sans-serif", outline:"none", resize:"none", transition:"border-color .15s" }}
              onFocus={e=>e.target.style.borderColor=ACCENT} onBlur={e=>e.target.style.borderColor="#1e1e1e"}/>
            <button onClick={sendComment} style={{ padding:"0 16px", height:44, background:ACCENT, color:"#000", border:"none", borderRadius:10, cursor:"pointer", fontWeight:800, fontFamily:"'Space Grotesk',sans-serif", fontSize:13, flexShrink:0 }}>Enviar</button>
          </div>

          {/* Lista de comentários */}
          {video.comments.map(c=>{
            const u = allUsers.find(u=>u.id===c.userId);
            return (
              <div key={c.id} style={{ display:"flex", gap:10, marginBottom:14, paddingBottom:14, borderBottom:"1px solid #0d0d0d" }}>
                <div onClick={()=>goProfile(c.userId)} style={{ cursor:"pointer", flexShrink:0 }}><Avatar user={u} size={32}/></div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span onClick={()=>goProfile(c.userId)} style={{ fontSize:13, fontWeight:700, cursor:"pointer", color:"#ccc", fontFamily:"'Space Grotesk',sans-serif" }}>{u?.name||"Usuário"}</span>
                    <span style={{ fontSize:10, color:"#333", fontFamily:"monospace" }}>{c.ts}</span>
                  </div>
                  <div style={{ fontSize:13, color:"#888", lineHeight:1.6, fontFamily:"'Space Grotesk',sans-serif" }}>{c.text}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUNA DIREITA - SIDEBAR */}
        <div className="hide-sm" style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Card do autor */}
          <div style={{ background:"#080808", border:"1.5px solid #141414", borderRadius:16, overflow:"hidden" }}>
            {/* Banner do autor */}
            <div style={{ height:70, background:author?.bannerGrad||"linear-gradient(135deg,#111,#222)", position:"relative" }}>
              <div style={{ position:"absolute", bottom:-20, left:14 }}>
                <Avatar user={author} size={40}/>
              </div>
            </div>
            <div style={{ padding:"28px 14px 14px" }}>
              <div onClick={()=>goProfile(author?.id)} style={{ cursor:"pointer" }}>
                <div style={{ fontWeight:800, fontSize:15, display:"flex", alignItems:"center", gap:6, fontFamily:"'Space Grotesk',sans-serif", marginBottom:2 }}>
                  {author?.name}
                  {author?.verified && <span style={{ width:16, height:16, background:"#3b82f6", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>✓</span>}
                </div>
                <div style={{ fontSize:12, color:"#444", fontFamily:"monospace" }}>{fmt(author?.followers||0)} seguidores</div>
              </div>
              {author?.bio && <div style={{ fontSize:12, color:"#555", lineHeight:1.6, marginTop:8, fontFamily:"'Space Grotesk',sans-serif" }}>{author.bio}</div>}
            </div>
          </div>

          {/* Zona do criador - MEME GIF animado */}
          <div style={{ background:"#080808", border:"1.5px solid #141414", borderRadius:16, padding:14 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#333", letterSpacing:1, textTransform:"uppercase", marginBottom:10, fontFamily:"'Space Grotesk',sans-serif" }}>Zona do criador</div>
            <div style={{ aspectRatio:"16/9", borderRadius:10, background:th.grad, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10, overflow:"hidden", position:"relative" }}>
              <span style={{ fontSize:48, filter:"drop-shadow(0 0 20px "+th.particles+")", userSelect:"none", animation:"gifBounce 0.8s infinite alternate" }}>{MEME_GIFS[memeIdx]}</span>
              <div style={{ position:"absolute", bottom:6, right:8, fontSize:9, color:"rgba(255,255,255,.2)", fontFamily:"monospace" }}>LIVE</div>
            </div>
          </div>

          {/* Vídeos relacionados */}
          <div style={{ background:"#080808", border:"1.5px solid #141414", borderRadius:16, padding:14 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#333", letterSpacing:1, textTransform:"uppercase", marginBottom:10, fontFamily:"'Space Grotesk',sans-serif" }}>A seguir</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {related.map(rv=>{
                const ra = allUsers.find(u=>u.id===rv.authorId);
                return (
                  <div key={rv.id} onClick={()=>{}} style={{ display:"flex", gap:8, cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.opacity=".7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    <div style={{ flexShrink:0, width:90 }}>
                      <VisualThumb videoId={rv.id} short={rv.short} dur={rv.dur} showBadge={false}/>
                    </div>
                    <div style={{ flex:1, overflow:"hidden" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#ccc", lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", fontFamily:"'Space Grotesk',sans-serif" }}>{rv.title}</div>
                      <div style={{ fontSize:10, color:"#444", marginTop:3, fontFamily:"monospace" }}>{ra?.name} · {fmt(rv.views)} views</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────
function ProfilePage({ userId, allUsers, videos, currentUser, setCurrentUser, setAllUsers, goBack, goPlayer, addToast }) {
  const isOwn = currentUser?.id === userId;
  const user  = allUsers.find(u=>u.id===userId) || currentUser;
  const [editing, setEditing] = useState(false);
  const userVids = videos.filter(v=>v.authorId===user?.id);
  const rating = user ? ageRating(user.age) : null;

  function saveEdit(updated) {
    setAllUsers(us=>us.map(u=>u.id===updated.id?updated:u));
    if (isOwn) setCurrentUser(updated);
    setEditing(false);
    addToast("Perfil atualizado!","ok");
  }

  if (!user) return <div style={{ padding:40, color:"#444", textAlign:"center" }}>Usuário não encontrado.</div>;

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      {editing && <EditProfileModal user={user} onClose={()=>setEditing(false)} onSave={saveEdit}/>}
      <button onClick={goBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontSize:13, marginBottom:16, padding:0, fontWeight:600 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg> Voltar
      </button>

      {/* Banner */}
      <div style={{ height:140, background:user.bannerGrad||`linear-gradient(135deg,${user.color}33,#050505)`, borderRadius:"16px 16px 0 0", border:"1.5px solid #141414", borderBottom:"none", position:"relative" }}>
        <div style={{ position:"absolute", bottom:-44, left:22 }}>
          <Avatar user={user} size={88}/>
        </div>
        {isOwn && (
          <button onClick={()=>setEditing(true)} style={{ position:"absolute", top:12, right:12, display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,0,0,.7)", border:"1.5px solid #2a2a2a", borderRadius:10, padding:"7px 14px", color:"#ccc", cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontSize:12, fontWeight:700, backdropFilter:"blur(8px)" }}>
            ✏️ Editar perfil
          </button>
        )}
      </div>

      {/* Info card */}
      <div style={{ background:"#080808", border:"1.5px solid #141414", borderTop:"none", borderRadius:"0 0 16px 16px", padding:"56px 22px 22px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:800, display:"flex", alignItems:"center", gap:8, marginBottom:4, letterSpacing:"-.5px" }}>
              {user.name}
              {user.verified && <span style={{ width:20, height:20, background:"#3b82f6", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>✓</span>}
            </div>
            <div style={{ fontSize:12, color:"#6d5f9e", fontFamily:"monospace", marginBottom:6 }}>{user.email}</div>
            {user.bio && <div style={{ fontSize:13, color:"#666", maxWidth:500, lineHeight:1.7, fontFamily:"'Space Grotesk',sans-serif" }}>{user.bio}</div>}
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {rating && <div style={{ padding:"5px 12px", borderRadius:20, background:rating.color+"22", color:rating.color, fontSize:11, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>🛡 {rating.label}</div>}
            <div style={{ padding:"5px 14px", borderRadius:20, background:"#111", border:"1px solid #1e1e1e", fontSize:11, color:"#666", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700 }}>👥 {fmt(user.followers)} seguidores</div>
            <div style={{ padding:"5px 14px", borderRadius:20, background:"#111", border:"1px solid #1e1e1e", fontSize:11, color:"#666", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700 }}>📅 {user.joined}</div>
          </div>
        </div>
      </div>

      {/* Vídeos do usuário */}
      <div style={{ marginTop:24 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:3, height:17, background:ACCENT, borderRadius:2, display:"inline-block" }}/>
          Vídeos ({userVids.length})
        </div>
        {userVids.length===0
          ? <div style={{ textAlign:"center", padding:"60px 20px", color:"#333", fontSize:14, fontFamily:"'Space Grotesk',sans-serif" }}>🎬 Nenhum vídeo publicado ainda.</div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
              {userVids.map(v=><VideoCard key={v.id} video={v} allUsers={allUsers} onClick={()=>goPlayer(v.id)}/>)}
            </div>
        }
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function SocialPlexy() {
  const [page, setPage]           = useState("feed");
  const [cat, setCat]             = useState("Para você");
  const [videos, setVideos]       = useState(INIT_VIDEOS);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers]   = useState(BOTS);
  const [showAuth, setShowAuth]   = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs]       = useState([]);
  const [toasts, setToasts]       = useState([]);
  const [activeVid, setActiveVid] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [search, setSearch]       = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const feedVids = cat==="Para você"? videos : videos.filter(v=>v.cat===cat||cat==="Trending");
  const shorts   = feedVids.filter(v=>v.short);
  const longs    = feedVids.filter(v=>!v.short);
  const searchResults = search.length>1 ? videos.filter(v=>v.title.toLowerCase().includes(search.toLowerCase())||v.cat.toLowerCase().includes(search.toLowerCase())) : [];

  function addNotif(n) { setNotifs(ns=>[n,...ns]); }
  function addToast(text,type="info") {
    const t = { id:uid(), text, type };
    setToasts(ts=>[...ts,t]);
    setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==t.id)), 2800);
  }
  function requireAuth() { setShowAuth(true); }
  function authSuccess(user) {
    const fullUser = {...user, bannerGrad:"linear-gradient(135deg,#0a0a0a,#1a1a1a)"};
    setCurrentUser(fullUser);
    setAllUsers(us=>[...us, fullUser]);
    setShowAuth(false);
    addToast(`Bem-vindo, ${user.name}!`,"ok");
  }
  function uploadSuccess(v) {
    setVideos(vs=>[v,...vs]);
    addToast("Vídeo publicado!","ok");
    addNotif({ type:"system", text:`"${v.title}" publicado com sucesso.`, time:"agora" });
  }
  function goPlayer(id) { setActiveVid(id); setPage("player"); }
  function goProfile(id) { setProfileId(id); setPage("profile"); }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#050505;color:#e8e8e8;font-family:'Space Grotesk',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#080808}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gifBounce{from{transform:scale(1) rotate(-3deg)}to{transform:scale(1.08) rotate(3deg)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .cat-btn{padding:7px 16px;border-radius:40px;border:1.5px solid #161616;background:transparent;color:#444;font-size:12px;cursor:pointer;white-space:nowrap;transition:all .18s;font-family:'Space Grotesk',sans-serif;font-weight:600;letter-spacing:.1px}
        .cat-btn:hover{border-color:#2a2a2a;color:#888}
        .cat-btn.active{background:${ACCENT};color:#000;border-color:${ACCENT};font-weight:800}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;color:#333;font-size:10px;font-family:'Space Grotesk',sans-serif;background:none;border:none;padding:5px 10px;transition:color .18s;font-weight:700;letter-spacing:.2px;min-width:48px}
        .nav-btn:hover,.nav-btn.active{color:${ACCENT}}
        .srch-drop{position:absolute;top:calc(100%+8px);left:0;right:0;background:#0a0a0a;border:1.5px solid #1a1a1a;border-radius:14px;z-index:300;overflow:hidden;box-shadow:0 20px 60px #000}
        .srch-item{padding:11px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid #111;transition:background .12s;display:flex;align-items:center;gap:10px;color:#bbb;font-family:'Space Grotesk',sans-serif}
        .srch-item:hover{background:#111}
        .srch-item:last-child{border-bottom:none}
        .thumb-play{transition:opacity .2s}
        div:hover>.thumb-play,.thumb-play:hover{opacity:1!important}
        @media(max-width:640px){.player-grid{grid-template-columns:1fr!important}.hide-sm{display:none!important}}
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,5,5,.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid #0d0d0d", height:56, display:"flex", alignItems:"center", padding:"0 16px", gap:10 }}>
        {/* Logo */}
        <div onClick={()=>setPage("feed")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0, userSelect:"none" }}>
          <Windmill size={26}/>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:15, letterSpacing:"-.5px", color:"#fff" }}>Social<span style={{ color:ACCENT }}>Plexy</span></span>
        </div>

        {/* Search */}
        <div style={{ flex:1, maxWidth:380, position:"relative" }}>
          <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#333", pointerEvents:"none", fontSize:14 }}>🔍</div>
          <input value={search} onChange={e=>{setSearch(e.target.value);setShowSearch(true);}} onFocus={()=>setShowSearch(true)} onBlur={()=>setTimeout(()=>setShowSearch(false),180)}
            placeholder="Pesquisar..."
            style={{ width:"100%", background:"#0d0d0d", border:"1.5px solid #161616", borderRadius:40, padding:"8px 14px 8px 34px", color:"#e8e8e8", fontSize:13, fontFamily:"'Space Grotesk',sans-serif", outline:"none", transition:"border-color .15s" }}
            onFocus={e=>e.target.style.borderColor="#2a2a2a"} onBlur={e=>e.target.style.borderColor="#161616"}/>
          {showSearch && search.length>1 && (
            <div className="srch-drop">
              {searchResults.length===0
                ? <div style={{ padding:16, textAlign:"center", color:"#333", fontSize:13 }}>Nenhum resultado para "{search}"</div>
                : searchResults.map(v=>(
                  <div key={v.id} className="srch-item" onClick={()=>{goPlayer(v.id);setSearch("");}}>
                    <span>🎬</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>{v.title}</div>
                      <div style={{ fontSize:11, color:"#444" }}>{v.cat} · {fmt(v.views)} views</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
          <button onClick={()=>setShowNotifs(true)} style={{ width:34, height:34, borderRadius:"50%", background:"#0d0d0d", border:"1.5px solid #161616", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#555", position:"relative", fontSize:16 }}>
            🔔
            {notifs.length>0 && <span style={{ position:"absolute", top:-3, right:-3, width:16, height:16, background:ACCENT2, borderRadius:"50%", fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #050505", color:"#fff" }}>{Math.min(notifs.length,9)}</span>}
          </button>
          {currentUser
            ? <div onClick={()=>goProfile(currentUser.id)} style={{ cursor:"pointer" }}><Avatar user={currentUser} size={32}/></div>
            : <button onClick={()=>setShowAuth(true)} style={{ padding:"7px 16px", background:ACCENT, color:"#000", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:12, letterSpacing:.3, transition:"background .15s" }} onMouseEnter={e=>e.currentTarget.style.background="#d4ff00"} onMouseLeave={e=>e.currentTarget.style.background=ACCENT}>Entrar</button>
          }
        </div>
      </header>

      {/* ── CATEGORIES ────────────────────────────────────────────── */}
      {page==="feed" && (
        <div style={{ display:"flex", gap:6, padding:"10px 16px", overflowX:"auto", scrollbarWidth:"none", borderBottom:"1px solid #0a0a0a", background:"#050505" }}>
          {CATS.map(c=><button key={c} className={`cat-btn${cat===c?" active":""}`} onClick={()=>setCat(c)}>{c}</button>)}
          <button className="cat-btn" onClick={()=>setPage("terms")}>Termos</button>
          <button className="cat-btn" onClick={()=>setPage("privacy")}>Privacidade</button>
        </div>
      )}

      {/* ── MAIN ──────────────────────────────────────────────────── */}
      <main style={{ padding:"20px 16px 100px", minHeight:"calc(100vh - 56px)", maxWidth:1280, margin:"0 auto" }}>

        {/* FEED */}
        {page==="feed" && (
          <div>
            {/* SHORTS ROW */}
            {shorts.length>0 && (
              <div style={{ marginBottom:32 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:14, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ background:ACCENT2, color:"#fff", fontSize:9, fontWeight:900, padding:"3px 8px", borderRadius:5, letterSpacing:1 }}>SHORT</span>
                  <span style={{ color:"#e0e0e0" }}>Shorts</span>
                </div>
                <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6, scrollbarWidth:"none" }}>
                  {shorts.map(v=><ShortCard key={v.id} video={v} allUsers={allUsers} onClick={()=>goPlayer(v.id)}/>)}
                </div>
              </div>
            )}

            {/* LONG VIDEOS */}
            {longs.length>0 && (
              <>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:14, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:3, height:17, background:ACCENT, borderRadius:2, display:"inline-block" }}/>
                  <span style={{ color:"#e0e0e0" }}>{cat==="Para você"?"Recomendados":cat==="Trending"?"🔥 Em alta":cat}</span>
                  {cat==="Para você" && currentUser && <span style={{ fontSize:11, color:"#333", fontWeight:500 }}>baseado no seu histórico</span>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
                  {longs.map(v=><VideoCard key={v.id} video={v} allUsers={allUsers} onClick={()=>goPlayer(v.id)}/>)}
                </div>
              </>
            )}

            {feedVids.length===0 && (
              <div style={{ textAlign:"center", padding:"80px 20px" }}>
                <div style={{ fontSize:40, marginBottom:14 }}>🎬</div>
                <div style={{ fontWeight:800, fontSize:16, marginBottom:6, fontFamily:"'Space Grotesk',sans-serif" }}>Nenhum vídeo aqui ainda</div>
                <div style={{ fontSize:13, color:"#333" }}>Seja o primeiro a publicar nesta categoria.</div>
              </div>
            )}
          </div>
        )}

        {/* PLAYER */}
        {page==="player" && activeVid && (()=>{
          const v = videos.find(x=>x.id===activeVid);
          if (!v) return null;
          return <PlayerPage video={v} allUsers={allUsers} currentUser={currentUser} setVideos={setVideos} addNotif={addNotif} addToast={addToast} requireAuth={requireAuth} goBack={()=>setPage("feed")} goProfile={goProfile} videos={videos}/>;
        })()}

        {/* PROFILE */}
        {page==="profile" && (
          <ProfilePage userId={profileId} allUsers={allUsers} videos={videos} currentUser={currentUser} setCurrentUser={setCurrentUser} setAllUsers={setAllUsers} goBack={()=>setPage("feed")} goPlayer={goPlayer} addToast={addToast}/>
        )}

        {/* TERMS */}
        {page==="terms" && (
          <div style={{ maxWidth:660, margin:"0 auto" }}>
            <button onClick={()=>setPage("feed")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontSize:13, marginBottom:20, padding:0, fontWeight:600 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg> Voltar
            </button>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, marginBottom:3, letterSpacing:"-.5px" }}>Termos de Uso</div>
            <div style={{ fontSize:12, color:"#333", marginBottom:24, fontFamily:"monospace" }}>Atualizado em 18 de abril de 2026</div>
            {[
              ["1. Sobre a Plataforma","Social Plexy é um banco de dados colaborativo de vídeos dark, experimental e investigativo. A plataforma tem como propósito a criação de comunidades e grupos focados na produção de conteúdo audiovisual alternativo — arte sombria, mistérios, fenômenos e investigações."],
              ["2. Conteúdo Proibido","• Conteúdo adulto (+18)\n• Conteúdo ilegal\n• Violência extrema sem contexto educacional\n• Violação de direitos autorais\n• Assédio e discurso de ódio\n• Desinformação intencional\n• Spam"],
              ["3. Responsabilidade","Cada usuário é responsável pelo conteúdo publicado. A plataforma pode remover conteúdo e suspender contas."],
              ["4. Email Plex","O Email Plex é a identidade interna da Social Plexy. Endereços @plexysocial.com não funcionam como emails externos."],
            ].map(([h,t])=>(
              <div key={h} style={{ marginBottom:18, paddingBottom:18, borderBottom:"1px solid #0d0d0d" }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#e8e8e8", marginBottom:6, fontFamily:"'Space Grotesk',sans-serif" }}>{h}</div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.8, whiteSpace:"pre-line", fontFamily:"'Space Grotesk',sans-serif" }}>{t}</div>
              </div>
            ))}
          </div>
        )}

        {/* PRIVACY */}
        {page==="privacy" && (
          <div style={{ maxWidth:660, margin:"0 auto" }}>
            <button onClick={()=>setPage("feed")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontSize:13, marginBottom:20, padding:0, fontWeight:600 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg> Voltar
            </button>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:800, marginBottom:3, letterSpacing:"-.5px" }}>Política de Privacidade</div>
            <div style={{ fontSize:12, color:"#333", marginBottom:24, fontFamily:"monospace" }}>Atualizado em 18 de abril de 2026</div>
            {[
              ["Dados Coletados","Nome, idade, Email Plex, conteúdo publicado e interações."],
              ["Uso","Personalizar experiência, aplicar classificações etárias, moderar conteúdo."],
              ["Compartilhamento","Não vendemos seus dados. Compartilhamos apenas mediante ordem judicial."],
              ["Contato","privacidade@plexysocial.com"],
            ].map(([h,t])=>(
              <div key={h} style={{ marginBottom:16, paddingBottom:16, borderBottom:"1px solid #0d0d0d" }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#e8e8e8", marginBottom:5, fontFamily:"'Space Grotesk',sans-serif" }}>{h}</div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.7, fontFamily:"'Space Grotesk',sans-serif" }}>{t}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ────────────────────────────────────────────── */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(3,3,3,.98)", backdropFilter:"blur(24px)", borderTop:"1px solid #0d0d0d", display:"flex", justifyContent:"space-around", alignItems:"center", padding:"8px 0 18px", zIndex:200 }}>
        <button className={`nav-btn${page==="feed"?" active":""}`} onClick={()=>setPage("feed")}>🏠<span>Início</span></button>
        <button className="nav-btn" onClick={()=>{setSearch("");setPage("feed");}}>🔍<span>Explorar</span></button>
        {/* Botão de upload central — amarelo como YT */}
        <button onClick={()=>currentUser?setShowUpload(true):requireAuth()} style={{ width:52, height:52, borderRadius:"50%", background:ACCENT, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", marginTop:-12, flexShrink:0, boxShadow:`0 0 28px ${ACCENT}66`, fontSize:22, transition:"transform .15s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          +
        </button>
        <button className={`nav-btn${page==="profile"?" active":""}`} onClick={()=>currentUser?goProfile(currentUser.id):requireAuth()}>👤<span>Perfil</span></button>
        <button className="nav-btn" onClick={()=>setShowNotifs(true)} style={{ position:"relative" }}>🔔<span>Alertas</span>{notifs.length>0&&<span style={{ position:"absolute", top:2, right:6, width:7, height:7, background:ACCENT2, borderRadius:"50%" }}/>}</button>
      </nav>

      {showAuth   && <AuthModal onClose={()=>setShowAuth(false)} onSuccess={authSuccess}/>}
      {showUpload && currentUser && <UploadModal onClose={()=>setShowUpload(false)} user={currentUser} onUpload={uploadSuccess}/>}
      {showNotifs && <NotifsPanel notifs={notifs} onClose={()=>setShowNotifs(false)}/>}
      <Toasts list={toasts}/>
    </>
  );
}
