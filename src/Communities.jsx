import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Users, Circle, MessageCircle, MapPin, X, Sparkles, Gamepad2 } from 'lucide-react';
import io from 'socket.io-client';

// Kumonekta sa iyong backend server. Siguraduhing tumatakbo ito sa port 3002.
const SERVER_URL = 'http://localhost:3002';
const socket = io.connect(SERVER_URL);

/*
  Communities.jsx — Realtime cross-device community chat via Socket.io
  -----------------------------------------------------------------------
  Messages are emitted to the server and broadcast to all connected
  devices in realtime.

  -----------------------------------------------------------------------
  PRESENCE / "WHO'S ONLINE" — now fully server-driven
  -----------------------------------------------------------------------
  Previously, "online" was computed by reading localStorage, which only
  ever contains YOUR OWN browser's data. That's why 2-3 people online
  still showed as 1 — every client was only ever looking at itself.

  Now: on join and every heartbeat, this client sends its FULL profile to
  the server via the "presence" event. The server keeps one shared list
  of everyone currently connected (deduped per person, not per tab) and
  broadcasts that full list back to every client via "presence_update".
  This component just renders whatever the server says — no local
  guessing involved, so it's correct across tabs AND across devices.

  -----------------------------------------------------------------------
  PROFILE VIEW
  -----------------------------------------------------------------------
  Clicking any avatar — in the "online" stack up top, or next to a
  message — opens a small profile card (avatar, name, location, online
  status) instead of just a tooltip. This works correctly now even when
  several people are online, since each avatar in the stack corresponds
  to a real distinct online person from the server list.

  -----------------------------------------------------------------------
  GOOGLE ACCOUNT INTEGRATION
  -----------------------------------------------------------------------
  There's no auth wired into this file (no backend to check against), so
  it's built to accept the signed-in profile as a prop:

      <Communities darkMode={darkMode} googleUser={{
        id: googleProfile.sub,      // stable per-account id from Google
        name: googleProfile.name,
        picture: googleProfile.picture,
      }} />

  When `googleUser` is passed in:
    - The identity (name/avatar/location) is looked up and saved under
      that Google id, so the SAME identity comes back every time that
      account opens Communities on this browser — no name step at all,
      it's chat immediately.
    - "Fixed to the Google account" here means fixed to that account's id
      on THIS browser (localStorage). True cross-device persistence needs
      a real backend keyed by Google id — plug that into loadIdentity /
      saveIdentity below when you have one.

  When `googleUser` is NOT passed in (not wired up yet):
    - Falls back to a persistent local identity.
    - The first thing typed into the chat box becomes the display name
      (see handleSend) — there's no separate "join" screen, it's the
      same chat box the whole time.
*/

const STORAGE_KEY = 'bp_community_messages';
const IDENTITY_PREFIX = 'bp_identity_';
const ANON_ACCOUNT_KEY = 'anon-local';
const MAX_MESSAGES = 200;
const HEARTBEAT_MS = 5000;
const MAX_AVATAR_STACK = 5;

// --- AI-powered NPC ("Nova") that lives in the Community World panel ---
// Nova walks around the same little room as everyone else and periodically
// says something in character, generated server-side via /npc-message
// (which calls the Anthropic API — see index.js). The API key never
// touches the browser.
const NPC = {
  id: 'npc-nova',
  name: 'Nova',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nova-npc-guide&backgroundType=gradientLinear',
  color: 'text-cyan-300',
  charColor: '#38FEDC', // Nova's pixel-crewmate body color in the World panel
};
const NPC_REFRESH_MS = 20000; // how often Nova gets a new line
const WALK_INTERVAL_MS = 4000; // how often Nova wanders to a new spot

/*
  GAME — controllable "Community World"
  -------------------------------------------------------------------------
  The World panel is a small top-down playable space, Among-Us-style:
  click it to "enter", then drive your own avatar around with WASD (or
  arrow keys) while dodging a handful of fixed obstacles. Everyone else
  online is doing the exact same thing on their own screen, and every
  client streams its x/y (percent coordinates, 0-100) to the server via
  the "game_move" socket event; the server just relays the full list back
  out as "game_state" (see index.js) so every tab renders the same live
  positions. Collision against obstacles is resolved client-side against
  this same OBSTACLES layout, which is why it must stay identical for
  everyone — it's not sent by the server.
*/
const OBSTACLES = [
  { id: 'table-center', x: 42, y: 40, w: 18, h: 14, type: 'table' },
  { id: 'cabinet-tl', x: 4, y: 6, w: 11, h: 15, type: 'cabinet' },
  { id: 'cabinet-tr', x: 85, y: 6, w: 11, h: 15, type: 'cabinet' },
  { id: 'bed-bl', x: 4, y: 68, w: 24, h: 18, type: 'bed' },
  { id: 'box-mag-1', x: 32, y: 78, w: 9, h: 11, type: 'box' },
  { id: 'box-mag-2', x: 68, y: 78, w: 9, h: 11, type: 'box' },
  { id: 'plant-1', x: 20, y: 4, w: 6, h: 13, type: 'plant' },
  { id: 'plant-2', x: 74, y: 4, w: 6, h: 13, type: 'plant' },
  { id: 'lamp-1', x: 1, y: 36, w: 4, h: 18, type: 'lamp' },
  { id: 'lamp-2', x: 95, y: 36, w: 4, h: 18, type: 'lamp' },
];
const PLAYER_RADIUS = 5; // collision radius, in the same percent units as OBSTACLES
const GAME_SPEED = 1.15; // percent moved per animation frame
const GAME_EMIT_MS = 80; // how often position is streamed to the server
const GAME_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

function clampPercent(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// Inflates each obstacle rect by the player's radius (a cheap Minkowski
// sum) so a simple point-in-rect check doubles as a circle-vs-rect check.
function hitsObstacle(x, y) {
  return OBSTACLES.some((o) => {
    const left = o.x - PLAYER_RADIUS;
    const right = o.x + o.w + PLAYER_RADIUS;
    const top = o.y - PLAYER_RADIUS;
    const bottom = o.y + o.h + PLAYER_RADIUS;
    return x > left && x < right && y > top && y < bottom;
  });
}

const AVATAR_STYLES = ['adventurer', 'avataaars', 'big-smile', 'bottts', 'fun-emoji', 'micah', 'miniavs', 'personas'];

const NAME_COLORS = [
  'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-fuchsia-400',
  'text-violet-400', 'text-cyan-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/*
  8-BIT PIXEL CREWMATES — the Community World's little walking sprites
  -------------------------------------------------------------------------
  Instead of dropping the round dicebear avatar photos into the World
  panel, everyone gets a small blocky "crewmate" sprite (Among Us-style
  bean body + visor, drawn old-school retro-platformer style like a tiny
  Mario/Sonic sprite) rendered as a hand-built pixel grid — an SVG made of
  1x1 <rect> "pixels", so it stays crisp at any size. Each person gets a
  random body color (CHARACTER_COLORS) separate from their name-tag text
  color. Two hand-drawn frames (legs together / legs apart) are swapped
  on a timer while a character is actually moving, which is what reads as
  "walking" instead of gliding.
*/
const CHARACTER_COLORS = [
  '#C51111', // red
  '#132ED1', // blue
  '#117F2D', // green
  '#ED54BA', // pink
  '#EF7D0D', // orange
  '#F5F557', // yellow
  '#3F474E', // dark/black
  '#D6E0F0', // white
  '#6B2FBB', // purple
  '#71491E', // brown
  '#38FEDC', // cyan
  '#50EF39', // lime
];

// Lightens (positive percent) or darkens (negative percent) a hex color —
// used to auto-generate the shadow/outline/backpack shades from just the
// one base body color, so we only ever have to store one hex per person.
function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.round(Math.min(255, Math.max(0, r + 255 * percent)));
  g = Math.round(Math.min(255, Math.max(0, g + 255 * percent)));
  b = Math.round(Math.min(255, Math.max(0, b + 255 * percent)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Deterministic fallback so older saved identities (from before this
// feature existed) still get a stable, consistent color instead of a
// random one that changes every render.
function hashStringToIndex(str, mod) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % mod;
}

function getCharColor(person) {
  if (!person) return CHARACTER_COLORS[0];
  return person.charColor || CHARACTER_COLORS[hashStringToIndex(person.id, CHARACTER_COLORS.length)];
}

// Two 12x16 pixel-grid "frames" for the crewmate sprite. Each character
// is one pixel: K = outline, D = shadow shade, B = base body color,
// P = backpack, V = visor, '.' = transparent. WALK has the legs spread
// wider than IDLE — swapping between them on a timer is the whole "walk
// cycle", the same trick old 8-bit sprites used.
const CREWMATE_IDLE = [
  '....KKKK....',
  '...KDDDDK...',
  '..KDBBBBDK..',
  '.KDBBBBBBDK.',
  'KDBBVVVVBBDK',
  'KDBBVVVVBBDK',
  'KDBBBBBBBBDK',
  'KPBBBBBBBBDK',
  'KPBBBBBBBBDK',
  'KPDDDDDDDDDK',
  '.KDDDDDDDDK.',
  '..KDD..DDK..',
  '..KDD..DDK..',
  '..KBB..BBK..',
  '..KBB..BBK..',
  '..KKK..KKK..',
];

const CREWMATE_WALK = [
  ...CREWMATE_IDLE.slice(0, 11),
  'KDD......DDK',
  'KDD......DDK',
  'KBB......BBK',
  'KBB......BBK',
  'KKK......KKK',
];

// Renders one crewmate sprite from the pixel grids above. `walking` +
// `frame` together decide whether it's mid-stride; `facing` flips it to
// face left/right depending on which way it last moved.
function PixelCrewmate({ color = '#C51111', size = 32, facing = 1, walking = false, frame = 0 }) {
  const dark = shadeColor(color, -0.35);
  const pack = shadeColor(color, -0.16);
  const palette = { K: '#161022', D: dark, B: color, P: pack, V: '#bfeeff' };
  const grid = walking && frame % 2 === 1 ? CREWMATE_WALK : CREWMATE_IDLE;
  const height = size * (16 / 12);

  return (
    <div
      style={{
        width: size,
        height,
        animation: walking
          ? 'crewmate-walk-bob 0.28s steps(2) infinite'
          : 'crewmate-idle-bob 1.8s ease-in-out infinite',
      }}
    >
      <svg
        viewBox="0 0 12 16"
        width={size}
        height={height}
        shapeRendering="crispEdges"
        style={{ display: 'block', transform: facing < 0 ? 'scaleX(-1)' : 'none' }}
      >
        {grid.map((row, y) =>
          row.split('').map((ch, x) =>
            ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[ch]} />
          )
        )}
      </svg>
    </div>
  );
}

/*
  Room furniture — wooden tables & cabinets, a bed, magazine-topped boxes,
  potted plants, and glowing floor lamps. Pure CSS/gradients, no emoji or
  icon fonts, drawn to fill whatever box size OBSTACLES gives it.
*/
function Furniture({ type }) {
  if (type === 'cabinet') {
    return (
      <>
        <div
          className="absolute inset-0 rounded-md"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #8a5a30 0px, #8a5a30 10px, #79491f 10px, #79491f 20px)',
            border: '2px solid #5c3a1e',
            boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.35)',
          }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-black/25" />
        <div className="absolute left-[30%] top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2 bg-black/40" />
        <div className="absolute left-[70%] top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2 bg-black/40" />
      </>
    );
  }

  if (type === 'bed') {
    return (
      <div
        className="absolute inset-0 rounded-md"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #9c6b3f 0px, #9c6b3f 10px, #8a5a30 10px, #8a5a30 20px)',
          border: '2px solid #5c3a1e',
          boxShadow: '0 3px 6px rgba(0,0,0,0.35)',
        }}
      >
        <div className="absolute rounded-[3px]" style={{ left: '6%', right: '6%', top: '20%', bottom: '6%', background: '#f4ead9' }}>
          <div
            className="absolute rounded-[3px]"
            style={{ left: '8%', right: '8%', top: '6%', height: '22%', background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
          />
          <div
            className="absolute rounded-[3px]"
            style={{
              left: '6%', right: '6%', top: '34%', bottom: '6%',
              backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0px, #ef4444 6px, #fca5a5 6px, #fca5a5 12px)',
            }}
          />
        </div>
      </div>
    );
  }

  if (type === 'box') {
    return (
      <div className="absolute inset-0">
        {/* magazine, peeking above the box lid, rotated like it was tossed on top */}
        <div
          className="absolute rounded-sm"
          style={{ left: '15%', top: '-38%', width: '70%', height: '55%', background: '#e11d48', transform: 'rotate(-6deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.35)' }}
        >
          <div className="absolute" style={{ left: '10%', right: '10%', top: '18%', height: '10%', background: 'rgba(255,255,255,0.85)' }} />
          <div className="absolute" style={{ left: '10%', right: '25%', top: '38%', height: '8%', background: 'rgba(255,255,255,0.6)' }} />
        </div>
        {/* the box itself */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: 'linear-gradient(180deg,#c99a5b,#a9793f)',
            border: '2px solid #6b4423',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -3px 0 rgba(0,0,0,0.25)',
          }}
        />
      </div>
    );
  }

  if (type === 'plant') {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute rounded-full"
          style={{ left: '10%', bottom: '38%', width: '90%', height: '65%', background: 'radial-gradient(circle at 35% 30%, #86efac, #16a34a 70%)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ left: '-6%', bottom: '48%', width: '60%', height: '48%', background: 'radial-gradient(circle at 40% 30%, #4ade80, #15803d 70%)', transform: 'rotate(-10deg)' }}
        />
        <div
          className="absolute"
          style={{ left: '18%', bottom: 0, width: '64%', height: '42%', background: 'linear-gradient(180deg,#c2703d,#9c522a)', borderRadius: '2px 2px 6px 6px', border: '2px solid #6b3d1c' }}
        />
      </div>
    );
  }

  if (type === 'lamp') {
    return (
      <div className="absolute inset-0">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-[3px]" style={{ width: '20%', height: '66%', background: '#3f3f46' }} />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-[6px]"
          style={{ bottom: '58%', width: '100%', height: '28%', background: 'linear-gradient(180deg,#fde68a,#f59e0b)', boxShadow: '0 0 14px 4px rgba(250,204,21,0.55)' }}
        />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-[3px]" style={{ width: '58%', height: '9%', background: '#27272a' }} />
      </div>
    );
  }

  // 'table' (default) — a wood-planked tabletop with a beveled edge
  return (
    <div
      className="absolute inset-0 rounded-md"
      style={{
        backgroundImage: 'repeating-linear-gradient(90deg, #9c6b3f 0px, #9c6b3f 10px, #8a5a30 10px, #8a5a30 20px)',
        border: '2px solid #5c3a1e',
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.18), inset 0 -3px 0 rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.35)',
      }}
    />
  );
}

// Fully randomized avatar: random dicebear style + random seed salt, so
// two people with the same name still get different-looking avatars.
function generateAvatarUrl(seed) {
  const style = randomFrom(AVATAR_STYLES);
  const salt = Math.random().toString(36).slice(2);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(`${seed}-${salt}`)}&backgroundType=gradientLinear`;
}

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
  } catch {}
}

function identityStorageKey(accountKey) {
  return `${IDENTITY_PREFIX}${accountKey}`;
}

// Identity is persisted per "account" (Google id/email, or a local
// fallback key) instead of per-tab session — so it survives refreshes
// and reopening the app, tied to whichever account is signed in.
function loadIdentity(accountKey) {
  try {
    const raw = localStorage.getItem(identityStorageKey(accountKey));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveIdentity(accountKey, identity) {
  try {
    localStorage.setItem(identityStorageKey(accountKey), JSON.stringify(identity));
  } catch {}
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Best-effort approximate location via IP lookup (no permission prompt,
// unlike navigator.geolocation). Fails silently — chat still works fine
// without a location tag if the request is blocked or offline.
async function fetchApproxLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('lookup failed');
    const data = await res.json();
    const city = data.city || '';
    const region = data.region || data.country_name || '';
    const label = [city, region].filter(Boolean).join(', ');
    return label || null;
  } catch {
    return null;
  }
}

export default function Communities({ darkMode, googleUser = null }) {
  const accountKey = googleUser?.id || googleUser?.email || ANON_ACCOUNT_KEY;
  const [user, setUser] = useState(() => loadIdentity(accountKey));
  const [messages, setMessages] = useState(() => loadMessages());
  const [text, setText] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [npcMessage, setNpcMessage] = useState("Hi, I'm Nova! 👋");
  const [worldPositions, setWorldPositions] = useState({}); // Nova's cosmetic wander spot

  // --- Game: your controllable avatar + everyone else's live positions ---
  const [gameActive, setGameActive] = useState(false); // true while the world panel has focus
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 88 }); // open spawn spot, clear of OBSTACLES
  const [otherPlayers, setOtherPlayers] = useState([]); // from server "game_state", excludes self
  const movementKeysRef = useRef(new Set()); // currently-held WASD/arrow keys
  const playerPosRef = useRef(playerPos); // lets the emit-interval read the latest position without re-subscribing
  const facingRef = useRef(1); // 1 = facing right, -1 = facing left, for your own pixel crewmate sprite
  const otherMetaRef = useRef({}); // userId -> { facing, walking } derived from consecutive game_state updates
  const [frameTick, setFrameTick] = useState(0); // advances on a timer to drive the 2-frame pixel walk-cycle

  const scrollRef = useRef(null);

  // If a Google account is signed in and this is its first time here,
  // build the identity straight away — no name prompt, straight to chat.
  useEffect(() => {
    if (user) return;
    if (!googleUser) return; // anon flow: identity comes from the chat box instead

    let cancelled = false;
    (async () => {
      const location = await fetchApproxLocation();
      if (cancelled) return;
      const newUser = {
        id: accountKey,
        name: googleUser.name || 'Member',
        avatar: googleUser.picture || generateAvatarUrl(accountKey),
        color: randomFrom(NAME_COLORS),
        charColor: randomFrom(CHARACTER_COLORS),
        location,
      };
      saveIdentity(accountKey, newUser);
      setUser(newUser);
    })();

    return () => {
      cancelled = true;
    };
  }, [googleUser, user, accountKey]);

  // --- Realtime channel: messages + server-driven presence ---
  useEffect(() => {
    const handleReceiveMessage = (payload) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === payload.id)) return prev;
        const next = [...prev, payload];
        saveMessages(next);
        return next;
      });
    };

    // The server sends the COMPLETE, deduped list of who's online on
    // every change. We just trust it directly — this is what fixes the
    // "shows 1 online when there are 2-3" bug, since it's no longer
    // computed from this browser's own localStorage.
    const handlePresenceUpdate = (list) => {
      setActiveUsers(Array.isArray(list) ? list : []);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('presence_update', handlePresenceUpdate);

    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setMessages(loadMessages());
    };
    window.addEventListener('storage', onStorage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('presence_update', handlePresenceUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // --- Presence heartbeat: tell the server "I'm still here" ---
  // We send the FULL profile (not just an id) so the server can hand
  // back everything the UI needs (name, avatar, location) without a
  // second lookup.
  useEffect(() => {
    if (!user) return;

    const announce = () => socket.emit('presence', user);
    announce();

    const heartbeat = setInterval(announce, HEARTBEAT_MS);
    return () => clearInterval(heartbeat);
  }, [user]);

  // --- Community World: makes Nova "walk" ---
  // Purely cosmetic — every few seconds Nova gets a new random spot inside
  // the World panel, and CSS transitions animate the move so it reads as
  // walking rather than teleporting. Everyone else's position is now
  // player-controlled (WASD) and comes from the server instead — see the
  // game effects below.
  useEffect(() => {
    const ids = [NPC.id];

    const randomSpot = () => ({
      x: 10 + Math.random() * 76, // % from left, kept off the edges
      y: 14 + Math.random() * 66, // % from top, kept off the edges
    });

    const wander = () => {
      setWorldPositions((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = randomSpot();
        });
        // drop anyone who's no longer around
        Object.keys(next).forEach((id) => {
          if (!ids.includes(id)) delete next[id];
        });
        return next;
      });
    };

    // Make sure everyone has a starting spot immediately (no pop-in at 0,0)
    setWorldPositions((prev) => {
      const next = { ...prev };
      let changed = false;
      ids.forEach((id) => {
        if (!next[id]) {
          next[id] = randomSpot();
          changed = true;
        }
      });
      return changed ? next : prev;
    });

    const timer = setInterval(wander, WALK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // --- Game: keep a ref mirror of playerPos so the emit-interval and the
  // animation-frame loop below can always read the latest value without
  // needing to be re-created on every position change. ---
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  // --- Pixel walk-cycle: flips between the two CREWMATE frames (legs
  // together / legs apart) for every moving character, self included. ---
  useEffect(() => {
    const timer = setInterval(() => setFrameTick((f) => (f + 1) % 1000), 180);
    return () => clearInterval(timer);
  }, []);

  // --- Game: movement loop. While the world panel is focused, walk the
  // held WASD/arrow keys into a per-frame position update, sliding along
  // obstacles instead of stopping dead (x and y are resolved separately).
  useEffect(() => {
    if (!gameActive) return;

    let frame;
    const step = () => {
      const keys = movementKeysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;

      if (dx !== 0 || dy !== 0) {
        facingRef.current = dx > 0 ? 1 : dx < 0 ? -1 : facingRef.current; // flip pixel sprite to face the way you're walking
        const len = Math.hypot(dx, dy) || 1; // normalize so diagonals aren't faster
        dx = (dx / len) * GAME_SPEED;
        dy = (dy / len) * GAME_SPEED;

        setPlayerPos((prev) => {
          let nx = clampPercent(prev.x + dx, 4, 96);
          if (hitsObstacle(nx, prev.y)) nx = prev.x; // blocked horizontally — keep sliding vertically
          let ny = clampPercent(prev.y + dy, 8, 94);
          if (hitsObstacle(nx, ny)) ny = prev.y; // blocked vertically too — stay put on y
          if (nx === prev.x && ny === prev.y) return prev;
          return { x: nx, y: ny };
        });
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [gameActive]);

  // --- Game: stream your position to the server so everyone else's tab
  // can render you. Fires immediately on join, then on a steady interval
  // (not just while actively moving) so you still show up standing still
  // for others as soon as you enter the room. ---
  useEffect(() => {
    if (!user) return;

    const emitPosition = () => {
      socket.emit('game_move', {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        color: user.color,
        charColor: getCharColor(user),
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
      });
    };

    emitPosition();
    const timer = setInterval(emitPosition, GAME_EMIT_MS);
    return () => clearInterval(timer);
  }, [user]);

  // --- Game: receive everyone else's live positions from the server, and
  // derive per-player "facing" + "walking" flags by comparing each new
  // position against the last one we saw for that person — that's what
  // decides whether their pixel crewmate plays the walk-cycle and which
  // way it's flipped. ---
  useEffect(() => {
    const handleGameState = (list) => {
      const arr = Array.isArray(list) ? list.filter((p) => !user || p.id !== user.id) : [];
      const nextMeta = {};
      arr.forEach((p) => {
        const prev = otherMetaRef.current[p.id];
        const dx = prev ? p.x - prev.x : 0;
        const dy = prev ? p.y - prev.y : 0;
        nextMeta[p.id] = {
          facing: dx > 0.15 ? 1 : dx < -0.15 ? -1 : prev?.facing ?? 1,
          walking: Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15,
        };
      });
      otherMetaRef.current = nextMeta;
      setOtherPlayers(arr);
    };
    socket.on('game_state', handleGameState);
    return () => socket.off('game_state', handleGameState);
  }, [user]);

  // --- Game: keyboard handlers, wired to the focusable world panel div
  // itself (not window) so WASD only drives the game while that panel is
  // focused, and never fights with typing in the chat input. ---
  const handleGameKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (GAME_KEYS.includes(key)) {
      e.preventDefault();
      movementKeysRef.current.add(key);
    }
  }, []);

  const handleGameKeyUp = useCallback((e) => {
    movementKeysRef.current.delete(e.key.toLowerCase());
  }, []);

  // --- Nova's dialogue: ask the backend (Anthropic API, server-side) for
  // a new in-character line whenever the chat has moved or on a timer. ---
  useEffect(() => {
    let cancelled = false;

    const askNova = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/npc-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recent: messages.slice(-5).map((m) => ({ name: m.name, text: m.text })),
            online: activeUsers.map((p) => p.name),
          }),
        });
        const data = await res.json();
        if (!cancelled && data?.message) setNpcMessage(data.message);
      } catch {
        // Nova just stays quiet if this fails — rest of the app is unaffected.
      }
    };

    askNova();
    const timer = setInterval(askNova, NPC_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, activeUsers.length]);

  // --- Auto scroll to newest message ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, user]);

  // No separate "join" screen — the very first thing typed into the chat
  // box becomes the display name (used only in the anon fallback path,
  // since Google accounts already arrive with a name).
  const handleJoinViaChatBox = async (trimmedName) => {
    const newUser = {
      id: `${trimmedName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmedName,
      avatar: generateAvatarUrl(trimmedName),
      color: randomFrom(NAME_COLORS),
      charColor: randomFrom(CHARACTER_COLORS),
      location: null,
    };
    saveIdentity(accountKey, newUser);
    setUser(newUser);
    setText('');

    const location = await fetchApproxLocation();
    if (location) {
      const withLocation = { ...newUser, location };
      saveIdentity(accountKey, withLocation);
      setUser(withLocation);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!user) {
      handleJoinViaChatBox(trimmed.slice(0, 24));
      return;
    }

    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      color: user.color,
      location: user.location,
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => {
      const next = [...prev, msg];
      saveMessages(next);
      return next;
    });

    // Send message to server via Socket.io
    socket.emit('send_message', msg);
    setText('');
  };

  const cardBase = `backdrop-blur-md border rounded-[2.5rem] sm:rounded-[3rem] shadow-lg ${
    darkMode ? 'bg-white/5 border-purple-500/10' : 'bg-white/70 border-purple-200'
  }`;

  const visibleActive = activeUsers.slice(0, MAX_AVATAR_STACK);
  const extraActiveCount = Math.max(activeUsers.length - MAX_AVATAR_STACK, 0);
  const onlineCount = Math.max(activeUsers.length, user ? 1 : 0);

  const isOnline = (id) => id === NPC.id || activeUsers.some((p) => p.id === id);

  return (
    // Chat box lives on the left; on desktop the Community World panel
    // (NPC + walking members) sits beside it on the right.
    <div className="animate-fade-in max-w-[1700px] ml-0 mr-auto py-6 sm:py-10">
    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
    <div className="w-full lg:w-[420px] xl:w-[460px] lg:shrink-0 space-y-6">
      <div className={`${cardBase} p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <Users className="text-purple-500" size={20} />
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-purple-500">
              Community Chat
            </h3>
            <div className="flex items-center gap-2.5 mt-1.5">
              {/* Active users: up to 5 clickable avatar circles, then a +N overflow badge */}
              <div className="flex -space-x-2">
                {visibleActive.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setViewingProfile(p)}
                    title={p.name}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode ? 'border-purple-950' : 'border-white'
                    } bg-purple-500/10`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </button>
                ))}
                {extraActiveCount > 0 && (
                  <div
                    title={`${extraActiveCount} more online`}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-black bg-purple-600 text-white ${
                      darkMode ? 'border-purple-950' : 'border-white'
                    }`}
                  >
                    +{extraActiveCount}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1.5">
                <Circle size={7} className="text-emerald-400 fill-emerald-400 animate-pulse" />
                {onlineCount} online
              </span>
            </div>
          </div>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => setViewingProfile({ ...user, __isSelf: true })}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl border-2 border-purple-500/20 object-cover" />
            <div className="flex flex-col">
              <span className={`text-sm font-black leading-tight ${user.color}`}>{user.name}</span>
              {user.location && (
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1">
                  <MapPin size={9} /> {user.location}
                </span>
              )}
            </div>
          </button>
        )}
      </div>

      <div className={`${cardBase} flex flex-col h-[60vh] sm:h-[65vh] overflow-hidden`}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
          {!user ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 opacity-70">
              <MessageCircle size={36} className="text-purple-500" />
              <p className="text-sm font-black">👋 Welcome to the community!</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50 max-w-xs">
                Type your name below and hit send to join the conversation.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 opacity-40">
              <MessageCircle size={36} />
              <p className="text-xs font-black uppercase tracking-widest">No messages yet — say hello!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = user && m.userId === user.id;
              return (
                <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={() =>
                      setViewingProfile({
                        id: m.userId,
                        name: m.name,
                        avatar: m.avatar,
                        color: m.color,
                        location: m.location,
                        __isSelf: isMe,
                      })
                    }
                    className="shrink-0 focus:outline-none"
                  >
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl border-2 border-purple-500/20 object-cover" />
                  </button>
                  <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex flex-wrap items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-xs font-black ${m.color}`}>{m.name}</span>
                      <span className="text-[9px] font-bold opacity-30 uppercase">{formatTime(m.timestamp)}</span>
                      {m.location && (
                        <span className="text-[9px] font-bold opacity-30 uppercase flex items-center gap-0.5">
                          <MapPin size={9} /> {m.location}
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed break-words ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-tr-sm'
                          : darkMode
                          ? 'bg-white/10 rounded-tl-sm'
                          : 'bg-purple-100 rounded-tl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={handleSend}
          className={`p-4 sm:p-6 border-t flex gap-3 ${darkMode ? 'border-purple-500/10' : 'border-purple-200'}`}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, user ? 500 : 24))}
            placeholder={user ? 'Type a message...' : 'Type your name to join...'}
            maxLength={user ? 500 : 24}
            className={`flex-1 px-5 py-3.5 rounded-2xl font-medium outline-none border transition-all ${
              darkMode
                ? 'bg-white/5 border-purple-500/20 text-white placeholder-white/30 focus:border-purple-500'
                : 'bg-white border-purple-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
            }`}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3.5 sm:px-6 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-500 active:scale-95 transition-all shadow-[0_10px_25px_rgba(168,85,247,0.4)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            <span className="hidden sm:inline text-xs uppercase tracking-widest">{user ? 'Send' : 'Join'}</span>
          </button>
        </form>
      </div>
    </div>

      {/* ------------------------------------------------------------------
          Community World — desktop only, sits beside the chat box, now
          sized to roughly match the chat panel's height. A small playable
          top-down room: click it to enter, then WASD (or arrow keys)
          drive your own 8-bit pixel crewmate around a handful of
          obstacles. Nova (AI NPC) wanders on her own; everyone else
          online is controlling their own crewmate live, synced through
          the server's "game_move" / "game_state" socket events.
      ------------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:sticky lg:top-6">
        <style>{`
          @keyframes crewmate-idle-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
          @keyframes crewmate-walk-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
        `}</style>
        <div className={`${cardBase} p-4 flex flex-col gap-3 h-full`}>
          <div className="flex items-center gap-2 px-1">
            <Gamepad2 className="text-cyan-400" size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              Community World
            </h4>
            <span className="ml-auto text-[8px] font-black uppercase tracking-widest opacity-30">8-bit</span>
          </div>

          <div
            tabIndex={user ? 0 : -1}
            onClick={() => user && setGameActive(true)}
            onFocus={() => user && setGameActive(true)}
            onBlur={() => {
              setGameActive(false);
              movementKeysRef.current.clear();
            }}
            onKeyDown={handleGameKeyDown}
            onKeyUp={handleGameKeyUp}
            className={`relative h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden border outline-none select-none transition-shadow ${
              darkMode ? 'bg-zinc-900 border-zinc-700/40' : 'bg-zinc-200 border-zinc-300'
            } ${gameActive ? 'ring-2 ring-cyan-400' : ''} ${user ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            {/* Grey/white checkerboard floor tiles, like a little game-room floor */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: darkMode
                  ? 'linear-gradient(45deg, #3f3f46 25%, transparent 25%), linear-gradient(-45deg, #3f3f46 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #3f3f46 75%), linear-gradient(-45deg, transparent 75%, #3f3f46 75%)'
                  : 'linear-gradient(45deg, #d4d4d8 25%, transparent 25%), linear-gradient(-45deg, #d4d4d8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d8 75%), linear-gradient(-45deg, transparent 75%, #d4d4d8 75%)',
                backgroundSize: '28px 28px',
                backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
                backgroundColor: darkMode ? '#52525b' : '#f4f4f5',
              }}
            />

            {/* faint scanlines for a retro-arcade CRT feel, to match the pixel sprites */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)',
              }}
            />

            {/* Obstacles — wooden tables/cabinets, a bed, magazine boxes, plants, and lamps. Fixed layout, shared with the collision logic above; look comes from the <Furniture> renderer, no icons/emoji. */}
            {OBSTACLES.map((o) => (
              <div
                key={o.id}
                className="absolute pointer-events-none"
                style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%` }}
              >
                <Furniture type={o.type} />
              </div>
            ))}

            {/* Nova — the AI-powered NPC, now an 8-bit pixel crewmate */}
            <div
              className="absolute flex flex-col items-center gap-1 transition-all ease-in-out pointer-events-none"
              style={{
                left: `${worldPositions[NPC.id]?.x ?? 50}%`,
                top: `${worldPositions[NPC.id]?.y ?? 50}%`,
                transform: 'translate(-50%, -50%)',
                transitionDuration: `${WALK_INTERVAL_MS - 200}ms`,
              }}
            >
              {npcMessage && (
                <div
                  className={`mb-1 max-w-[130px] px-2.5 py-1.5 rounded-xl text-[9px] font-bold leading-snug text-center shadow-lg ${
                    darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                  }`}
                >
                  {npcMessage}
                </div>
              )}
              <PixelCrewmate color={NPC.charColor} size={30} facing={1} walking={false} frame={frameTick} />
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-300 bg-black/50 px-1.5 py-0.5 rounded-full">
                {NPC.name} · NPC
              </span>
            </div>

            {/* Everyone else online, rendered at their live server-synced position */}
            {otherPlayers.map((p) => {
              const meta = otherMetaRef.current[p.id] || { facing: 1, walking: false };
              return (
                <div
                  key={p.id}
                  className="absolute flex flex-col items-center gap-1 transition-all duration-100 ease-linear pointer-events-none"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PixelCrewmate
                    color={p.charColor || getCharColor(p)}
                    size={30}
                    facing={meta.facing}
                    walking={meta.walking}
                    frame={frameTick}
                  />
                  <span className={`text-[8px] font-black bg-black/50 px-1.5 py-0.5 rounded-full ${p.color}`}>
                    {p.name}
                  </span>
                </div>
              );
            })}

            {/* You — the WASD-controllable pixel crewmate */}
            {user && (
              <div
                className="absolute flex flex-col items-center gap-1 pointer-events-none"
                style={{
                  left: `${playerPos.x}%`,
                  top: `${playerPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <PixelCrewmate
                  color={getCharColor(user)}
                  size={34}
                  facing={facingRef.current}
                  walking={gameActive && movementKeysRef.current.size > 0}
                  frame={frameTick}
                />
                <span className={`text-[8px] font-black bg-black/50 px-1.5 py-0.5 rounded-full ${user.color}`}>
                  {user.name} · you
                </span>
              </div>
            )}

            {/* Click-to-play overlay — hidden once the panel is focused/active */}
            {!gameActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 text-white text-center px-6 pointer-events-none">
                <Gamepad2 size={22} />
                {user ? (
                  <>
                    <p className="text-[11px] font-black uppercase tracking-widest">Click to play</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">WASD to walk around</p>
                  </>
                ) : (
                  <p className="text-[10px] font-black uppercase tracking-widest">Join the chat to enter the world</p>
                )}
              </div>
            )}
          </div>

          <p className="px-1 text-[9px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">
            Click the world, then use WASD to walk your pixel crewmate around — dodge the wooden furniture. Everyone online is moving live too.
          </p>
        </div>
      </div>
    </div>

      {/* Profile card — opens when any avatar (online stack, your own, or
          a message avatar) is clicked. Online status is read live from
          the server-driven activeUsers list, so it's accurate even with
          several people connected. */}
      {viewingProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingProfile(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${cardBase} w-full max-w-sm p-6 sm:p-8 relative`}
          >
            <button
              type="button"
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={viewingProfile.avatar}
                alt={viewingProfile.name}
                className="w-20 h-20 rounded-2xl border-2 border-purple-500/20 object-cover"
              />
              <div>
                <h4 className={`text-lg font-black ${viewingProfile.color || ''}`}>
                  {viewingProfile.name}
                  {viewingProfile.__isSelf && (
                    <span className="ml-2 text-[9px] font-bold uppercase tracking-widest opacity-40 align-middle">
                      (you)
                    </span>
                  )}
                </h4>
                {viewingProfile.location && (
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center justify-center gap-1 mt-1">
                    <MapPin size={11} /> {viewingProfile.location}
                  </p>
                )}
              </div>
              {viewingProfile.__isNpc ? (
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-cyan-400">
                  <Sparkles size={11} />
                  AI companion · always here
                </span>
              ) : (
                <span
                  className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    isOnline(viewingProfile.id) || viewingProfile.__isSelf ? 'text-emerald-400' : 'opacity-40'
                  }`}
                >
                  <Circle
                    size={7}
                    className={
                      isOnline(viewingProfile.id) || viewingProfile.__isSelf
                        ? 'text-emerald-400 fill-emerald-400 animate-pulse'
                        : 'fill-current'
                    }
                  />
                  {isOnline(viewingProfile.id) || viewingProfile.__isSelf ? 'Online now' : 'Offline'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}