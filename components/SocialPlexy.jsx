"use client";
import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────
const DOMAIN = "@plexysocial.com";
const ACCENT = "#E8FF47";
const CATS = ["Para você","Trending","Dark Arts","Mistério","Tecnologia","Natureza","Ciência","História"];

function ageRating(a) {
  const n = Number(a);
  if (n < 10) return { label:"Livre", color:"#4ade80" };
  if (n < 14) return { label:"10+",  color:"#facc15" };
  if (n < 16) return { label:"14+",  color:"#fb923c" };
  if (n < 18) return { label:"16+",  color:"#f87171" };
  return       { label:"18+",  color:"#e879f9" };
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

// ─── BOTS ─────────────────────────────────────────────────────
const BOTS = [
  { id:"bot1", name:"Nexus_1023", email:"nexus1023"+DOMAIN, age:22,
    bio:"Explorando os limites do digital e do real.", color:"#7c3aed",
    initials:"N", verified:true, joined:"05 set 2025", followers:12400, photo:null },
  { id:"bot2", name:"Void_8472",  email:"void8472"+DOMAIN,  age:25,
    bio:"Arte sombria, experimental e fenômenos inexplicáveis.", color:"#dc2626",
    initials:"V", verified:true, joined:"05 set 2025", followers:8900, photo:null },
];

// ─── VIDEOS ───────────────────────────────────────────────────
const INIT_VIDEOS = [
  { id:"v1", title:"A Escuridão do Oceano Profundo", desc:"Uma jornada às profundezas onde a luz nunca chega. Criaturas jamais catalogadas habitam estas águas.", authorId:"bot1", dur:48, views:128400, likes:4820, cat:"Mistério", bg:"#050d1a", accent:"#1e40af", short:false, comments:[], date:"12 abr 2026", tags:["oceano","dark","mistério"], videoUrl:null },
  { id:"v2", title:"Glitch", desc:"Curto experimental sobre falhas digitais e realidade fragmentada.", authorId:"bot2", dur:18, views:89200, likes:6100, cat:"Dark Arts", bg:"#0d0010", accent:"#7c3aed", short:true,  comments:[], date:"15 abr 2026", tags:["glitch","arte","digital"], videoUrl:null },
  { id:"v3", title:"Frequências Ocultas", desc:"Investigação sobre frequências de rádio suprimidas por governos.", authorId:"bot1", dur:52, views:210000, likes:9300, cat:"Mistério", bg:"#100800", accent:"#d97706", short:false, comments:[], date:"10 abr 2026", tags:["rádio","conspiração","oculto"], videoUrl:null },
  { id:"v4", title:"Sombra", desc:"Curto artístico sobre isolamento e identidade digital.", authorId:"bot2", dur:22, views:44000, likes:2800, cat:"Dark Arts", bg:"#050510", accent:"#be185d", short:true,  comments:[], date:"17 abr 2026", tags:["arte","sombra","identidade"], videoUrl:null },
  { id:"v5", title:"Arquitetura Proibida", desc:"Edifícios apagados dos mapas, bunkers secretos e construções proibidas.", authorId:"bot1", dur:61, views:305000, likes:14200, cat:"História", bg:"#0a0600", accent:"#92400e", short:false, comments:[], date:"08 abr 2026", tags:["arquitetura","história","segredo"], videoUrl:null },
  { id:"v6", title:"Entidade", desc:"Animação experimental sobre consciência e dissolução.", authorId:"bot2", dur:15, views:67000, likes:5500, cat:"Dark Arts", bg:"#07000f", accent:"#6d28d9", short:true,  comments:[], date:"16 abr 2026", tags:["entidade","animação","dark"], videoUrl:null },
  { id:"v7", title:"Código Vermelho", desc:"Os algoritmos que controlam o que você vê na internet.", authorId:"bot1", dur:55, views:180000, likes:7600, cat:"Tecnologia", bg:"#0d0000", accent:"#ef4444", short:false, comments:[], date:"05 abr 2026", tags:["tecnologia","algoritmo","controle"], videoUrl:null },
  { id:"v8", title:"Eco", desc:"O som do silêncio — experiência sonora e visual.", authorId:"bot2", dur:28, views:33000, likes:3100, cat:"Dark Arts", bg:"#000a0a", accent:"#06b6d4", short:true,  comments:[], date:"14 abr 2026", tags:["som","silêncio","arte"], videoUrl:null },
];

// ─── ICONS ────────────────────────────────────────────────────
const I = {
  Home:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  User:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Heart:  ({on})=><svg viewBox="0 0 24 24" fill={on?"#f43f5e":"none"} stroke={on?"#f43f5e":"currentColor"} strokeWidth="1.8" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Chat:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Share:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Flag:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  X:      ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>,
  Play:   ()=><svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Edit:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Back:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>,
  Eye:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Plus:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Video:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Shield: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Camera: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
};

function Windmill({ size=30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="5" fill="white"/>
      <path d="M32 27C30 18 24 10 16 6C22 14 32 27 32 27Z" fill="white" opacity="0.95"/>
      <path d="M37 32C46 30 54 24 58 16C50 22 37 32 37 32Z" fill="white" opacity="0.95"/>
      <path d="M32 37C34 46 40 54 48 58C42 50 32 37 32 37Z" fill="white" opacity="0.95"/>
      <path d="M27 32C18 34 10 40 6 48C14 42 27 32 27 32Z" fill="white" opacity="0.95"/>
      <rect x="30.5" y="37" width="3" height="22" rx="1.5" fill="white"/>
      <rect x="24" y="57" width="16" height="3" rx="1.5" fill="white"/>
    </svg>
  );
}

function Avatar({ user, size=36 }) {
  if (!user) return <div style={{ width:size, height:size, borderRadius:"50%", background:"#1a1a1a", flexShrink:0 }}/>;
  if (user.photo) return <img src={user.photo} alt="" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>;
  return <div style={{ width:size, height:size, borderRadius:"50%", background:user.color||"#333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:800, color:"#fff", flexShrink:0 }}>{(user.initials||user.name?.[0]||"?").toUpperCase()}</div>;
}

function Toasts({ list }) {
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", zIndex:9999, display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none" }}>
      {list.map(t=>(
        <div key={t.id} style={{ background:"#111", border:`1px solid ${t.type==="ok"?"#4ade80":t.type==="err"?"#ef4444":ACCENT}`, borderRadius:40, padding:"9px 18px", fontSize:13, fontWeight:600, color:t.type==="ok"?"#4ade80":t.type==="err"?"#ef4444":ACCENT, display:"flex", alignItems:"center", gap:7, boxShadow:"0 8px 32px #000a", animation:"toastIn .2s ease", whiteSpace:"nowrap" }}>
          {t.type==="ok"?"✓":t.type==="err"?"✗":"→"} {t.text}
        </div>
      ))}
    </div>
  );
}

function Thumb({ video, onClick }) {
  const ratio = video.short ? "9/16" : "16/9";
  return (
    <div onClick={onClick} style={{ aspectRatio:ratio, background:`linear-gradient(135deg,${video.bg} 0%,${video.accent}28 100%)`, borderRadius:10, position:"relative", cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:46, height:46, borderRadius:"50%", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>
        <I.Play/>
      </div>
      {video.short && <div style={{ position:"absolute", top:8, left:8, background:"#ef4444", color:"#fff", fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:4, letterSpacing:.8 }}>SHORT</div>}
      <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,.78)", color:"#fff", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4 }}>{fmtTime(video.dur)}</div>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top,${video.bg}99 0%,transparent 55%)` }}/>
    </div>
  );
}

function VideoCard({ video, allUsers, onClick }) {
  const author = allUsers.find(u=>u.id===video.authorId);
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"#0a0a0a", border:`1px solid ${hov?"#252525":"#141414"}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-2px)":"none", transition:"all .2s" }}>
      <Thumb video={video}/>
      <div style={{ padding:"12px 14px 14px" }}>
        <div style={{ fontSize:14, fontWeight:600, lineHeight:1.45, marginBottom:10, color:"#e8e8e8", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", letterSpacing:"-.2px" }}>{video.title}</div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Avatar user={author} size={24}/>
          <span style={{ fontSize:12, color:"#666", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{author?.name}</span>
          <span style={{ fontSize:11, color:"#444", display:"flex", alignItems:"center", gap:3, flexShrink:0 }}><I.Eye/>{fmt(video.views)}</span>
        </div>
      </div>
    </div>
  );
}

function Modal({ onClose, children, wide }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.9)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16 }}>
      <div style={{ background:"#0a0a0a", border:"1px solid #1e1e1e", borderRadius:18, padding:"26px 22px", width:"100%", maxWidth:wide?560:400, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"#141414", border:"1px solid #222", borderRadius:"50%", width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#666" }}><I.X/></button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div style={{ marginBottom:13 }}><div style={{ fontSize:11, fontWeight:700, color:"#444", letterSpacing:.8, textTransform:"uppercase", marginBottom:5 }}>{label}</div>{children}</div>;
}

const inputStyle = { width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:9, padding:"11px 13px", color:"#e8e8e8", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box" };

function PrimaryBtn({ children, onClick, style }) {
  return <button onClick={onClick} style={{ width:"100%", padding:"12px", background:ACCENT, color:"#000", border:"none", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:.2, ...style }}>{children}</button>;
}

// ─── AUTH MODAL ───────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [name, setName]     = useState("");
  const [age, setAge]       = useState("");
  const [emailN, setEmailN] = useState("");
  const emailFull = emailN ? `${emailN.toLowerCase().replace(/[^a-z0-9._-]/g,"")}${DOMAIN}` : "";
  const rating = age ? ageRating(age) : null;

  function submit() {
    if (!name.trim()||!age||!emailN.trim()) return;
    const colors = ["#7c3aed","#dc2626","#059669","#d97706","#0891b2","#be185d"];
    onSuccess({ id:uid(), name:name.trim(), email:emailFull, age:Number(age), bio:"", color:colors[Math.floor(Math.random()*colors.length)], initials:name.trim()[0].toUpperCase(), verified:false, joined:"18 abr 2026", followers:0, photo:null });
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:"center", marginBottom:18 }}><Windmill size={36}/></div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:800, marginBottom:4 }}>Crie seu Email Plex</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:20, lineHeight:1.6 }}>Para curtir, comentar e postar você precisa de uma identidade Email Plex.</div>
      <Field label="Nome de usuário"><input style={inputStyle} placeholder="Ex: darkvoid99" value={name} onChange={e=>setName(e.target.value)}/></Field>
      <Field label="Idade"><input style={inputStyle} type="number" placeholder="Sua idade" value={age} onChange={e=>setAge(e.target.value)} min="1" max="120"/></Field>
      {rating && <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:rating.color+"22", color:rating.color, fontSize:12, fontWeight:700, marginBottom:13 }}><I.Shield/> Classificação: {rating.label}</div>}
      <Field label="Nome do seu email Plex"><input style={inputStyle} placeholder="nomeescolhido" value={emailN} onChange={e=>setEmailN(e.target.value)}/></Field>
      {emailFull && <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:8, padding:"10px 13px", fontSize:13, color:"#a78bfa", marginBottom:13, fontFamily:"monospace" }}>{emailFull}</div>}
      <div style={{ fontSize:11, color:"#333", marginBottom:18 }}>O sufixo <span style={{ color:"#a78bfa" }}>@plexysocial.com</span> é fixo e exclusivo.</div>
      <PrimaryBtn onClick={submit}>Criar conta e entrar</PrimaryBtn>
    </Modal>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────
function UploadModal({ onClose, user, onUpload }) {
  const [title, setTitle]     = useState("");
  const [desc, setDesc]       = useState("");
  const [cat, setCat]         = useState("Dark Arts");
  const [isShort, setIsShort] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef               = useRef();

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    if (!title) setTitle(f.name.replace(/\.[^.]+$/,"").replace(/[-_]/g," "));
  }

  function submit() {
    if (!title.trim()) return;
    const bgs = ["#050d1a","#0d0010","#100800","#050510","#0a0600","#07000f"];
    const acs = ["#1e40af","#7c3aed","#d97706","#be185d","#92400e","#6d28d9"];
    const i = Math.floor(Math.random()*bgs.length);
    onUpload({ id:uid(), title:title.trim(), desc:desc.trim(), authorId:user.id, dur:isShort?Math.floor(Math.random()*55+5):Math.floor(Math.random()*60+45), views:0, likes:0, cat, bg:bgs[i], accent:acs[i], short:isShort, comments:[], date:"18 abr 2026", tags:[cat.toLowerCase()], videoUrl:preview });
    onClose();
  }

  return (
    <Modal onClose={onClose} wide>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>Publicar vídeo</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:18 }}>Selecione o vídeo da sua galeria.</div>
      <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={pickFile}/>
      <div onClick={()=>fileRef.current.click()} style={{ border:"2px dashed #1e1e1e", borderRadius:12, padding:"24px 16px", textAlign:"center", cursor:"pointer", marginBottom:14, background:preview?"#050505":"transparent" }}>
        {preview
          ? <video src={preview} style={{ width:"100%", maxHeight:150, borderRadius:8, objectFit:"cover" }} muted/>
          : <>
              <div style={{ color:"#333", marginBottom:8, display:"flex", justifyContent:"center" }}><I.Camera/></div>
              <div style={{ fontSize:14, fontWeight:600, color:"#555" }}>Toque para escolher da galeria</div>
              <div style={{ fontSize:12, color:"#333", marginTop:3 }}>MP4, MOV, WebM</div>
            </>
        }
      </div>
      <Field label="Título"><input style={inputStyle} placeholder="Título do vídeo" value={title} onChange={e=>setTitle(e.target.value)}/></Field>
      <Field label="Descrição">
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descreva seu vídeo..." style={{ ...inputStyle, resize:"vertical", minHeight:72 }}/>
      </Field>
      <Field label="Categoria">
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{ ...inputStyle, cursor:"pointer" }}>
          {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
        </select>
      </Field>
      <label style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, cursor:"pointer", fontSize:13, color:"#888" }}>
        <input type="checkbox" checked={isShort} onChange={e=>setIsShort(e.target.checked)} style={{ width:15, height:15 }}/>
        Este é um Short (vídeo vertical curto)
      </label>
      <PrimaryBtn onClick={submit}>Publicar</PrimaryBtn>
    </Modal>
  );
}

// ─── EDIT PROFILE MODAL ───────────────────────────────────────
function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio]   = useState(user.bio||"");
  const [photo, setPhoto] = useState(user.photo||null);
  const fileRef = useRef();

  function pickPhoto(e) {
    const f = e.target.files[0];
    if (f) setPhoto(URL.createObjectURL(f));
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:18 }}>Editar perfil</div>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
        <div style={{ position:"relative", cursor:"pointer" }} onClick={()=>fileRef.current.click()}>
          <Avatar user={{ ...user, photo, name, initials:name[0]?.toUpperCase()||"?" }} size={80}/>
          <div style={{ position:"absolute", bottom:0, right:0, width:26, height:26, background:ACCENT, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #0a0a0a" }}>
            <I.Edit/>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={pickPhoto}/>
        </div>
      </div>
      <Field label="Nome"><input style={inputStyle} value={name} onChange={e=>setName(e.target.value)}/></Field>
      <Field label="Bio"><textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Fale sobre você..." style={{ ...inputStyle, resize:"vertical", minHeight:72 }}/></Field>
      <PrimaryBtn onClick={()=>onSave({ ...user, name:name.trim()||user.name, bio, photo })}>Salvar alterações</PrimaryBtn>
    </Modal>
  );
}

// ─── REPORT MODAL ─────────────────────────────────────────────
function ReportModal({ onClose, onReport }) {
  const opts = ["Direitos autorais","Conteúdo impróprio","Conteúdo adulto (+18)","Violência extrema","Desinformação","Spam"];
  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:5 }}>Denunciar</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:16 }}>Selecione o motivo:</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {opts.map(o=>(
          <button key={o} onClick={()=>onReport(o)} style={{ padding:"11px 14px", background:"#0d0d0d", border:"1px solid #1e1e1e", borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:"'DM Sans',sans-serif", color:"#bbb", fontSize:13, transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#ef4444";e.currentTarget.style.color="#ef4444";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e1e";e.currentTarget.style.color="#bbb";}}>
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
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:16 }}>Notificações</div>
      {notifs.length===0
        ? <div style={{ color:"#444", textAlign:"center", padding:"24px 0", fontSize:14 }}>Nenhuma notificação</div>
        : notifs.map((n,i)=>(
          <div key={i} style={{ display:"flex", gap:12, padding:"11px 0", borderBottom:"1px solid #111", alignItems:"flex-start" }}>
            <div style={{ fontSize:20 }}>{icons[n.type]||"🔔"}</div>
            <div>
              <div style={{ fontSize:13, color:"#bbb", lineHeight:1.5 }}>{n.text}</div>
              <div style={{ fontSize:11, color:"#444", marginTop:2 }}>{n.time}</div>
            </div>
          </div>
        ))
      }
    </Modal>
  );
}

// ─── PLAYER PAGE ──────────────────────────────────────────────
function PlayerPage({ video, allUsers, currentUser, setVideos, addNotif, addToast, requireAuth, goBack, goProfile }) {
  const author = allUsers.find(u=>u.id===video.authorId);
  const [liked, setLiked]     = useState(false);
  const [playing, setPlaying] = useState(false);
  const [prog, setProg]       = useState(0);
  const [comment, setComment] = useState("");
  const [showRep, setShowRep] = useState(false);

  useEffect(()=>{
    let t;
    if (playing) t = setInterval(()=>setProg(p=>p>=100?100:p+0.25),100);
    return ()=>clearInterval(t);
  },[playing]);

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
    addToast("Denúncia enviada. EquipePlexy está analisando.","info");
    addNotif({ type:"report", text:`Denúncia: "${reason}" — EquipePlexy está analisando o conteúdo.`, time:"agora" });
  }

  return (
    <div style={{ maxWidth:920, margin:"0 auto" }}>
      {showRep && <ReportModal onClose={()=>setShowRep(false)} onReport={doReport}/>}
      <button onClick={goBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, marginBottom:16, padding:0 }}>
        <I.Back/> Voltar
      </button>

      {/* PLAYER */}
      <div style={{ borderRadius:14, overflow:"hidden", background:`linear-gradient(135deg,${video.bg},${video.accent}28)`, aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", marginBottom:16 }}>
        {video.videoUrl
          ? <video src={video.videoUrl} controls style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
          : <>
              <button onClick={()=>setPlaying(p=>!p)} style={{ width:68, height:68, borderRadius:"50%", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)", color:"#fff" }}>
                {playing
                  ? <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <I.Play/>}
              </button>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px", background:"linear-gradient(transparent,rgba(0,0,0,.82))" }}>
                <div style={{ height:3, background:"rgba(255,255,255,.12)", borderRadius:2, overflow:"hidden", marginBottom:6 }}>
                  <div style={{ width:`${prog}%`, height:"100%", background:"#fff", borderRadius:2, transition:"width .1s" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>{playing?"▶ Reproduzindo":"⏸ Pausado"}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>{fmtTime(video.dur)}</span>
                </div>
              </div>
            </>
        }
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 290px", gap:20 }}>
        {/* LEFT */}
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, marginBottom:8, lineHeight:1.3, letterSpacing:"-.3px" }}>{video.title}</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, color:"#555", display:"flex", alignItems:"center", gap:4 }}><I.Eye/>{fmt(video.views)}</span>
            <span style={{ color:"#222" }}>·</span>
            <span style={{ fontSize:13, color:"#555" }}>{video.date}</span>
            <span style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:5, padding:"2px 8px", fontSize:11, color:"#666" }}>{video.cat}</span>
          </div>

          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {[
              { icon:<I.Heart on={liked}/>, label:`${fmt(video.likes+(liked?1:0))}`, onClick:like, active:liked },
              { icon:<I.Chat/>, label:`${video.comments.length}`, onClick:null },
              { icon:<I.Share/>, label:"Compartilhar", onClick:share },
              { icon:<I.Flag/>, label:"Denunciar", onClick:()=>setShowRep(true), red:true },
            ].map((a,i)=>(
              <button key={i} onClick={a.onClick||undefined}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#0d0d0d", border:`1px solid ${a.active?"#f43f5e3a":a.red?"#1a0000":"#1a1a1a"}`, borderRadius:40, color:a.active?"#f43f5e":a.red?"#555":"#777", cursor:a.onClick?"pointer":"default", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>

          <div style={{ background:"#080808", border:"1px solid #141414", borderRadius:12, padding:14, fontSize:13, color:"#777", lineHeight:1.75, marginBottom:20 }}>{video.desc}</div>

          {/* COMMENTS */}
          <div style={{ fontWeight:700, fontSize:15, marginBottom:12 }}>Comentários ({video.comments.length})</div>
          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"flex-start" }}>
            {currentUser && <Avatar user={currentUser} size={30}/>}
            <textarea value={comment} onChange={e=>setComment(e.target.value)} onClick={()=>!currentUser&&requireAuth()} placeholder={currentUser?"Escreva um comentário...":"Faça login para comentar"} rows={2}
              style={{ flex:1, background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:10, padding:"10px 13px", color:"#e8e8e8", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"none" }}/>
            <button onClick={sendComment} style={{ padding:"0 14px", height:44, background:ACCENT, color:"#000", border:"none", borderRadius:10, cursor:"pointer", fontWeight:800, fontFamily:"'DM Sans',sans-serif", fontSize:13, flexShrink:0 }}>Enviar</button>
          </div>
          {video.comments.map(c=>{
            const u = allUsers.find(u=>u.id===c.userId);
            return (
              <div key={c.id} style={{ display:"flex", gap:10, marginBottom:12, paddingBottom:12, borderBottom:"1px solid #0d0d0d" }}>
                <div onClick={()=>goProfile(c.userId)} style={{ cursor:"pointer", flexShrink:0 }}><Avatar user={u} size={30}/></div>
                <div>
                  <div onClick={()=>goProfile(c.userId)} style={{ fontSize:13, fontWeight:700, marginBottom:3, cursor:"pointer", color:"#ccc" }}>{u?.name||"Usuário"}</div>
                  <div style={{ fontSize:13, color:"#888", lineHeight:1.55 }}>{c.text}</div>
                  <div style={{ fontSize:11, color:"#333", marginTop:3 }}>{c.ts}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SIDEBAR */}
        <div>
          <div style={{ background:"#080808", border:"1px solid #141414", borderRadius:14, padding:16 }}>
            <div onClick={()=>goProfile(author?.id)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, cursor:"pointer" }}>
              <Avatar user={author} size={42}/>
              <div>
                <div style={{ fontWeight:700, fontSize:15, display:"flex", alignItems:"center", gap:6 }}>
                  {author?.name}
                  {author?.verified && <span style={{ width:16, height:16, background:"#3b82f6", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><I.Check/></span>}
                </div>
                <div style={{ fontSize:12, color:"#444" }}>{fmt(author?.followers||0)} seguidores</div>
              </div>
            </div>
            {author?.bio && <div style={{ fontSize:13, color:"#666", lineHeight:1.6, marginBottom:12, paddingBottom:12, borderBottom:"1px solid #111" }}>{author.bio}</div>}
            <div style={{ fontSize:11, fontWeight:700, color:"#333", letterSpacing:.8, textTransform:"uppercase", marginBottom:8 }}>Zona do criador</div>
            <div style={{ aspectRatio:"16/9", borderRadius:10, background:`linear-gradient(135deg,${video.bg},${video.accent}44)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
              <span style={{ color:"rgba(255,255,255,.15)", fontSize:12 }}>✦ Arte / GIF ✦</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {video.tags?.map(t=><span key={t} style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:4, padding:"3px 8px", fontSize:11, color:"#444" }}>#{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────
function ProfilePage({ userId, allUsers, videos, currentUser, setCurrentUser, setAllUsers, goBack, goPlayer, addToast }) {
  const isOwn  = currentUser?.id === userId;
  const user   = allUsers.find(u=>u.id===userId) || currentUser;
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
    <div style={{ maxWidth:820, margin:"0 auto" }}>
      {editing && <EditProfileModal user={user} onClose={()=>setEditing(false)} onSave={saveEdit}/>}
      <button onClick={goBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, marginBottom:16, padding:0 }}><I.Back/> Voltar</button>

      <div style={{ height:110, background:`linear-gradient(135deg,${user.color}44,#050505)`, borderRadius:"14px 14px 0 0", border:"1px solid #141414", borderBottom:"none", position:"relative" }}>
        <div style={{ position:"absolute", bottom:-38, left:22 }}><Avatar user={user} size={76}/></div>
        {isOwn && (
          <button onClick={()=>setEditing(true)} style={{ position:"absolute", top:12, right:12, display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,0,0,.6)", border:"1px solid #2a2a2a", borderRadius:8, padding:"7px 14px", color:"#ccc", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, backdropFilter:"blur(8px)" }}>
            <I.Edit/> Editar perfil
          </button>
        )}
      </div>

      <div style={{ background:"#080808", border:"1px solid #141414", borderTop:"none", borderRadius:"0 0 14px 14px", padding:"52px 22px 22px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, display:"flex", alignItems:"center", gap:8, marginBottom:4, letterSpacing:"-.3px" }}>
              {user.name}
              {user.verified && <span style={{ width:20, height:20, background:"#3b82f6", borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><I.Check/></span>}
            </div>
            <div style={{ fontSize:13, color:"#6d5f9e", fontFamily:"monospace", marginBottom:8 }}>{user.email}</div>
            {user.bio && <div style={{ fontSize:14, color:"#777", lineHeight:1.65, maxWidth:460, marginBottom:10 }}>{user.bio}</div>}
            {rating && <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:rating.color+"22", color:rating.color, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700 }}><I.Shield/> {rating.label}</span>}
          </div>
          <div style={{ display:"flex", gap:22, textAlign:"center" }}>
            <div><div style={{ fontSize:18, fontWeight:800 }}>{fmt(user.followers)}</div><div style={{ fontSize:11, color:"#444" }}>Seguidores</div></div>
            <div><div style={{ fontSize:18, fontWeight:800 }}>{userVids.length}</div><div style={{ fontSize:11, color:"#444" }}>Vídeos</div></div>
          </div>
        </div>
        <div style={{ fontSize:11, color:"#333", marginTop:12 }}>📅 Conta criada em: {user.joined}</div>
      </div>

      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, margin:"22px 0 12px", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ width:3, height:18, background:ACCENT, borderRadius:2, display:"inline-block" }}/>
        Vídeos publicados
      </div>

      {userVids.length===0
        ? <div style={{ color:"#444", fontSize:14, textAlign:"center", padding:"40px 0" }}>Nenhum vídeo publicado ainda.</div>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:13 }}>
            {userVids.map(v=><VideoCard key={v.id} video={v} allUsers={allUsers} onClick={()=>goPlayer(v.id)}/>)}
          </div>
      }
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function SocialPlexy() {
  const [page, setPage]             = useState("feed");
  const [activeVid, setActiveVid]   = useState(null);
  const [profileId, setProfileId]   = useState(null);
  const [cat, setCat]               = useState("Para você");
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers]     = useState([...BOTS]);
  const [videos, setVideos]         = useState(INIT_VIDEOS);
  const [notifs, setNotifs]         = useState([{ type:"system", text:"Bem-vindo ao Social Plexy!", time:"agora" }]);
  const [toasts, setToasts]         = useState([]);
  const [showAuth, setShowAuth]     = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  function addToast(text, type="info") {
    const id=uid(); setToasts(t=>[...t,{ id,text,type }]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  }
  function addNotif(n) { setNotifs(ns=>[n,...ns]); }
  function requireAuth() { setShowAuth(true); }

  function authSuccess(u) {
    setAllUsers(us=>[...us,u]); setCurrentUser(u); setShowAuth(false);
    addToast(`Bem-vindo, ${u.name}!`,"ok");
    addNotif({ type:"system", text:`Conta criada: ${u.email}`, time:"agora" });
  }

  function uploadSuccess(v) {
    setVideos(vs=>[v,...vs]); setShowUpload(false);
    addToast("Vídeo publicado!","ok");
    addNotif({ type:"system", text:`"${v.title}" publicado.`, time:"agora" });
  }

  // Recommendation engine
  function recommend(vids) {
    if (!currentUser) return vids;
    const topCats = [...vids].sort((a,b)=>b.likes-a.likes).slice(0,3).map(v=>v.cat);
    return [...vids].sort((a,b)=>{
      const sa = topCats.includes(a.cat)?2:0;
      const sb = topCats.includes(b.cat)?2:0;
      return (sb-sa) || (b.views-a.views);
    });
  }

  const searchResults = search.length>1
    ? videos.filter(v=>v.title.toLowerCase().includes(search.toLowerCase())||v.tags?.some(t=>t.includes(search.toLowerCase())))
    : [];

  const feedVids =
    cat==="Para você" ? recommend(videos) :
    cat==="Trending"  ? [...videos].sort((a,b)=>b.views-a.views) :
    videos.filter(v=>v.cat===cat);

  const longs  = feedVids.filter(v=>!v.short);
  const shorts = feedVids.filter(v=>v.short);

  function goPlayer(id) { setActiveVid(id); setPage("player"); }
  function goProfile(id) { setProfileId(id); setPage("profile"); }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#050505;color:#e8e8e8;font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#080808}::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:4px}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .cat-btn{padding:7px 18px;border-radius:40px;border:1px solid #161616;background:transparent;color:#555;font-size:13px;cursor:pointer;white-space:nowrap;transition:all .18s;font-family:'DM Sans',sans-serif;font-weight:500;letter-spacing:.1px}
        .cat-btn:hover{border-color:#2a2a2a;color:#aaa}
        .cat-btn.active{background:${ACCENT};color:#000;border-color:${ACCENT};font-weight:700}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;color:#3a3a3a;font-size:10px;font-family:'DM Sans',sans-serif;background:none;border:none;padding:5px 12px;transition:color .18s;font-weight:500;letter-spacing:.2px;min-width:52px}
        .nav-btn:hover,.nav-btn.active{color:${ACCENT}}
        .srch-drop{position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;z-index:300;overflow:hidden;box-shadow:0 16px 48px #000}
        .srch-item{padding:11px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid #111;transition:background .12s;display:flex;align-items:center;gap:10px;color:#bbb}
        .srch-item:hover{background:#111}
        .srch-item:last-child{border-bottom:none}
        @media(max-width:640px){.player-grid{grid-template-columns:1fr!important}.hide-sm{display:none!important}}
      `}</style>

      {/* HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,5,5,.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid #0d0d0d", height:56, display:"flex", alignItems:"center", padding:"0 16px", gap:12 }}>
        <div onClick={()=>setPage("feed")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0, userSelect:"none" }}>
          <Windmill size={26}/>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"-.5px", color:"#fff" }}>Social Plexy</span>
        </div>

        <div style={{ flex:1, maxWidth:420, position:"relative" }}>
          <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#333", pointerEvents:"none" }}><I.Search/></div>
          <input value={search} onChange={e=>{setSearch(e.target.value);setShowSearch(true);}} onFocus={()=>setShowSearch(true)} onBlur={()=>setTimeout(()=>setShowSearch(false),180)}
            placeholder="Pesquisar..."
            style={{ width:"100%", background:"#0d0d0d", border:"1px solid #161616", borderRadius:40, padding:"8px 14px 8px 36px", color:"#e8e8e8", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
          {showSearch && search.length>1 && (
            <div className="srch-drop">
              {searchResults.length===0
                ? <div style={{ padding:16, textAlign:"center", color:"#333", fontSize:13 }}>Nenhum resultado para "{search}"</div>
                : searchResults.map(v=>(
                  <div key={v.id} className="srch-item" onClick={()=>{goPlayer(v.id);setSearch("");}}>
                    <I.Video/><div><div style={{ fontWeight:600, fontSize:13 }}>{v.title}</div><div style={{ fontSize:11, color:"#444" }}>{v.cat}</div></div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
          <button onClick={()=>setShowNotifs(true)} style={{ width:34, height:34, borderRadius:"50%", background:"#0d0d0d", border:"1px solid #161616", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#555", position:"relative" }}>
            <I.Bell/>
            {notifs.length>0 && <span style={{ position:"absolute", top:-2, right:-2, width:14, height:14, background:"#ef4444", borderRadius:"50%", fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #050505", color:"#fff" }}>{Math.min(notifs.length,9)}{notifs.length>9?"+":" "}</span>}
          </button>
          {currentUser
            ? <div onClick={()=>goProfile(currentUser.id)} style={{ cursor:"pointer" }}><Avatar user={currentUser} size={32}/></div>
            : <button onClick={()=>setShowAuth(true)} style={{ padding:"7px 14px", background:ACCENT, color:"#000", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, letterSpacing:.1 }}>Entrar</button>
          }
        </div>
      </header>

      {/* CATEGORIES */}
      {page==="feed" && (
        <div style={{ display:"flex", gap:6, padding:"10px 16px", overflowX:"auto", scrollbarWidth:"none", borderBottom:"1px solid #0a0a0a", background:"#050505" }}>
          <style>{`.hide-scroll::-webkit-scrollbar{display:none}`}</style>
          {CATS.map(c=><button key={c} className={`cat-btn${cat===c?" active":""}`} onClick={()=>setCat(c)}>{c}</button>)}
          <button className="cat-btn" onClick={()=>setPage("terms")}>Termos</button>
          <button className="cat-btn" onClick={()=>setPage("privacy")}>Privacidade</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main style={{ padding:"20px 16px 100px", minHeight:"calc(100vh - 56px)", maxWidth:1280, margin:"0 auto" }}>

        {/* FEED */}
        {page==="feed" && (
          <div>
            {/* SHORTS ROW */}
            {shorts.length>0 && (
              <div style={{ marginBottom:28 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ background:"#ef4444", color:"#fff", fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:4, letterSpacing:.8 }}>SHORT</span>
                  Shorts
                </div>
                <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6, scrollbarWidth:"none" }}>
                  {shorts.map(v=>{
                    const author = allUsers.find(u=>u.id===v.authorId);
                    return (
                      <div key={v.id} onClick={()=>goPlayer(v.id)} style={{ flexShrink:0, width:120, cursor:"pointer" }}>
                        <Thumb video={v}/>
                        <div style={{ marginTop:6, fontSize:12, fontWeight:600, color:"#ccc", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{v.title}</div>
                        <div style={{ fontSize:11, color:"#444", marginTop:2 }}>{author?.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LONG VIDEOS */}
            {longs.length>0 && (
              <>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:3, height:17, background:ACCENT, borderRadius:2, display:"inline-block" }}/>
                  {cat==="Para você"?"Recomendados":cat==="Trending"?"Em alta":cat}
                  {cat==="Para você" && currentUser && <span style={{ fontSize:11, color:"#444", fontWeight:400, fontFamily:"'DM Sans',sans-serif" }}>baseado no seu histórico</span>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:14 }}>
                  {longs.map(v=><VideoCard key={v.id} video={v} allUsers={allUsers} onClick={()=>goPlayer(v.id)}/>)}
                </div>
              </>
            )}

            {feedVids.length===0 && (
              <div style={{ textAlign:"center", padding:"80px 20px" }}>
                <I.Video/>
                <div style={{ fontWeight:700, fontSize:16, marginTop:14, marginBottom:6 }}>Nenhum vídeo aqui ainda</div>
                <div style={{ fontSize:13, color:"#444" }}>Seja o primeiro a publicar nesta categoria.</div>
              </div>
            )}
          </div>
        )}

        {/* PLAYER */}
        {page==="player" && activeVid && (()=>{
          const v = videos.find(x=>x.id===activeVid);
          if (!v) return null;
          return <PlayerPage video={v} allUsers={allUsers} currentUser={currentUser} setVideos={setVideos} addNotif={addNotif} addToast={addToast} requireAuth={requireAuth} goBack={()=>setPage("feed")} goProfile={goProfile}/>;
        })()}

        {/* PROFILE */}
        {page==="profile" && (
          <ProfilePage userId={profileId} allUsers={allUsers} videos={videos} currentUser={currentUser} setCurrentUser={setCurrentUser} setAllUsers={setAllUsers} goBack={()=>setPage("feed")} goPlayer={goPlayer} addToast={addToast}/>
        )}

        {/* TERMS */}
        {page==="terms" && (
          <div style={{ maxWidth:660, margin:"0 auto" }}>
            <button onClick={()=>setPage("feed")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, marginBottom:20, padding:0 }}><I.Back/> Voltar</button>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:3 }}>Termos de Uso</div>
            <div style={{ fontSize:12, color:"#333", marginBottom:24 }}>Atualizado em 18 de abril de 2026</div>
            {[
              ["1. Sobre a Plataforma","Social Plexy é um banco de dados colaborativo de vídeos dark, experimental e investigativo. A plataforma tem como propósito a criação de comunidades e grupos focados na produção de conteúdo audiovisual alternativo — arte sombria, mistérios, fenômenos e investigações. Ao usar a plataforma, você concorda com estes termos."],
              ["2. Conteúdo Proibido","• Conteúdo adulto (+18) ou sexualmente explícito\n• Conteúdo ilegal ou que incite crimes\n• Violência extrema sem contexto educacional\n• Violação de direitos autorais\n• Assédio, bullying e discurso de ódio\n• Desinformação intencional\n• Spam e malware"],
              ["3. Responsabilidade","Cada usuário é responsável integralmente pelo conteúdo publicado. A plataforma pode remover conteúdo e suspender contas sem aviso."],
              ["4. Email Plex","O Email Plex é o sistema de identidade interno da Social Plexy. Endereços @plexysocial.com não funcionam como emails externos."],
              ["5. Comunidades","A plataforma incentiva comunidades temáticas dark. Todos os grupos devem respeitar estes termos."],
            ].map(([h,t])=>(
              <div key={h} style={{ marginBottom:18, paddingBottom:18, borderBottom:"1px solid #0d0d0d" }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#e8e8e8", marginBottom:6 }}>{h}</div>
                <div style={{ fontSize:14, color:"#666", lineHeight:1.75, whiteSpace:"pre-line" }}>{t}</div>
              </div>
            ))}
          </div>
        )}

        {/* PRIVACY */}
        {page==="privacy" && (
          <div style={{ maxWidth:660, margin:"0 auto" }}>
            <button onClick={()=>setPage("feed")} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#555", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, marginBottom:20, padding:0 }}><I.Back/> Voltar</button>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:3 }}>Política de Privacidade</div>
            <div style={{ fontSize:12, color:"#333", marginBottom:24 }}>Atualizado em 18 de abril de 2026</div>
            {[
              ["Dados Coletados","Nome de usuário, idade, Email Plex, conteúdo publicado e interações."],
              ["Uso","Personalizar experiência, aplicar classificações etárias, moderar conteúdo."],
              ["Compartilhamento","Não vendemos seus dados. Compartilhamos apenas mediante ordem judicial."],
              ["Seus Direitos","Solicitar exclusão, acesso e correção de dados a qualquer momento."],
              ["Contato","privacidade@plexysocial.com"],
            ].map(([h,t])=>(
              <div key={h} style={{ marginBottom:16, paddingBottom:16, borderBottom:"1px solid #0d0d0d" }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#e8e8e8", marginBottom:5 }}>{h}</div>
                <div style={{ fontSize:14, color:"#666", lineHeight:1.7 }}>{t}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(3,3,3,.98)", backdropFilter:"blur(24px)", borderTop:"1px solid #0d0d0d", display:"flex", justifyContent:"space-around", alignItems:"center", padding:"8px 0 18px", zIndex:200 }}>
        <button className={`nav-btn${page==="feed"?" active":""}`} onClick={()=>setPage("feed")}><I.Home/><span>Início</span></button>
        <button className="nav-btn" onClick={()=>{setSearch(""); setPage("feed");}}><I.Search/><span>Explorar</span></button>
        <button onClick={()=>currentUser?setShowUpload(true):requireAuth()} style={{ width:48, height:48, borderRadius:"50%", background:ACCENT, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", marginTop:-10, flexShrink:0, boxShadow:`0 0 24px ${ACCENT}55` }}>
          <I.Plus/>
        </button>
        <button className={`nav-btn${page==="profile"?" active":""}`} onClick={()=>currentUser?(goProfile(currentUser.id)):requireAuth()}><I.User/><span>Perfil</span></button>
        <button className="nav-btn" onClick={()=>setShowNotifs(true)} style={{ position:"relative" }}><I.Bell/><span>Alertas</span>{notifs.length>0&&<span style={{ position:"absolute", top:2, right:8, width:7, height:7, background:"#ef4444", borderRadius:"50%" }}/>}</button>
      </nav>

      {showAuth   && <AuthModal onClose={()=>setShowAuth(false)} onSuccess={authSuccess}/>}
      {showUpload && currentUser && <UploadModal onClose={()=>setShowUpload(false)} user={currentUser} onUpload={uploadSuccess}/>}
      {showNotifs && <NotifsPanel notifs={notifs} onClose={()=>setShowNotifs(false)}/>}

      <Toasts list={toasts}/>
    </>
  );
}
