import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONSTANTS & MOCK DATA
// ============================================================
const PLATFORM_NAME = "Social Plexy";
const EMAIL_DOMAIN = "@plexysocial.com";

const WINDMILL_SVG = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="4" fill="white"/>
  <path d="M32 28 C32 28 28 18 20 10 C26 14 32 28 32 28Z" stroke="white" stroke-width="1.5" fill="white" opacity="0.9"/>
  <path d="M32 28 C32 28 42 24 52 18 C48 26 32 28 32 28Z" stroke="white" stroke-width="1.5" fill="white" opacity="0.9"/>
  <path d="M32 36 C32 36 36 46 44 54 C38 50 32 36 32 36Z" stroke="white" stroke-width="1.5" fill="white" opacity="0.9"/>
  <path d="M32 36 C32 36 22 40 12 46 C16 38 32 36 32 36Z" stroke="white" stroke-width="1.5" fill="white" opacity="0.9"/>
  <line x1="32" y1="36" x2="32" y2="58" stroke="white" stroke-width="2"/>
  <line x1="24" y1="58" x2="40" y2="58" stroke="white" stroke-width="2"/>
  <line x1="28" y1="50" x2="32" y2="58" stroke="white" stroke-width="1.5"/>
  <line x1="36" y1="50" x2="32" y2="58" stroke="white" stroke-width="1.5"/>
</svg>`;

function getAgeRating(age) {
  if (age < 10) return { label: "Conteúdo Infantil", color: "#4ade80", bg: "#052e16" };
  if (age < 14) return { label: "10+", color: "#facc15", bg: "#1c1500" };
  if (age < 16) return { label: "14+", color: "#fb923c", bg: "#1c0a00" };
  if (age < 18) return { label: "16+", color: "#f87171", bg: "#1c0505" };
  return { label: "18+", color: "#e879f9", bg: "#1a001a" };
}

const CATEGORIES = ["Trending", "Dark Arts", "Mistério", "Tecnologia", "Natureza", "Ciência", "História", "Mini Games"];

const BOT_USERS = [
  {
    id: "bot-1023",
    username: "bot-1023",
    displayName: "Nexus_1023",
    email: "nexus1023@plexysocial.com",
    age: 22,
    bio: "Explorando os limites do digital e do real. Conteúdo dark e tecnológico.",
    avatar: "N",
    avatarColor: "#7c3aed",
    createdAt: "05 de setembro de 2025",
    verified: true,
  },
  {
    id: "bot-8472",
    username: "bot-8472",
    displayName: "Void_8472",
    email: "void8472@plexysocial.com",
    age: 25,
    bio: "Criador de conteúdo sombrio e experimental. Arte digital e fenômenos.",
    avatar: "V",
    avatarColor: "#dc2626",
    createdAt: "05 de setembro de 2025",
    verified: true,
  },
];

const INITIAL_VIDEOS = [
  {
    id: "v001",
    title: "A Escuridão do Oceano Profundo",
    description: "Uma jornada às profundezas do oceano onde a luz nunca chega. Criaturas que nunca foram catalogadas habitam estas águas esquecidas.",
    authorId: "bot-1023",
    duration: 48,
    views: 128400,
    likes: 4820,
    category: "Mistério",
    thumbnail: null,
    thumbnailColor: "#0a0a1a",
    thumbnailAccent: "#1e40af",
    isShort: false,
    comments: [
      { id: "c1", userId: "bot-8472", text: "Conteúdo incrível, me arrepiou todo.", timestamp: "há 2 horas", likes: 34 },
    ],
    createdAt: "12 de abril de 2026",
  },
  {
    id: "v002",
    title: "Glitch",
    description: "Um curto experimental sobre falhas digitais e realidade fragmentada.",
    authorId: "bot-8472",
    duration: 18,
    views: 89200,
    likes: 6100,
    category: "Dark Arts",
    thumbnail: null,
    thumbnailColor: "#0d0d0d",
    thumbnailAccent: "#7c3aed",
    isShort: true,
    comments: [],
    createdAt: "15 de abril de 2026",
  },
  {
    id: "v003",
    title: "Frequências Ocultas — O que seu rádio não transmite",
    description: "Investigação sobre frequências de rádio proibidas e os sons que governos suprimem.",
    authorId: "bot-1023",
    duration: 52,
    views: 210000,
    likes: 9300,
    category: "Mistério",
    thumbnail: null,
    thumbnailColor: "#0f0a00",
    thumbnailAccent: "#d97706",
    isShort: false,
    comments: [
      { id: "c2", userId: "bot-1023", text: "Fonte: relatório declassificado de 1989.", timestamp: "há 1 dia", likes: 120 },
    ],
    createdAt: "10 de abril de 2026",
  },
  {
    id: "v004",
    title: "Sombra",
    description: "Curto artístico sobre isolamento e identidade digital.",
    authorId: "bot-8472",
    duration: 22,
    views: 44000,
    likes: 2800,
    category: "Dark Arts",
    thumbnail: null,
    thumbnailColor: "#050510",
    thumbnailAccent: "#be185d",
    isShort: true,
    comments: [],
    createdAt: "17 de abril de 2026",
  },
  {
    id: "v005",
    title: "Arquitetura Proibida — Edifícios que o mundo esqueceu",
    description: "Locais abandonados, bunkers secretos e construções que foram apagadas dos mapas oficiais.",
    authorId: "bot-1023",
    duration: 61,
    views: 305000,
    likes: 14200,
    category: "História",
    thumbnail: null,
    thumbnailColor: "#0a0600",
    thumbnailAccent: "#92400e",
    isShort: false,
    comments: [],
    createdAt: "08 de abril de 2026",
  },
  {
    id: "v006",
    title: "Entidade",
    description: "Dark art — animação experimental sobre consciência e dissolução.",
    authorId: "bot-8472",
    duration: 15,
    views: 67000,
    likes: 5500,
    category: "Dark Arts",
    thumbnail: null,
    thumbnailColor: "#07000f",
    thumbnailAccent: "#6d28d9",
    isShort: true,
    comments: [],
    createdAt: "16 de abril de 2026",
  },
];

const QUIZ_QUESTIONS = [
  { q: "Qual é a profundidade máxima do oceano?", opts: ["8.000m", "10.994m", "7.500m", "12.000m"], answer: 1 },
  { q: "Em que ano foi fundada a internet pública?", opts: ["1983", "1991", "1995", "1969"], answer: 1 },
  { q: "O que é uma zona de exclusão?", opts: ["Área de pesca", "Zona proibida ao público", "Frequência de rádio", "Tipo de sinal"], answer: 1 },
  { q: "Qual país tem mais bunkers secretos por km²?", opts: ["EUA", "Rússia", "Albânia", "China"], answer: 2 },
  { q: "O que significa 'deep web'?", opts: ["Internet rápida", "Parte não indexada da internet", "Internet ilegal", "Servidor privado"], answer: 1 },
];

// ============================================================
// ICONS (SVG)
// ============================================================
const Icon = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Heart: ({ filled }) => <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Comment: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Share: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Flag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  GamePad: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1" fill="currentColor"/><circle cx="17.5" cy="13" r="1" fill="currentColor"/><path d="M17 7H7a5 5 0 00-5 5v0a5 5 0 005 5h10a5 5 0 005-5v0a5 5 0 00-5-5z"/></svg>,
  Info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>,
  Star: ({ filled }) => <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Community: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
};

// ============================================================
// UTILITY
// ============================================================
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
}
function formatDuration(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ============================================================
// STYLES
// ============================================================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #050505;
    --bg2: #0d0d0d;
    --bg3: #141414;
    --bg4: #1a1a1a;
    --border: rgba(255,255,255,0.07);
    --text: #e8e8e8;
    --text2: #888;
    --text3: #555;
    --accent: #ffffff;
    --accent-dim: rgba(255,255,255,0.12);
    --red: #ef4444;
    --purple: #8b5cf6;
    --green: #22c55e;
    --yellow: #eab308;
    --radius: 12px;
    --radius-sm: 8px;
  }

  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: 'Space Grotesk', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .sp-app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* HEADER */
  .sp-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(5,5,5,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .sp-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    flex-shrink: 0;
    text-decoration: none;
  }
  .sp-logo-icon {
    width: 32px;
    height: 32px;
  }
  .sp-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -0.5px;
    color: var(--accent);
  }
  .sp-search-wrap {
    flex: 1;
    max-width: 480px;
    position: relative;
  }
  .sp-search {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 40px;
    padding: 9px 16px 9px 40px;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }
  .sp-search:focus { border-color: rgba(255,255,255,0.25); }
  .sp-search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text3);
    pointer-events: none;
  }
  .sp-search-results {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    z-index: 200;
  }
  .sp-search-item {
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.15s;
    border-bottom: 1px solid var(--border);
  }
  .sp-search-item:last-child { border-bottom: none; }
  .sp-search-item:hover { background: var(--bg4); }
  .sp-search-empty {
    padding: 20px;
    text-align: center;
    color: var(--text2);
    font-size: 13px;
  }

  .sp-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }
  .sp-icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--bg3);
    border: 1px solid var(--border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text2);
    transition: all 0.2s;
    position: relative;
  }
  .sp-icon-btn:hover { background: var(--bg4); color: var(--text); }
  .sp-notif-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 14px;
    height: 14px;
    background: var(--red);
    border-radius: 50%;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 2px solid var(--bg);
  }
  .sp-avatar-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid var(--border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    transition: border-color 0.2s;
    flex-shrink: 0;
  }
  .sp-avatar-btn:hover { border-color: rgba(255,255,255,0.4); }

  /* NAV CATEGORIES */
  .sp-nav-cats {
    display: flex;
    gap: 6px;
    padding: 12px 20px;
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 1px solid var(--border);
  }
  .sp-nav-cats::-webkit-scrollbar { display: none; }
  .sp-cat-btn {
    padding: 6px 16px;
    border-radius: 40px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text2);
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    font-family: inherit;
  }
  .sp-cat-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
  .sp-cat-btn.active { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 600; }

  /* MAIN LAYOUT */
  .sp-main {
    flex: 1;
    padding: 24px 20px;
    padding-bottom: 90px;
  }

  /* FEED */
  .sp-feed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .sp-video-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.25s;
  }
  .sp-video-card:hover {
    border-color: rgba(255,255,255,0.18);
    transform: translateY(-2px);
  }
  .sp-thumb {
    position: relative;
    overflow: hidden;
  }
  .sp-thumb-square { aspect-ratio: 1/1; }
  .sp-thumb-vertical { aspect-ratio: 9/16; }
  .sp-thumb-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .sp-thumb-play {
    width: 52px;
    height: 52px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.2);
    transition: transform 0.2s;
  }
  .sp-video-card:hover .sp-thumb-play { transform: scale(1.1); }
  .sp-thumb-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0,0,0,0.8);
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }
  .sp-thumb-short-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: var(--red);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .sp-card-info {
    padding: 12px;
  }
  .sp-card-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .sp-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sp-card-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .sp-card-author {
    font-size: 12px;
    color: var(--text2);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sp-card-views {
    font-size: 11px;
    color: var(--text3);
    display: flex;
    align-items: center;
    gap: 3px;
  }

  /* VIDEO PLAYER PAGE */
  .sp-player-page {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
  @media (max-width: 768px) {
    .sp-player-page { grid-template-columns: 1fr; }
  }
  .sp-player-main {}
  .sp-player-screen {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .sp-player-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sp-player-info {
    margin-bottom: 16px;
  }
  .sp-player-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .sp-player-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .sp-action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 40px;
    border: 1px solid var(--border);
    background: var(--bg3);
    color: var(--text2);
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    transition: all 0.2s;
  }
  .sp-action-btn:hover { background: var(--bg4); color: var(--text); }
  .sp-action-btn.liked { color: #f43f5e; border-color: #f43f5e; background: rgba(244,63,94,0.1); }
  .sp-action-btn.danger { color: var(--red); }
  .sp-player-desc {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px;
    font-size: 14px;
    color: var(--text2);
    line-height: 1.6;
  }

  /* SIDEBAR PANEL */
  .sp-sidebar-panel {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    height: fit-content;
  }
  .sp-sidebar-channel {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    cursor: pointer;
  }
  .sp-sidebar-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
  }
  .sp-sidebar-name {
    font-weight: 600;
    font-size: 15px;
  }
  .sp-sidebar-subs {
    font-size: 12px;
    color: var(--text2);
  }
  .sp-sidebar-bio {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .sp-sidebar-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--text3);
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .sp-gif-box {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 10px;
    position: relative;
  }

  /* COMMENTS */
  .sp-comments {
    margin-top: 20px;
  }
  .sp-comments-title {
    font-weight: 700;
    margin-bottom: 14px;
    font-size: 15px;
  }
  .sp-comment-input-row {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
  }
  .sp-comment-input {
    flex: 1;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    resize: none;
    transition: border-color 0.2s;
  }
  .sp-comment-input:focus { border-color: rgba(255,255,255,0.25); }
  .sp-comment-submit {
    padding: 0 18px;
    background: var(--accent);
    color: #000;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 700;
    font-size: 13px;
    font-family: inherit;
    transition: opacity 0.2s;
  }
  .sp-comment-submit:hover { opacity: 0.85; }
  .sp-comment {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .sp-comment:last-child { border-bottom: none; }
  .sp-comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .sp-comment-body {}
  .sp-comment-name {
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 3px;
  }
  .sp-comment-name:hover { text-decoration: underline; }
  .sp-comment-text {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
    margin-bottom: 4px;
  }
  .sp-comment-ts {
    font-size: 11px;
    color: var(--text3);
  }

  /* MODAL */
  .sp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 500;
    padding: 20px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .sp-modal {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    width: 100%;
    max-width: 420px;
    position: relative;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  .sp-modal-lg { max-width: 600px; }
  .sp-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    color: var(--text2);
    background: var(--bg3);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .sp-modal-close:hover { background: var(--bg4); color: var(--text); }
  .sp-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 6px;
  }
  .sp-modal-sub {
    font-size: 13px;
    color: var(--text2);
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .sp-field-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text2);
    margin-bottom: 6px;
    display: block;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .sp-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    margin-bottom: 14px;
    transition: border-color 0.2s;
  }
  .sp-input:focus { border-color: rgba(255,255,255,0.3); }
  .sp-email-preview {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 14px;
    color: var(--purple);
    margin-bottom: 14px;
    font-family: monospace;
  }
  .sp-rating-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  .sp-btn-primary {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    color: #000;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s;
  }
  .sp-btn-primary:hover { opacity: 0.85; }
  .sp-btn-secondary {
    width: 100%;
    padding: 11px;
    background: transparent;
    color: var(--text2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    margin-top: 8px;
    transition: all 0.2s;
  }
  .sp-btn-secondary:hover { background: var(--bg3); color: var(--text); }

  /* TOAST */
  .sp-toast-container {
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .sp-toast {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 40px;
    padding: 10px 20px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: toastIn 0.25s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    white-space: nowrap;
  }
  @keyframes toastIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
  .sp-toast.success { border-color: var(--green); color: var(--green); }
  .sp-toast.error { border-color: var(--red); color: var(--red); }
  .sp-toast.info { border-color: var(--purple); color: var(--purple); }

  /* BOTTOM NAV */
  .sp-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(5,5,5,0.97);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-around;
    padding: 10px 0 20px;
    z-index: 100;
  }
  .sp-nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: var(--text3);
    font-size: 11px;
    font-family: inherit;
    background: none;
    border: none;
    padding: 4px 16px;
    transition: color 0.2s;
    min-width: 60px;
  }
  .sp-nav-btn:hover, .sp-nav-btn.active { color: var(--accent); }
  .sp-nav-upload-btn {
    width: 44px;
    height: 44px;
    background: var(--accent);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    transition: opacity 0.2s;
    margin-top: -8px;
  }
  .sp-nav-upload-btn:hover { opacity: 0.85; }

  /* PROFILE PAGE */
  .sp-profile-header {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .sp-profile-avatar-lg {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .sp-profile-name {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 3px;
  }
  .sp-profile-email {
    font-size: 13px;
    color: var(--purple);
    margin-bottom: 8px;
    font-family: monospace;
  }
  .sp-profile-bio {
    font-size: 14px;
    color: var(--text2);
    line-height: 1.5;
    margin-bottom: 10px;
  }
  .sp-profile-meta {
    font-size: 12px;
    color: var(--text3);
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* NOTIFICATIONS */
  .sp-notif-list {}
  .sp-notif-item {
    display: flex;
    gap: 12px;
    padding: 14px;
    border-bottom: 1px solid var(--border);
    align-items: flex-start;
  }
  .sp-notif-item:last-child { border-bottom: none; }
  .sp-notif-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sp-notif-text {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
  }
  .sp-notif-time {
    font-size: 11px;
    color: var(--text3);
    margin-top: 3px;
  }

  /* QUIZ */
  .sp-quiz-q {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.4;
  }
  .sp-quiz-opts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  .sp-quiz-opt {
    padding: 12px 16px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    font-family: inherit;
    color: var(--text);
    transition: all 0.2s;
  }
  .sp-quiz-opt:hover { border-color: rgba(255,255,255,0.3); }
  .sp-quiz-opt.correct { border-color: var(--green); background: rgba(34,197,94,0.1); color: var(--green); }
  .sp-quiz-opt.wrong { border-color: var(--red); background: rgba(239,68,68,0.1); color: var(--red); }

  /* UPLOAD */
  .sp-upload-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 16px;
  }
  .sp-upload-zone:hover { border-color: rgba(255,255,255,0.3); background: var(--bg3); }

  /* WELCOME BANNER */
  .sp-welcome {
    background: linear-gradient(135deg, #0d0d0d 0%, #141420 50%, #0d0d0d 100%);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .sp-welcome-text h2 {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 800;
    margin-bottom: 4px;
  }
  .sp-welcome-text p {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
  }
  .sp-welcome-close {
    cursor: pointer;
    color: var(--text3);
    background: none;
    border: none;
    flex-shrink: 0;
  }

  /* SECTION TITLE */
  .sp-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sp-section-title span {
    width: 3px;
    height: 18px;
    background: var(--accent);
    border-radius: 2px;
    display: inline-block;
  }

  /* DENÚNCIA */
  .sp-report-opts {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .sp-report-opt {
    padding: 12px 16px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: var(--text);
    font-size: 14px;
    transition: all 0.2s;
  }
  .sp-report-opt:hover { border-color: var(--red); color: var(--red); }

  /* TERMS / PRIVACY */
  .sp-doc {
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.7;
  }
  .sp-doc h1 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    margin-bottom: 6px;
  }
  .sp-doc h2 {
    font-size: 17px;
    font-weight: 700;
    margin: 22px 0 8px;
    color: var(--text);
  }
  .sp-doc p, .sp-doc li {
    font-size: 14px;
    color: var(--text2);
    margin-bottom: 6px;
  }
  .sp-doc ul { padding-left: 18px; }
  .sp-doc .sp-doc-date { font-size: 12px; color: var(--text3); margin-bottom: 20px; }

  /* VERIFIED */
  .sp-verified {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: #888;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* BACK BTN */
  .sp-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--text2);
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    margin-bottom: 16px;
    transition: color 0.2s;
    padding: 0;
  }
  .sp-back-btn:hover { color: var(--text); }

  /* PROGRESS BAR (quiz) */
  .sp-progress {
    height: 3px;
    background: var(--bg4);
    border-radius: 2px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .sp-progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  /* SEPARATOR */
  .sp-sep {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .sp-header { padding: 0 12px; }
    .sp-main { padding: 16px 12px 90px; }
    .sp-logo-text { font-size: 15px; }
    .sp-feed-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
    .sp-player-page { grid-template-columns: 1fr; }
    .sp-profile-header { flex-direction: column; }
  }
`;

// ============================================================
// COMPONENTS
// ============================================================
function WindmillLogo({ size = 32 }) {
  return (
    <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: WINDMILL_SVG }} />
  );
}

function Avatar({ user, size = 36 }) {
  if (!user) return <div style={{ width: size, height: size, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#888" }}>?</div>;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: user.avatarColor || "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
      {user.avatar || user.displayName?.[0] || "?"}
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="sp-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`sp-toast ${t.type}`}>
          {t.type === "success" && <Icon.Check />}
          {t.type === "error" && <Icon.X />}
          {t.type === "info" && <Icon.Info />}
          {t.text}
        </div>
      ))}
    </div>
  );
}

function VideoThumbnail({ video, style }) {
  return (
    <div className={`sp-thumb ${video.isShort ? "sp-thumb-vertical" : "sp-thumb-square"}`} style={style}>
      <div className="sp-thumb-inner" style={{ background: `linear-gradient(135deg, ${video.thumbnailColor} 0%, ${video.thumbnailAccent}22 100%)` }}>
        <div className="sp-thumb-play"><Icon.Play /></div>
        {video.isShort && <div className="sp-thumb-short-badge">SHORT</div>}
        <div className="sp-thumb-duration">{formatDuration(video.duration)}</div>
      </div>
    </div>
  );
}

function VideoCard({ video, users, onClick }) {
  const author = users.find(u => u.id === video.authorId);
  return (
    <div className="sp-video-card" onClick={onClick}>
      <VideoThumbnail video={video} />
      <div className="sp-card-info">
        <div className="sp-card-title">{video.title}</div>
        <div className="sp-card-meta">
          <div className="sp-card-avatar" style={{ background: author?.avatarColor || "#555", color: "#fff" }}>
            {author?.avatar || "?"}
          </div>
          <span className="sp-card-author">{author?.displayName}</span>
          <span className="sp-card-views"><Icon.Eye /> {formatNumber(video.views)}</span>
        </div>
      </div>
    </div>
  );
}

// Auth Modal
function AuthModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [emailName, setEmailName] = useState("");
  const [step, setStep] = useState("create"); // create | success

  const rating = age ? getAgeRating(Number(age)) : null;
  const emailFull = emailName ? `${emailName.toLowerCase().replace(/\s/g, "")}${EMAIL_DOMAIN}` : "";

  function handleCreate() {
    if (!username.trim() || !age || !emailName.trim()) return;
    if (Number(age) < 0 || Number(age) > 120) return;
    const newUser = {
      id: generateId(),
      username: username.trim(),
      displayName: username.trim(),
      email: emailFull,
      age: Number(age),
      bio: "",
      avatar: username.trim()[0].toUpperCase(),
      avatarColor: ["#7c3aed", "#dc2626", "#059669", "#d97706", "#2563eb"][Math.floor(Math.random() * 5)],
      createdAt: "18 de abril de 2026",
      verified: false,
    };
    onSuccess(newUser);
  }

  return (
    <div className="sp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal">
        <button className="sp-modal-close" onClick={onClose}><Icon.X /></button>
        <div style={{ marginBottom: 20 }}>
          <WindmillLogo size={36} />
        </div>
        <div className="sp-modal-title">Crie seu Email Plex</div>
        <div className="sp-modal-sub">Para comentar, curtir e postar, você precisa de uma conta Email Plex — o sistema de identidade da plataforma.</div>

        <label className="sp-field-label">Nome de usuário</label>
        <input className="sp-input" placeholder="Ex: darkvoid99" value={username} onChange={e => setUsername(e.target.value)} />

        <label className="sp-field-label">Idade</label>
        <input className="sp-input" type="number" placeholder="Sua idade" value={age} onChange={e => setAge(e.target.value)} min="1" max="120" />

        {rating && (
          <div className="sp-rating-badge" style={{ color: rating.color, background: rating.bg }}>
            <Icon.Shield />
            Classificação: {rating.label}
          </div>
        )}

        <label className="sp-field-label">Escolha seu email Plex</label>
        <input className="sp-input" placeholder="nomeescolhido" value={emailName} onChange={e => setEmailName(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ""))} />

        {emailFull && (
          <div className="sp-email-preview">{emailFull}</div>
        )}

        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 18, lineHeight: 1.5 }}>
          O sufixo <span style={{ color: "var(--purple)" }}>@plexysocial.com</span> é fixo e exclusivo da plataforma.
        </div>

        <button className="sp-btn-primary" onClick={handleCreate} disabled={!username || !age || !emailName}>
          Criar conta e entrar
        </button>
      </div>
    </div>
  );
}

// Report Modal
function ReportModal({ onClose, onReport }) {
  const options = ["Direitos autorais", "Conteúdo impróprio ou ofensivo", "Desinformação", "Spam", "Conteúdo adulto (+18)", "Violência extrema"];
  return (
    <div className="sp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal">
        <button className="sp-modal-close" onClick={onClose}><Icon.X /></button>
        <div className="sp-modal-title">Denunciar conteúdo</div>
        <div className="sp-modal-sub">Selecione o motivo da denúncia:</div>
        <div className="sp-report-opts">
          {options.map(opt => (
            <button key={opt} className="sp-report-opt" onClick={() => onReport(opt)}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Upload Modal
function UploadModal({ onClose, currentUser, onUpload }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [category, setCategory] = useState("Dark Arts");

  function handleSubmit() {
    if (!title.trim()) return;
    const newVideo = {
      id: generateId(),
      title: title.trim(),
      description: desc.trim(),
      authorId: currentUser.id,
      duration: isShort ? Math.floor(Math.random() * 55 + 5) : Math.floor(Math.random() * 60 + 45),
      views: 0,
      likes: 0,
      category,
      thumbnail: null,
      thumbnailColor: "#0a0a0a",
      thumbnailAccent: currentUser.avatarColor || "#555",
      isShort,
      comments: [],
      createdAt: "18 de abril de 2026",
    };
    onUpload(newVideo);
    onClose();
  }

  return (
    <div className="sp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal sp-modal-lg">
        <button className="sp-modal-close" onClick={onClose}><Icon.X /></button>
        <div className="sp-modal-title">Enviar vídeo</div>
        <div className="sp-modal-sub">Publique seu conteúdo na plataforma. Certifique-se de que respeita os Termos de Uso.</div>

        <div className="sp-upload-zone">
          <div style={{ color: "var(--text3)", marginBottom: 8 }}><Icon.Upload /></div>
          <div style={{ fontSize: 14, color: "var(--text2)" }}>Clique para selecionar o vídeo</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>MP4, WebM — máx 2GB</div>
        </div>

        <label className="sp-field-label">Título</label>
        <input className="sp-input" placeholder="Título do vídeo" value={title} onChange={e => setTitle(e.target.value)} />

        <label className="sp-field-label">Descrição</label>
        <textarea className="sp-input" style={{ height: 80, resize: "vertical" }} placeholder="Descreva seu vídeo..." value={desc} onChange={e => setDesc(e.target.value)} />

        <label className="sp-field-label">Categoria</label>
        <select className="sp-input" value={category} onChange={e => setCategory(e.target.value)} style={{ cursor: "pointer" }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <input type="checkbox" id="isShort" checked={isShort} onChange={e => setIsShort(e.target.checked)} />
          <label htmlFor="isShort" style={{ fontSize: 14, cursor: "pointer" }}>Este é um Short (vídeo curto vertical)</label>
        </div>

        <button className="sp-btn-primary" onClick={handleSubmit}>Publicar vídeo</button>
      </div>
    </div>
  );
}

// Quiz Modal
function QuizModal({ onClose, addToast }) {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  function handleAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = QUIZ_QUESTIONS[qi].answer === idx;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (qi + 1 >= QUIZ_QUESTIONS.length) {
        setDone(true);
      } else {
        setQi(q => q + 1);
        setSelected(null);
      }
    }, 1000);
  }

  const q = QUIZ_QUESTIONS[qi];
  const progress = ((qi) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="sp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal">
        <button className="sp-modal-close" onClick={onClose}><Icon.X /></button>
        <div className="sp-modal-title" style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon.GamePad /> Mini Quiz Plexy</div>
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🎯</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Resultado: {score}/{QUIZ_QUESTIONS.length}</div>
            <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20 }}>{score >= 4 ? "Excelente! Você domina os mistérios." : score >= 2 ? "Bom resultado! Continue explorando." : "Continue tentando — o conhecimento está na escuridão."}</div>
            <button className="sp-btn-primary" onClick={() => { setQi(0); setScore(0); setSelected(null); setDone(false); }}>Jogar novamente</button>
          </div>
        ) : (
          <>
            <div className="sp-progress"><div className="sp-progress-fill" style={{ width: `${progress}%` }} /></div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10 }}>Pergunta {qi + 1} de {QUIZ_QUESTIONS.length}</div>
            <div className="sp-quiz-q">{q.q}</div>
            <div className="sp-quiz-opts">
              {q.opts.map((opt, idx) => (
                <button
                  key={idx}
                  className={`sp-quiz-opt ${selected !== null ? (idx === q.answer ? "correct" : (selected === idx ? "wrong" : "")) : ""}`}
                  onClick={() => handleAnswer(idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Notifications Panel
function NotificationsPanel({ notifications, onClose }) {
  return (
    <div className="sp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal" style={{ maxWidth: 380 }}>
        <button className="sp-modal-close" onClick={onClose}><Icon.X /></button>
        <div className="sp-modal-title">Notificações</div>
        {notifications.length === 0 ? (
          <div style={{ color: "var(--text3)", fontSize: 14, padding: "20px 0", textAlign: "center" }}>Nenhuma notificação ainda</div>
        ) : (
          <div className="sp-notif-list">
            {notifications.map((n, i) => (
              <div key={i} className="sp-notif-item">
                <div className="sp-notif-icon">
                  {n.type === "like" && <span style={{ color: "#f43f5e" }}><Icon.Heart filled /></span>}
                  {n.type === "comment" && <span style={{ color: "var(--purple)" }}><Icon.Comment /></span>}
                  {n.type === "report" && <span style={{ color: "var(--red)" }}><Icon.Flag /></span>}
                  {n.type === "removed" && <span style={{ color: "var(--red)" }}><Icon.Trash /></span>}
                  {n.type === "system" && <span style={{ color: "var(--yellow)" }}><Icon.Shield /></span>}
                </div>
                <div>
                  <div className="sp-notif-text">{n.text}</div>
                  <div className="sp-notif-time">{n.time || "agora"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================
function FeedPage({ videos, users, currentUser, setPage, setActiveVideo, activeCategory, setActiveCategory, addToast, onRequireAuth }) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showWelcome, setShowWelcome] = useState(!currentUser);
  const searchRef = useRef();

  const filtered = videos.filter(v => {
    const matchCat = activeCategory === "Trending" || v.category === activeCategory;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {showWelcome && !currentUser && (
        <div className="sp-welcome">
          <div className="sp-welcome-text">
            <h2>Bem-vindo ao Social Plexy</h2>
            <p>Crie, assista e interaja com conteúdo dark. Respeite as regras da comunidade.</p>
          </div>
          <button className="sp-welcome-close" onClick={() => setShowWelcome(false)}><Icon.X /></button>
        </div>
      )}

      <div className="sp-feed-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: "var(--text3)" }}><Icon.Search /></div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Nenhum vídeo encontrado</div>
            <div style={{ fontSize: 14, color: "var(--text2)" }}>Seja o primeiro a enviar um vídeo nesta categoria.</div>
          </div>
        ) : (
          filtered.map(v => (
            <VideoCard key={v.id} video={v} users={users} onClick={() => { setActiveVideo(v.id); setPage("player"); }} />
          ))
        )}
      </div>
    </>
  );
}

function PlayerPage({ videoId, videos, setVideos, users, currentUser, setPage, addToast, addNotification, onRequireAuth, setActivePage }) {
  const video = videos.find(v => v.id === videoId);
  const author = users.find(u => u.id === video?.authorId);
  const [comment, setComment] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (!video) return null;

  function handleLike() {
    if (!currentUser) { onRequireAuth(); return; }
    setLiked(l => !l);
    setVideos(vs => vs.map(v => v.id === video.id ? { ...v, likes: v.likes + (liked ? -1 : 1) } : v));
    if (!liked) addNotification({ type: "like", text: `Alguém curtiu "${video.title}"`, time: "agora" });
  }

  function handleComment() {
    if (!currentUser) { onRequireAuth(); return; }
    if (!comment.trim()) return;
    const newComment = {
      id: generateId(),
      userId: currentUser.id,
      text: comment.trim(),
      timestamp: "agora",
      likes: 0,
    };
    setVideos(vs => vs.map(v => v.id === video.id ? { ...v, comments: [...v.comments, newComment] } : v));
    setComment("");
    addNotification({ type: "comment", text: `Novo comentário em "${video.title}"`, time: "agora" });
    addToast("Comentário publicado!", "success");
  }

  function handleShare() {
    const link = `https://socialplexy.com/v/${video.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    addToast("Link copiado com sucesso!", "success");
  }

  function handleReport(reason) {
    setShowReport(false);
    addToast("Denúncia enviada. EquipePlexy está analisando.", "info");
    addNotification({ type: "report", text: `Denúncia registrada: "${reason}" — EquipePlexy está analisando seu vídeo.`, time: "agora" });
  }

  const commentUsers = { ...Object.fromEntries(users.map(u => [u.id, u])) };

  return (
    <div className="sp-player-page">
      {showReport && <ReportModal onClose={() => setShowReport(false)} onReport={handleReport} />}

      <div className="sp-player-main">
        <button className="sp-back-btn" onClick={() => setPage("feed")}><Icon.ChevronLeft /> Voltar</button>

        <div className="sp-player-screen" style={{ background: `linear-gradient(135deg, ${video.thumbnailColor} 0%, ${video.thumbnailAccent}33 100%)` }}>
          <button style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 68, height: 68, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)" }} onClick={() => setPlaying(p => !p)}>
            <Icon.Play />
          </button>
          <div className="sp-player-controls">
            <span style={{ fontSize: 12, color: "#ccc" }}>{playing ? "▶ Reproduzindo..." : "⏸ Pausado"}</span>
            <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginLeft: 8 }}>
              <div style={{ width: playing ? "35%" : "0%", height: "100%", background: "#fff", borderRadius: 2, transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#ccc" }}>{formatDuration(video.duration)}</span>
          </div>
        </div>

        <div className="sp-player-info">
          <div className="sp-player-title">{video.title}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "var(--text2)", display: "flex", alignItems: "center", gap: 5 }}><Icon.Eye /> {formatNumber(video.views)} visualizações</span>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>· {video.createdAt}</span>
          </div>
          <div className="sp-player-actions">
            <button className={`sp-action-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
              <Icon.Heart filled={liked} /> {formatNumber(video.likes + (liked ? 1 : 0))} curtidas
            </button>
            <button className="sp-action-btn" onClick={() => setComment(c => c)}>
              <Icon.Comment /> {video.comments.length} comentários
            </button>
            <button className="sp-action-btn" onClick={handleShare}>
              <Icon.Share /> Compartilhar
            </button>
            <button className="sp-action-btn danger" onClick={() => setShowReport(true)}>
              <Icon.Flag /> Denunciar
            </button>
          </div>
          <div className="sp-player-desc">{video.description}</div>
        </div>

        <div className="sp-comments">
          <div className="sp-comments-title">Comentários ({video.comments.length})</div>
          <div className="sp-comment-input-row">
            <textarea
              className="sp-comment-input"
              placeholder={currentUser ? "Escreva um comentário..." : "Faça login para comentar"}
              value={comment}
              onChange={e => setComment(e.target.value)}
              onClick={() => !currentUser && onRequireAuth()}
              rows={2}
            />
            <button className="sp-comment-submit" onClick={handleComment}>Enviar</button>
          </div>
          {video.comments.map(c => {
            const u = commentUsers[c.userId];
            return (
              <div key={c.id} className="sp-comment">
                <div className="sp-comment-avatar" style={{ background: u?.avatarColor || "#555", color: "#fff" }} onClick={() => setActivePage && setActivePage({ page: "profile", userId: c.userId })}>
                  {u?.avatar || "?"}
                </div>
                <div className="sp-comment-body">
                  <div className="sp-comment-name" onClick={() => setActivePage && setActivePage({ page: "profile", userId: c.userId })}>
                    {u?.displayName || "Usuário"}
                  </div>
                  <div className="sp-comment-text">{c.text}</div>
                  <div className="sp-comment-ts">{c.timestamp}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="sp-sidebar-panel">
          <div className="sp-sidebar-channel" onClick={() => {}}>
            <div className="sp-sidebar-avatar" style={{ background: author?.avatarColor || "#555", color: "#fff" }}>
              {author?.avatar || "?"}
            </div>
            <div>
              <div className="sp-sidebar-name" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {author?.displayName}
                {author?.verified && <span className="sp-verified"><Icon.Check /></span>}
              </div>
              <div className="sp-sidebar-subs">Canal verificado</div>
            </div>
          </div>
          <div className="sp-sidebar-bio">{author?.bio}</div>
          <div className="sp-sidebar-label">Área do criador</div>
          <div className="sp-gif-box" style={{ background: `linear-gradient(135deg, ${video.thumbnailColor}, ${video.thumbnailAccent}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}>✦ Zona Criativa ✦</div>
              <div style={{ fontSize: 11 }}>GIF / arte do criador</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            Conteúdo dark e experimental.<br />
            <span style={{ color: "var(--text3)" }}>Publicado em {video.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ userId, users, videos, currentUser, setPage, setActivePage }) {
  const user = users.find(u => u.id === userId) || currentUser;
  if (!user) return <div style={{ padding: 40, color: "var(--text2)" }}>Usuário não encontrado.</div>;

  const userVideos = videos.filter(v => v.authorId === user.id);
  const rating = getAgeRating(user.age);

  return (
    <div>
      <button className="sp-back-btn" onClick={() => setPage("feed")}><Icon.ChevronLeft /> Voltar</button>
      <div className="sp-profile-header">
        <div className="sp-profile-avatar-lg" style={{ background: user.avatarColor || "#555", color: "#fff" }}>
          {user.avatar || "?"}
        </div>
        <div style={{ flex: 1 }}>
          <div className="sp-profile-name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user.displayName}
            {user.verified && <span className="sp-verified" style={{ width: 20, height: 20 }}><Icon.Check /></span>}
          </div>
          <div className="sp-profile-email">{user.email}</div>
          {user.bio && <div className="sp-profile-bio">{user.bio}</div>}
          <div style={{ marginBottom: 10 }}>
            <span className="sp-rating-badge" style={{ color: rating.color, background: rating.bg, fontSize: 12 }}>
              <Icon.Shield /> {rating.label}
            </span>
          </div>
          <div className="sp-profile-meta">
            <span>📅 Conta criada em: {user.createdAt || "18 de abril de 2026"}</span>
            <span>🎬 {userVideos.length} vídeo{userVideos.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      <div className="sp-section-title"><span />Vídeos do canal</div>
      {userVideos.length === 0 ? (
        <div style={{ color: "var(--text2)", fontSize: 14, padding: "20px 0" }}>Nenhum vídeo publicado ainda.</div>
      ) : (
        <div className="sp-feed-grid">
          {userVideos.map(v => (
            <VideoCard key={v.id} video={v} users={users} onClick={() => setActivePage({ page: "player", videoId: v.id })} />
          ))}
        </div>
      )}
    </div>
  );
}

function TermsPage({ setPage }) {
  return (
    <div className="sp-doc">
      <button className="sp-back-btn" onClick={() => setPage("feed")}><Icon.ChevronLeft /> Voltar</button>
      <h1>Termos de Uso</h1>
      <div className="sp-doc-date">Última atualização: 18 de abril de 2026</div>

      <h2>1. Sobre a Plataforma</h2>
      <p>Social Plexy é um banco de dados colaborativo de vídeos focado em conteúdo dark, experimental e investigativo. A plataforma tem como finalidade a criação de comunidades criativas, interações em grupo e a produção de conteúdo audiovisual alternativo. Ao utilizar a plataforma, você concorda integralmente com estes termos.</p>

      <h2>2. Elegibilidade</h2>
      <p>O acesso é permitido a qualquer pessoa. No entanto, a criação de conta (Email Plex) e interações estão sujeitas a classificação etária automática baseada na idade informada.</p>

      <h2>3. Responsabilidade pelo Conteúdo</h2>
      <p>Cada usuário é integralmente responsável pelo conteúdo que publica. A Social Plexy não endossa, valida ou garante a autenticidade de nenhum conteúdo publicado por usuários.</p>

      <h2>4. Conteúdo Proibido</h2>
      <ul>
        <li>Conteúdo adulto (+18) ou sexualmente explícito de qualquer natureza</li>
        <li>Conteúdo ilegal ou que incite atividades criminosas</li>
        <li>Violência extrema, gore ou conteúdo perturbador sem fins educacionais</li>
        <li>Violação de direitos autorais de terceiros</li>
        <li>Assédio, bullying, discurso de ódio ou discriminação</li>
        <li>Desinformação intencional ou conteúdo manipulatório</li>
        <li>Spam, links maliciosos ou conteúdo fraudulento</li>
      </ul>

      <h2>5. Poderes da Plataforma</h2>
      <p>A Social Plexy reserva o direito de, sem aviso prévio:</p>
      <ul>
        <li>Remover qualquer conteúdo que viole estes termos</li>
        <li>Suspender ou encerrar contas infratoras</li>
        <li>Reportar atividades ilegais às autoridades competentes</li>
        <li>Modificar funcionalidades da plataforma</li>
      </ul>

      <h2>6. Sistema Email Plex</h2>
      <p>O Email Plex é o sistema de identidade próprio da Social Plexy. Endereços no formato usuario@plexysocial.com são exclusivos da plataforma e não funcionam como emails reais para comunicação externa.</p>

      <h2>7. Comunidades e Grupos</h2>
      <p>A plataforma incentiva a criação de comunidades temáticas voltadas à produção de conteúdo dark, investigativo e experimental. Grupos devem respeitar todas as regras destes termos.</p>

      <h2>8. Limitação de Responsabilidade</h2>
      <p>A Social Plexy não se responsabiliza por danos diretos ou indiretos causados pelo uso da plataforma ou pelo conteúdo publicado por terceiros.</p>
    </div>
  );
}

function PrivacyPage({ setPage }) {
  return (
    <div className="sp-doc">
      <button className="sp-back-btn" onClick={() => setPage("feed")}><Icon.ChevronLeft /> Voltar</button>
      <h1>Política de Privacidade</h1>
      <div className="sp-doc-date">Última atualização: 18 de abril de 2026</div>

      <h2>1. Dados Coletados</h2>
      <ul>
        <li><strong>Nome de usuário</strong> — para identificação na plataforma</li>
        <li><strong>Idade</strong> — para aplicação de classificação indicativa automática</li>
        <li><strong>Email Plex</strong> — identidade exclusiva na plataforma</li>
        <li><strong>Conteúdo publicado</strong> — vídeos, comentários e interações</li>
      </ul>

      <h2>2. Uso dos Dados</h2>
      <ul>
        <li>Personalizar a experiência do usuário na plataforma</li>
        <li>Aplicar classificações etárias adequadas ao conteúdo</li>
        <li>Moderar conteúdo e garantir segurança da comunidade</li>
        <li>Melhorar os serviços da plataforma</li>
      </ul>

      <h2>3. Compartilhamento</h2>
      <p>A Social Plexy não vende, aluga ou compartilha seus dados pessoais com terceiros para fins comerciais. Dados podem ser compartilhados com autoridades legais mediante solicitação judicial.</p>

      <h2>4. Segurança</h2>
      <p>Implementamos medidas técnicas para proteger seus dados. No entanto, nenhum sistema é 100% seguro. Recomendamos uso consciente da plataforma.</p>

      <h2>5. Seus Direitos</h2>
      <ul>
        <li>Solicitar exclusão de sua conta e dados</li>
        <li>Acessar os dados armazenados sobre você</li>
        <li>Corrigir informações incorretas</li>
      </ul>

      <h2>6. Contato</h2>
      <p>Para questões de privacidade: privacidade@plexysocial.com</p>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function SocialPlexy() {
  const [page, setPage] = useState("feed");
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([...BOT_USERS]);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [showAuth, setShowAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [notifications, setNotifications] = useState([
    { type: "system", text: "Bem-vindo ao Social Plexy! Explore conteúdo dark e experimental.", time: "agora" }
  ]);
  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef();

  const unreadNotifs = notifications.length;

  function addToast(text, type = "info") {
    const id = generateId();
    setToasts(t => [...t, { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  function addNotification(notif) {
    setNotifications(n => [notif, ...n]);
  }

  function handleAuthSuccess(newUser) {
    setUsers(us => [...us, newUser]);
    setCurrentUser(newUser);
    setShowAuth(false);
    addToast(`Bem-vindo, ${newUser.displayName}! Conta criada.`, "success");
    addNotification({ type: "system", text: `Conta Email Plex criada: ${newUser.email}`, time: "agora" });
  }

  function handleUpload(newVideo) {
    setVideos(vs => [newVideo, ...vs]);
    addToast("Vídeo publicado com sucesso!", "success");
    addNotification({ type: "system", text: `Seu vídeo "${newVideo.title}" foi publicado.`, time: "agora" });
  }

  function requireAuth() {
    setShowAuth(true);
  }

  function setActivePage({ page: p, videoId, userId }) {
    if (p === "player") { setActiveVideoId(videoId); setPage("player"); }
    if (p === "profile") { setProfileUserId(userId); setPage("profile"); }
  }

  const searchResults = search.length > 1
    ? videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <>
      <style>{STYLES}</style>
      <div className="sp-app">
        {/* HEADER */}
        <header className="sp-header">
          <div className="sp-logo" onClick={() => setPage("feed")}>
            <div className="sp-logo-icon"><WindmillLogo size={30} /></div>
            <span className="sp-logo-text">Social Plexy</span>
          </div>

          <div className="sp-search-wrap" ref={searchRef}>
            <span className="sp-search-icon"><Icon.Search /></span>
            <input
              className="sp-search"
              placeholder="Pesquisar vídeos..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && search.length > 1 && (
              <div className="sp-search-results">
                {searchResults.length === 0 ? (
                  <div className="sp-search-empty">
                    <div>Nenhum vídeo encontrado</div>
                    <div style={{ marginTop: 4, fontSize: 11 }}>Envie o primeiro vídeo sobre "{search}"</div>
                  </div>
                ) : searchResults.map(v => (
                  <div key={v.id} className="sp-search-item" onClick={() => { setActiveVideoId(v.id); setPage("player"); setSearch(""); }}>
                    <strong style={{ fontSize: 13 }}>{v.title}</strong>
                    <span style={{ color: "var(--text3)", marginLeft: 8, fontSize: 11 }}>{v.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sp-header-right">
            <button className="sp-icon-btn" onClick={() => setShowQuiz(true)} title="Mini Quiz">
              <Icon.GamePad />
            </button>
            <button className="sp-icon-btn" onClick={() => setShowNotifs(true)}>
              <Icon.Bell />
              {unreadNotifs > 0 && <span className="sp-notif-badge">{unreadNotifs > 9 ? "9+" : unreadNotifs}</span>}
            </button>
            {currentUser ? (
              <div
                className="sp-avatar-btn"
                style={{ background: currentUser.avatarColor || "#555", color: "#fff", border: "2px solid rgba(255,255,255,0.3)" }}
                onClick={() => { setProfileUserId(currentUser.id); setPage("profile"); }}
              >
                {currentUser.avatar}
              </div>
            ) : (
              <button className="sp-icon-btn" onClick={() => setShowAuth(true)} title="Entrar">
                <Icon.User />
              </button>
            )}
          </div>
        </header>

        {/* CATEGORIES */}
        {page === "feed" && (
          <div className="sp-nav-cats">
            {CATEGORIES.map(c => (
              <button key={c} className={`sp-cat-btn ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
            <button className="sp-cat-btn" onClick={() => setPage("terms")}>Termos</button>
            <button className="sp-cat-btn" onClick={() => setPage("privacy")}>Privacidade</button>
          </div>
        )}

        {/* MAIN */}
        <main className="sp-main">
          {page === "feed" && (
            <FeedPage
              videos={videos}
              users={users}
              currentUser={currentUser}
              setPage={setPage}
              setActiveVideo={setActiveVideoId}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              addToast={addToast}
              onRequireAuth={requireAuth}
            />
          )}
          {page === "player" && activeVideoId && (
            <PlayerPage
              videoId={activeVideoId}
              videos={videos}
              setVideos={setVideos}
              users={users}
              currentUser={currentUser}
              setPage={setPage}
              addToast={addToast}
              addNotification={addNotification}
              onRequireAuth={requireAuth}
              setActivePage={setActivePage}
            />
          )}
          {page === "profile" && (
            <ProfilePage
              userId={profileUserId}
              users={users}
              videos={videos}
              currentUser={currentUser}
              setPage={setPage}
              setActivePage={setActivePage}
            />
          )}
          {page === "terms" && <TermsPage setPage={setPage} />}
          {page === "privacy" && <PrivacyPage setPage={setPage} />}
        </main>

        {/* BOTTOM NAV */}
        <nav className="sp-bottom-nav">
          <button className={`sp-nav-btn ${page === "feed" ? "active" : ""}`} onClick={() => setPage("feed")}>
            <Icon.Home />
            <span>Início</span>
          </button>
          <button className={`sp-nav-btn ${page === "community" ? "active" : ""}`} onClick={() => addToast("Comunidades em breve!", "info")}>
            <Icon.Community />
            <span>Comunidade</span>
          </button>
          <button
            className="sp-nav-upload-btn"
            onClick={() => currentUser ? setShowUpload(true) : requireAuth()}
          >
            <Icon.Upload />
          </button>
          <button className={`sp-nav-btn`} onClick={() => setShowNotifs(true)}>
            <Icon.Bell />
            <span>Alertas</span>
          </button>
          <button className={`sp-nav-btn ${page === "profile" ? "active" : ""}`} onClick={() => currentUser ? (setProfileUserId(currentUser.id), setPage("profile")) : requireAuth()}>
            <Icon.User />
            <span>Perfil</span>
          </button>
        </nav>

        {/* MODALS */}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
        {showUpload && currentUser && <UploadModal onClose={() => setShowUpload(false)} currentUser={currentUser} onUpload={handleUpload} />}
        {showNotifs && <NotificationsPanel notifications={notifications} onClose={() => setShowNotifs(false)} />}
        {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} addToast={addToast} />}

        {/* TOASTS */}
        <Toast toasts={toasts} />
      </div>
    </>
  );
}
