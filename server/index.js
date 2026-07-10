const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Papayagan ang cross-origin requests sa express app
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Gagamit ng "*" para tanggapin ang port 5173 (Vite), 3000, o kahit saan man i-deploy
    methods: ["GET", "POST"],
  },
});

/*
  PRESENCE — now tracked SERVER-SIDE and keyed by user.id (not socket.id).
  -------------------------------------------------------------------------
  Before: each browser tab kept its own "who's online" list in
  localStorage. That only ever contained YOUR OWN data, so no matter how
  many other people joined, you'd still just see yourself (or 1 online).

  Now: the server keeps one shared map of everyone currently connected,
  and broadcasts the FULL list to every client whenever it changes. Every
  client just renders whatever the server says — no more guessing from
  local storage.

  Keyed by user.id (a stable per-account/browser identity) with a Set of
  socket ids, so if the same person has 2-3 tabs open, they still only
  count once.
*/
const onlineUsers = new Map(); // userId -> { id, name, avatar, color, location, socketIds: Set, ts }

function broadcastPresence() {
  const list = Array.from(onlineUsers.values()).map(({ socketIds, ts, ...rest }) => rest);
  io.emit('presence_update', list);
}

/*
  GAME — controllable "Community World" positions
  -------------------------------------------------------------------------
  Same pattern as presence above, but for the little playable world on the
  right side of the Communities panel. Each connected client controls its
  own avatar with WASD and streams its x/y (in percent, 0-100) to the
  server via "game_move". The server just keeps the latest known position
  per user and rebroadcasts the FULL list to everyone via "game_state" so
  every tab renders the same live positions — the server does not run
  physics/collision itself, that happens client-side (obstacles are a
  fixed shared layout baked into the client).
*/
const gamePositions = new Map(); // userId -> { id, name, avatar, color, x, y, ts }

function broadcastGameState() {
  const list = Array.from(gamePositions.values()).map(({ ts, ...rest }) => rest);
  io.emit('game_state', list);
}

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Makikinig sa "send_message" mula sa isang tab at ipapasa sa LAHAT ng tab
  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  // Client reports its current world position (sent on move + a steady
  // heartbeat while the game is active) — merge it in and rebroadcast.
  socket.on('game_move', (data) => {
    if (!data || !data.id) return;

    gamePositions.set(data.id, {
      id: data.id,
      name: data.name,
      avatar: data.avatar,
      color: data.color,
      charColor: data.charColor, // hex color for the 8-bit pixel crewmate body
      x: typeof data.x === 'number' ? data.x : 50,
      y: typeof data.y === 'number' ? data.y : 50,
      ts: Date.now(),
    });

    broadcastGameState();
  });

  // Client sends its FULL profile (id, name, avatar, color, location) on
  // join and on every heartbeat. Server merges it into the shared map and
  // rebroadcasts the complete online list to everyone.
  socket.on('presence', (profile) => {
    if (!profile || !profile.id) return;

    const existing = onlineUsers.get(profile.id);
    const socketIds = existing ? existing.socketIds : new Set();
    socketIds.add(socket.id);

    onlineUsers.set(profile.id, {
      id: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      color: profile.color,
      location: profile.location,
      socketIds,
      ts: Date.now(),
    });

    // Remember which user this socket belongs to, so we can clean up
    // correctly on disconnect.
    socket.data.userId = profile.id;

    broadcastPresence();
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);

    const userId = socket.data.userId;
    if (userId && onlineUsers.has(userId)) {
      const entry = onlineUsers.get(userId);
      entry.socketIds.delete(socket.id);

      // Only remove the user once ALL of their tabs/sockets are gone.
      if (entry.socketIds.size === 0) {
        onlineUsers.delete(userId);
        broadcastPresence();

        // They're fully gone — take their avatar out of the game world too.
        if (gamePositions.has(userId)) {
          gamePositions.delete(userId);
          broadcastGameState();
        }
      }
    }
  });
});

// Safety net: if a disconnect event is ever missed (tab crash, network
// drop without a clean close), sweep out anyone who hasn't sent a
// heartbeat in a while so they don't stay "online" forever.
const STALE_MS = 20000;
setInterval(() => {
  const now = Date.now();
  let changed = false;
  let gameChanged = false;
  for (const [id, entry] of onlineUsers.entries()) {
    if (now - entry.ts > STALE_MS) {
      onlineUsers.delete(id);
      changed = true;

      // Stale presence means a dead tab/connection — drop their game
      // avatar too so it doesn't stand frozen in the world forever.
      if (gamePositions.delete(id)) {
        gameChanged = true;
      }
    }
  }
  if (changed) broadcastPresence();
  if (gameChanged) broadcastGameState();
}, 10000);

/*
  AI-POWERED NPC — "Nova"
  -------------------------------------------------------------------------
  Nova is a small NPC character that lives in the Communities world panel
  on the client. The client periodically POSTs recent chat context here,
  and this endpoint asks the Anthropic API for one short in-character
  line for Nova to say next.

  The Anthropic API key stays server-side (never sent to the browser).
  Set it as an environment variable before starting the server:

      ANTHROPIC_API_KEY=sk-ant-...   node index.js

  If no key is set, Nova falls back to a canned greeting instead of
  erroring out, so the rest of the app keeps working.
*/
const NPC_NAME = 'Nova';

app.post('/npc-message', async (req, res) => {
  const { recent = [], online = [] } = req.body || {};

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json({
      message: `Hi, I'm ${NPC_NAME}! 👋 (set ANTHROPIC_API_KEY on the server so I can actually think)`,
    });
  }

  try {
    const context = recent
      .filter((m) => m && m.name && m.text)
      .map((m) => `${m.name}: ${m.text}`)
      .join('\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 60,
        system:
          `You are ${NPC_NAME}, a friendly NPC who lives inside a community chat app's little world panel. ` +
          `Write exactly ONE short, warm, in-character line — max 20 words, no quotes, no markdown, no emoji spam (0-1 emoji max). ` +
          `React naturally to the recent chat if there is any; otherwise just make some light small talk or greet whoever's online. ` +
          `People currently online: ${online.length ? online.join(', ') : 'nobody yet'}.`,
        messages: [
          {
            role: 'user',
            content: context
              ? `Recent chat:\n${context}\n\nSay your next line, in character.`
              : 'Nobody has said much yet. Say something in character to break the ice.',
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API responded ${response.status}`);

    const data = await response.json();
    const message =
      data?.content?.find((block) => block.type === 'text')?.text?.trim() ||
      `*waves* Hi, I'm ${NPC_NAME}!`;

    res.json({ message });
  } catch (err) {
    console.error('NPC message error:', err);
    res.json({ message: `*waves* Hi, I'm ${NPC_NAME}!` });
  }
});

// Patatakbuhin ang server sa port 3002
server.listen(3002, () => {
  console.log('Server is running on port 3002');
});