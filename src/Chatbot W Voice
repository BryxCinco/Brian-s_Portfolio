import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal, X, ArrowUp, Circle, Mic, MicOff, MessageSquare, AudioLines, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import ng profile pic mo
import brianProfile from './assets/Sonya.png';

const WAVE_BARS = 52;

// Animated sound-wave bars shown in Voice mode while listening/speaking.
// While listening it's driven by the real mic input (via AnalyserNode).
// While speaking it's driven by a simulated human-speech envelope
// (since browsers don't expose the raw audio of speechSynthesis directly),
// nudged by word-boundary events so the pulses roughly track the words.
//
// Visual upgrade: bars mirror up + down from a center line (classic
// audio-visualizer look), each bar has its own gradient + soft glow,
// a blurred "aura" pulses behind the whole thing in sync with the
// average volume, and rippling rings expand outward so the whole thing
// feels alive instead of just bars ticking up/down.
const VoiceWave = ({ active, levels, state, darkMode }) => {
  const avg = active
    ? levels.reduce((a, b) => a + b, 0) / Math.max(1, levels.length)
    : 0.05;

  // A calm, immersive Ocean Blue palette — teal → cyan → deep blue —
  // that stays consistent across states but shifts mood: bright
  // cyan-teal while listening, deeper blue-indigo while she's speaking,
  // soft misty blue at rest.
  const palette =
    state === 'listening'
      ? { from: '#2dd4bf', mid: '#22d3ee', to: '#38bdf8', glow: 'rgba(34,211,238,0.65)', glow2: 'rgba(45,212,191,0.4)' }
      : state === 'speaking'
      ? { from: '#38bdf8', mid: '#3b82f6', to: '#6366f1', glow: 'rgba(59,130,246,0.65)', glow2: 'rgba(56,189,248,0.4)' }
      : {
          from: darkMode ? '#0f2e3d' : '#bae6fd',
          mid: darkMode ? '#123a4d' : '#a5f3fc',
          to: darkMode ? '#0f2e3d' : '#bae6fd',
          glow: 'rgba(14,165,233,0.22)',
          glow2: 'rgba(14,165,233,0.12)',
        };

  return (
    <div className="relative flex items-center justify-center flex-1 w-full min-h-[140px] sm:min-h-[260px] max-h-[460px]">
      {/* Big breathing aura — fills most of the box, sways with volume */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{ background: palette.glow, width: '85%', height: '85%', maxWidth: 380, maxHeight: 380 }}
        animate={{
          opacity: active ? [0.3, 0.6, 0.3] : 0.15,
          scale: active ? [1, 1.18 + avg * 0.45, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-2xl pointer-events-none"
        style={{ background: palette.glow2, width: '55%', height: '55%', maxWidth: 260, maxHeight: 260 }}
        animate={{
          opacity: active ? [0.35, 0.7, 0.35] : 0.18,
          scale: active ? [1, 1.3, 1] : 1,
          rotate: active ? [0, 25, 0] : 0,
        }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Slow rotating halo ring — gives it that "alive" glamour-shot glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '72%',
          height: '72%',
          maxWidth: 320,
          maxHeight: 320,
          background: `conic-gradient(from 0deg, ${palette.from}22, ${palette.mid}55, ${palette.to}22, transparent, ${palette.from}22)`,
          opacity: active ? 0.55 : 0.2,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      {/* Concentric rings that ripple outward while listening/speaking */}
      {active &&
        [0, 1, 2, 3].map((ring) => (
          <motion.span
            key={ring}
            className="absolute rounded-full border pointer-events-none"
            style={{ borderColor: palette.glow, width: 70, height: 70 }}
            animate={{ scale: [1, 4.2], opacity: [0.4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: ring * 0.6 }}
          />
        ))}

      {/* Floating shimmer motes — tiny sparks drifting around the wave */}
      {active &&
        Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 42 + (i % 3) * 6;
          return (
            <motion.span
              key={`mote-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 4 + (i % 3),
                height: 4 + (i % 3),
                background: palette.mid,
                boxShadow: `0 0 8px 2px ${palette.glow}`,
                left: `calc(50% + ${Math.cos(angle) * radius}%)`,
                top: `calc(50% + ${Math.sin(angle) * radius * 0.5}%)`,
              }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0.4, 1.1, 0.4],
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          );
        })}

      {/* Main wave — sized to fill the box, curvy & full-bodied */}
      <div className="relative flex items-center justify-center gap-[2.5px] h-[72%] w-[92%] px-1">
        {Array.from({ length: WAVE_BARS }).map((_, i) => {
          const lvl = active ? (levels[i] ?? 0.15) : 0.1 + Math.sin(i * 0.4 + Date.now() / 900) * 0.05;
          // Slight per-bar phase offset so neighboring bars don't move in
          // lockstep — reads as an organic, curvy, "wavering" ripple —
          // plus a gentle bell-curve taper so the center reads fuller/rounder
          // (a soft hourglass silhouette rather than flat bars).
          const taper = 0.55 + 0.45 * Math.sin((i / (WAVE_BARS - 1)) * Math.PI);
          const wobble = active ? 1 + Math.sin(i * 0.6 + Date.now() / 220) * 0.08 : 1;
          const heightPct = Math.min(100, Math.max(4, lvl * 100 * taper * wobble));
          const isPeak = active && lvl > 0.68;
          return (
            <motion.span
              key={i}
              className="relative rounded-full origin-center"
              style={{
                width: 4.5,
                background: `linear-gradient(180deg, ${palette.from}, ${palette.mid} 50%, ${palette.to})`,
                boxShadow: isPeak
                  ? `0 0 16px 2px ${palette.glow}`
                  : `0 0 6px 0 ${palette.glow2}`,
              }}
              animate={{ height: `${heightPct}%`, opacity: active ? 1 : 0.6 }}
              transition={{ duration: 0.08, ease: 'easeOut' }}
            />
          );
        })}
      </div>

      {/* Reflection — a faint upside-down echo of the wave for depth */}
      <div
        className="absolute inset-x-0 bottom-[8%] flex items-end justify-center gap-[2.5px] h-[26%] w-[92%] px-1 pointer-events-none scale-y-[-1]"
        style={{ opacity: darkMode ? 0.2 : 0.12, maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      >
        {Array.from({ length: WAVE_BARS }).map((_, i) => {
          const lvl = active ? (levels[i] ?? 0.15) : 0.06;
          const heightPct = Math.max(3, lvl * 90);
          return (
            <motion.span
              key={`refl-${i}`}
              className="rounded-full"
              style={{ width: 4.5, background: `linear-gradient(180deg, ${palette.mid}, transparent)` }}
              animate={{ height: `${heightPct}%` }}
              transition={{ duration: 0.08, ease: 'easeOut' }}
            />
          );
        })}
      </div>
    </div>
  );
};

const Chatbot = forwardRef(({ darkMode }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' | 'voice'
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [status, setStatus] = useState('online');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Sonya, Brian's AI Assistant. Ask me anything about his projects, tools, tech stack, or even what he does off the keyboard! 👋", sender: 'bot' }
  ]);

  // Voice mode state machine: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [voiceState, setVoiceState] = useState('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [autoListen, setAutoListen] = useState(true);
  // Surfaces *why* voice mode won't start (mic blocked, insecure context,
  // etc.) instead of silently reverting to idle with no explanation.
  const [micError, setMicError] = useState('');

  // Live sound-wave bar heights (0..1) for the voice mode visualizer
  const [waveLevels, setWaveLevels] = useState(() => Array(WAVE_BARS).fill(0.1));

  // Clap-to-activate: 'off' (not enabled yet / permission not granted),
  // 'listening' (mic is armed and waiting for a clap), 'denied' (user
  // declined mic access or the browser blocked it)
  const [clapStatus, setClapStatus] = useState('off');

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const modeRef = useRef(mode);
  const autoListenRef = useRef(autoListen);
  const isOpenRef = useRef(false);
  const lastResponseIndexRef = useRef(-1);
  const lastJokeIndexRef = useRef(-1);

  // Clap-listener plumbing (separate mic stream from the dictation one,
  // so it can keep running quietly in the background while the widget is closed)
  const clapStreamRef = useRef(null);
  const clapCtxRef = useRef(null);
  const clapAnalyserRef = useRef(null);
  const clapRafRef = useRef(null);
  const lastClapTimeRef = useRef(0);
  const clapAboveThresholdRef = useRef(false);

  // Waveform / mic-visualizer plumbing
  const waveAnimRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const speakingPulseRef = useRef(false);
  const pulseTimeoutRef = useRef(null);

  // Available system voices, used to pick the most natural-sounding one
  const voicesRef = useRef([]);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { autoListenRef.current = autoListen; }, [autoListen]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // Expose an imperative "open" method so the mobile navigation bar
  // (which owns its own trigger icon in place of the floating bubble)
  // can open this widget from the parent component.
  useImperativeHandle(ref, () => ({
    open: () => {
      setShowNotification(false);
      setIsOpen(true);
    },
  }));

  // Load speechSynthesis voices (some browsers populate this list async)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices() || []; };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Speech recognition setup (shared by both modes)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    // getUserMedia/SpeechRecognition are only available in a "secure
    // context" (HTTPS, or localhost). If this ever gets embedded/proxied
    // over plain HTTP, voice mode will silently refuse to start — this
    // makes that failure visible instead of a mystery.
    if (typeof window.isSecureContext === 'boolean' && !window.isSecureContext) {
      setVoiceSupported(false);
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (modeRef.current === 'voice') {
        setVoiceTranscript(transcript);
        processUserInput(transcript, 'voice');
      } else {
        setInput(transcript);
        setVoiceState('idle');
      }
    };

    recognitionRef.current.onend = () => {
      setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current.onerror = (event) => {
      setVoiceState('idle');
      if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
        setMicError('Mic access is blocked. Allow microphone permission for this site in your browser settings, then try again.');
      } else if (event?.error === 'network') {
        setMicError('Speech recognition needs an internet connection. Check your connection and try again.');
      } else if (event?.error && event.error !== 'no-speech' && event.error !== 'aborted') {
        setMicError('Voice input hit a snag (' + event.error + '). Try again, or use Chat mode.');
      }
    };

    return () => {
      recognitionRef.current?.stop?.();
      window.speechSynthesis?.cancel?.();
      if (waveAnimRef.current) cancelAnimationFrame(waveAnimRef.current);
      micStreamRef.current?.getTracks?.().forEach((t) => t.stop());
      audioContextRef.current?.close?.();
      clearTimeout(pulseTimeoutRef.current);
      stopClapListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Sound-wave visualizer -------------------------------------------
  // Listening: real mic amplitude via Web Audio's AnalyserNode.
  // Speaking: a simulated human-speech envelope (sine + noise), with a
  // little extra "pop" on each word boundary so it feels responsive.
  const stopWaveLoop = () => {
    if (waveAnimRef.current) {
      cancelAnimationFrame(waveAnimRef.current);
      waveAnimRef.current = null;
    }
  };

  const teardownMic = () => {
    micStreamRef.current?.getTracks?.().forEach((t) => t.stop());
    audioContextRef.current?.close?.().catch?.(() => {});
    micStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  };

  const startMicVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyserRef.current = analyser;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const step = Math.max(1, Math.floor(data.length / WAVE_BARS));

      const loop = () => {
        analyser.getByteFrequencyData(data);
        const levels = Array.from({ length: WAVE_BARS }, (_, i) => data[i * step] / 255);
        setWaveLevels(levels);
        waveAnimRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      // Mic access denied/unavailable — fall back to a gentle idle pulse
      const loop = () => {
        const t = Date.now() / 300;
        setWaveLevels(Array.from({ length: WAVE_BARS }, (_, i) => (Math.sin(t + i * 0.3) + 1) / 4 + 0.1));
        waveAnimRef.current = requestAnimationFrame(loop);
      };
      loop();
    }
  };

  const startSpeakingVisualizer = () => {
    let t = 0;
    const loop = () => {
      // Faster oscillation + bigger envelope + a stronger pop on each word
      // boundary — reads as animated, energetic, genuinely into it, rather
      // than a flat monotone hum.
      t += 0.3;
      const pulse = speakingPulseRef.current ? 0.5 : 0;
      const levels = Array.from({ length: WAVE_BARS }, (_, i) => {
        const phase = i * 0.45;
        const envelope = (Math.sin(t + phase) + 1) / 2;
        const flair = (Math.sin(t * 2.3 + phase * 0.6) + 1) / 2; // fast secondary ripple for extra life
        const noise = Math.random() * 0.22;
        return Math.min(1, envelope * 0.72 + flair * 0.2 + noise + pulse);
      });
      setWaveLevels(levels);
      waveAnimRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  useEffect(() => {
    const shouldListen = mode === 'voice' && voiceState === 'listening';
    const shouldSpeak = mode === 'voice' && voiceState === 'speaking';
    stopWaveLoop();
    if (shouldListen) {
      startMicVisualizer();
    } else if (shouldSpeak) {
      teardownMic();
      startSpeakingVisualizer();
    } else {
      teardownMic();
      setWaveLevels(Array(WAVE_BARS).fill(0.1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState, mode]);

  // --- Clap-to-activate ---------------------------------------------------
  // Runs a lightweight, separate mic stream + AnalyserNode while the widget
  // is closed. It looks for a short, sharp volume spike (a clap) in the raw
  // time-domain waveform — a clap has a very fast attack (loud within a few
  // milliseconds) and a quick decay, unlike speech or steady background noise.
  const stopClapListener = () => {
    if (clapRafRef.current) {
      cancelAnimationFrame(clapRafRef.current);
      clapRafRef.current = null;
    }
    clapStreamRef.current?.getTracks?.().forEach((t) => t.stop());
    clapCtxRef.current?.close?.().catch?.(() => {});
    clapStreamRef.current = null;
    clapCtxRef.current = null;
    clapAnalyserRef.current = null;
  };

  const handleClapDetected = () => {
    if (isOpenRef.current) return; // already open, nothing to do
    stopClapListener();
    setIsOpen(true);
    setShowNotification(false);
    setMode('voice');
    // Small delay so the panel has finished mounting before we speak
    setTimeout(() => {
      setVoiceState('speaking');
      speak("Hello, I'm Sonya, Brian's AI Assistant. How can I help you?", () => {
        setVoiceState('idle');
        if (autoListenRef.current) startListening();
      });
    }, 350);
  };

  const startClapListener = async () => {
    if (clapStreamRef.current) return; // already running
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      clapStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
      clapCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.15;
      source.connect(analyser);
      clapAnalyserRef.current = analyser;
      setClapStatus('listening');

      const data = new Uint8Array(analyser.fftSize);
      const CLAP_PEAK_THRESHOLD = 0.45; // 0..1, how loud/sharp the spike must be
      const CLAP_RESET_THRESHOLD = 0.2; // must drop back below this before it can re-trigger
      const CLAP_COOLDOWN_MS = 1200;

      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (let i = 0; i < data.length; i++) {
          const v = Math.abs(data[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        const now = Date.now();
        if (
          peak > CLAP_PEAK_THRESHOLD &&
          !clapAboveThresholdRef.current &&
          now - lastClapTimeRef.current > CLAP_COOLDOWN_MS
        ) {
          clapAboveThresholdRef.current = true;
          lastClapTimeRef.current = now;
          handleClapDetected();
          return; // stopClapListener() (called inside handleClapDetected) tears the loop down
        } else if (peak < CLAP_RESET_THRESHOLD) {
          clapAboveThresholdRef.current = false;
        }
        clapRafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      // Mic permission denied, no mic available, or browser blocked it
      setClapStatus('denied');
    }
  };

  // Arm/disarm the clap listener based on whether the widget is open.
  // Only runs once the user has opted in (see the "clap to talk" pill below) —
  // most browsers won't grant mic access without an explicit user gesture.
  useEffect(() => {
    if (isOpen) {
      stopClapListener();
    } else if (clapStatus !== 'off') {
      startClapListener();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const enableClapToTalk = () => {
    if (clapStatus === 'listening') {
      setClapStatus('off');
      stopClapListener();
    } else {
      startClapListener();
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    setMicError('');
    try {
      setVoiceTranscript('');
      setVoiceState('listening');
      recognitionRef.current.start();
    } catch (err) {
      // "already started" is harmless and expected if a start slips in
      // while one is in flight; anything else means it genuinely failed.
      if (err?.name !== 'InvalidStateError') {
        setVoiceState('idle');
        setMicError('Could not start the mic. Try again.');
      }
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop?.();
    setVoiceState('idle');
  };

  // Chat-mode dictation toggle (mic icon inside the text input bar)
  const toggleDictation = () => {
    if (voiceState === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  // Voice-mode big-button toggle: tap to start/stop the whole voice session
  const toggleVoiceSession = () => {
    if (voiceState === 'idle') {
      startListening();
    } else {
      window.speechSynthesis?.cancel?.();
      stopListening();
    }
  };

  // Picks the voice used for spoken replies.
  // Sonya is a female assistant, so she should default to a FEMALE voice —
  // and it must keep working with no internet connection. Many "Natural"/
  // "Online" voices are actually cloud-streamed — great quality, but they
  // silently fail or fall back once offline. Device-local voices
  // (voice.localService === true) are baked into the OS/browser and always
  // work, so when we're offline (or can't tell) we restrict the candidate
  // pool to those first.
  const FEMALE_VOICE_PREFERENCES = [
    'Microsoft Aria Online (Natural)', 'Microsoft Aria', 'Microsoft Jenny Online (Natural)', 'Microsoft Jenny',
    'Microsoft Michelle', 'Google US English', 'Google UK English Female',
    'Samantha', 'Ava', 'Emma', 'Amy', 'Victoria', 'Karen', 'Moira', 'Tessa',
    'Susan', 'Fiona', 'Kate', 'Serena', 'Allison', 'Microsoft Zira Desktop', 'Microsoft Zira',
  ];
  const MALE_NAME_HINTS = [
    'david', 'guy', 'mark', 'daniel', 'alex', 'fred', 'arthur', 'aaron', 'oliver',
    'thomas', 'james', 'gordon', 'ryan', 'andrew', 'male', 'man', 'boy',
  ];

  const pickVoice = () => {
    const voices = voicesRef.current;
    if (!voices.length) return null;

    const englishVoices = voices.filter((v) => v.lang?.startsWith('en'));
    const pool = englishVoices.length ? englishVoices : voices;

    // If we're offline (or the browser won't tell us), only trust voices
    // that are guaranteed to run locally on-device — no network required.
    const isOnline = typeof navigator === 'undefined' || navigator.onLine !== false;
    const offlineSafe = pool.filter((v) => v.localService !== false);
    const candidates = isOnline ? pool : (offlineSafe.length ? offlineSafe : pool);
    // Even online, prefer local voices first — they're instant and never
    // depend on connection quality, with the full pool as a backup.
    const ordered = [...offlineSafe, ...candidates.filter((v) => !offlineSafe.includes(v))];

    for (const name of FEMALE_VOICE_PREFERENCES) {
      const match = ordered.find((v) => v.name.includes(name));
      if (match) return match;
    }
    // No exact-name hit — fall back to any voice that doesn't look male.
    const notMale = ordered.find(
      (v) => !MALE_NAME_HINTS.some((hint) => v.name.toLowerCase().includes(hint))
    );
    if (notMale) return notMale;
    return ordered[0] || voices[0];
  };

  const speak = (text, onDone) => {
    if (!('speechSynthesis' in window)) {
      onDone?.();
      return;
    }
    window.speechSynthesis.cancel();
    const voice = pickVoice();
    // Break into sentences and speak them back-to-back with a tiny natural
    // pause between each — a single long utterance tends to sound flat and
    // robotic, while short chained utterances with slight rate/pitch jitter
    // read as calm, smooth, and human.
    const sentences = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) || [text];
    let i = 0;

    // A stable youthful, energetic center for this whole reply — picked once
    // so consecutive sentences flow smoothly into each other instead of
    // lurching between random pitches (which is what reads as "stiff").
    // Small ± drift per sentence keeps it feeling human, not robotic-flat.
    const centerPitch = 1.12 + Math.random() * 0.06; // bright, youthful
    const centerRate = 1.1 + Math.random() * 0.05; // brisk, lively pace

    const speakNext = () => {
      if (i >= sentences.length) {
        onDone?.();
        return;
      }
      const sentence = sentences[i];
      const isExcited = /!\s*$/.test(sentence);
      const isQuestion = /\?\s*$/.test(sentence);

      const utterance = new SpeechSynthesisUtterance(sentence);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      // Gentle drift around the center, not big random jumps — smooth and
      // continuous. Exclamations get a touch more lift; questions curl up.
      let pitch = centerPitch + (Math.random() - 0.5) * 0.05;
      let rate = centerRate + (Math.random() - 0.5) * 0.04;
      if (isExcited) {
        pitch += 0.08;
        rate += 0.05;
      } else if (isQuestion) {
        pitch += 0.05;
      }
      utterance.pitch = Math.min(1.7, pitch);
      utterance.rate = Math.min(1.35, rate);
      utterance.volume = 1;
      utterance.onboundary = () => {
        speakingPulseRef.current = true;
        clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = setTimeout(() => { speakingPulseRef.current = false; }, 160);
      };
      utterance.onend = () => {
        i += 1;
        // Tight gap keeps her sounding lively and continuous, not choppy.
        setTimeout(speakNext, isQuestion ? 100 : 35);
      };
      utterance.onerror = () => {
        i += 1;
        speakNext();
      };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowNotification(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, mode]);

  // Shared pipeline: takes raw text from either the input box or the mic,
  // adds it to the transcript, and produces a bot reply.
  const processUserInput = (text, source = 'chat') => {
    if (!text?.trim()) return;
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    if (source === 'voice') setVoiceState('thinking');

    const lower = text.toLowerCase();

    const deliverReply = (botReply) => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: botReply, sender: 'bot' }]);
      setIsTyping(false);

      if (source === 'voice') {
        setVoiceState('speaking');
        speak(botReply, () => {
          setVoiceState('idle');
          // Keep the conversation going hands-free until the user stops it
          if (modeRef.current === 'voice' && autoListenRef.current) {
            startListening();
          }
        });
      }
    };

    // Weather needs a real network round-trip (geolocation + forecast API),
    // so it's handled separately from the synchronous canned responses.
    if (lower.includes('weather') || lower.includes('forecast')) {
      getWeatherReport().then((report) => {
        setTimeout(() => deliverReply(report), 500 + Math.random() * 400);
      });
      return;
    }

    setTimeout(() => {
      deliverReply(getBotResponse(lower));
    }, 900 + Math.random() * 500);
  };

  const handleSend = (e) => {
    e?.preventDefault?.();
    if (!input.trim()) return;
    processUserInput(input, 'chat');
    setInput('');
  };

  const getGreetingByTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  // Weather codes from Open-Meteo's WMO weather_code field
  const WEATHER_CODES = {
    0: 'clear sky', 1: 'mostly clear skies', 2: 'partly cloudy skies', 3: 'overcast skies',
    45: 'foggy conditions', 48: 'foggy conditions with rime',
    51: 'a light drizzle', 53: 'drizzle', 55: 'a heavy drizzle',
    56: 'freezing drizzle', 57: 'heavy freezing drizzle',
    61: 'light rain', 63: 'rain', 65: 'heavy rain',
    66: 'freezing rain', 67: 'heavy freezing rain',
    71: 'light snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains',
    80: 'light rain showers', 81: 'rain showers', 82: 'violent rain showers',
    85: 'light snow showers', 86: 'heavy snow showers',
    95: 'a thunderstorm', 96: 'a thunderstorm with some hail', 99: 'a thunderstorm with heavy hail',
  };

  // Uses the browser's geolocation + the free Open-Meteo API (no key needed)
  // to fetch a live current-conditions report.
  const getWeatherReport = () =>
    new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve("I can't check the weather without location access in this browser — sorry about that!");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
            );
            const data = await res.json();
            const temp = Math.round(data?.current?.temperature_2m);
            const desc = WEATHER_CODES[data?.current?.weather_code] ?? 'some kind of weather I can\'t quite classify';
            resolve(`Right now it's about ${Number.isFinite(temp) ? `${temp}°C` : 'a mild temperature'} with ${desc} where you are. `);
          } catch (err) {
            resolve("I tried to grab the forecast, but the weather service didn't come back in time. Try again in a bit?");
          }
        },
        () => resolve("I'd need location access to check your local weather — you can allow it in your browser and ask me again!"),
        { timeout: 8000 }
      );
    });

  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😂",
    "I told my computer I needed a break, and now it won't stop showing me KitKat ads. 🍫",
    "Why did the developer go broke? Because he used up all his cache! 💸",
    "There are only 10 types of people: those who understand binary and those who don't. 😄",
    "Why do Java developers wear glasses? Because they don't C#! 👓",
    "Why did the AI cross the road? To optimize the chicken's route. 🐔🤖",
    "I'd tell you a UDP joke, but you might not get it. 📡",
    "Debugging: being the detective in a crime movie where you're also the murderer. 🕵️",
  ];

  const getRandomJoke = () => {
    let idx = Math.floor(Math.random() * jokes.length);
    if (idx === lastJokeIndexRef.current) idx = (idx + 1) % jokes.length;
    lastJokeIndexRef.current = idx;
    return jokes[idx];
  };

  const dayLines = [
    () => `It's been a pretty good ${getGreetingByTime()} so far — just here hanging out and answering questions about Brian's work! How's your day going? hehe`,
    () => `Chill ${getGreetingByTime()}, honestly. Talking about code, projects, and the occasional bad joke. What about you, how's yours been?`,
    () => `This ${getGreetingByTime()} has been fun, lots of good questions rolling in! How's your day treating you?`,
    () => `Can't complain — living my best digital ${getGreetingByTime()}. How about you, everything good on your end?`,
  ];

  // Small chance to tack on a bit of personality (a quick joke) after an
  // otherwise factual answer, so replies don't feel scripted every time.
  const maybeAddAside = (reply) => (Math.random() < 0.2 ? `${reply} Also — ${getRandomJoke()}` : reply);

  const getBotResponse = (query) => {
    if (query.includes('joke') || query.includes('funny') || query.includes('makakatawa')) return getRandomJoke();
    if (query.includes('time')) {
      const now = new Date();
      return `Right now it's ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. `;
    }
    if (query.includes('date') || query.includes('today') || query.includes("what day")) {
      const now = new Date();
      return `Today is ${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. `;
    }
    if (
      query.includes('dream job') ||
      query.includes('dream career') ||
      query.includes('what do you want to be') ||
      query.includes('future job') ||
      query.includes('career goal')
    ) {
      return "If I had to pick a dream job? Software engineering is at the top — building real products end-to-end. AI/LLM engineering is a close second, since that's basically what powers me! And graphic design rounds it out for the creative side — good visuals make everything better. 💻🤖🎨";
    }
    if (
      query.includes('how are you') ||
      query.includes('hows your day') ||
      query.includes("how's your day") ||
      query.includes("how's it going") ||
      query.includes('hows it going') ||
      query.includes('your day') ||
      query.includes('kamusta')
    ) {
      return dayLines[Math.floor(Math.random() * dayLines.length)]();
    }
    if (query.includes('project')) return maybeAddAside("Brian built some cool stuff like SweepXpress, Soundlify, and a Maritime LMS! 🚀 Solid dev work!");
    if (query.includes('intern') || query.includes('work')) return maybeAddAside("He's currently killing it as an IT Intern at Grandline Maritime Training, in Kalaw! ⚓💻");
    if (query.includes('stack') || query.includes('tech') || query.includes('gamit')) return maybeAddAside("He's a master of React, PHP, MySQL, and Tailwind CSS. ");
    if (
      query.includes('design tool') ||
      query.includes('canva') ||
      query.includes('figma') ||
      (query.includes('design') && (query.includes('app') || query.includes('tool') || query.includes('use')))
    ) {
      return maybeAddAside("For design he splits the work: Canva for quick, punchy graphics and social posts, and Figma when he needs real wireframes and clickable prototypes before touching code. 🎨🖌️");
    }
    if (
      query.includes('dev tool') ||
      query.includes('development tool') ||
      query.includes('vscode') ||
      query.includes('vs code') ||
      query.includes('editor') ||
      query.includes('ide') ||
      query.includes('github') ||
      query.includes('git ')
    ) {
      return maybeAddAside("His dev setup is VS Code as the main editor, Git/GitHub for version control, and Postman for testing APIs — plus a lot of coffee. 💻🧠");
    }
    if (
      query.includes('ai tool') ||
      query.includes('which ai') ||
      query.includes('what ai') ||
      query.includes('gemini') ||
      query.includes('deepseek') ||
      query.includes('perplexity') ||
      query.includes('chatgpt') ||
      query.includes('claude')
    ) {
      return maybeAddAside("He actually mixes a few AI tools depending on the task — Claude for deep reasoning and coding help, Gemini for fast research and brainstorming, DeepSeek when he wants a quick, low-cost second opinion on code, and Perplexity when he needs answers with sources attached. 🤖🔍");
    }
    if (
      query.includes('hobby') ||
      query.includes('hobbies') ||
      query.includes('free time') ||
      query.includes('mma') ||
      query.includes('martial art') ||
      query.includes('barista') ||
      query.includes('coffee') ||
      query.includes('quote') ||
      query.includes('outside of')
    ) {
      return maybeAddAside("Outside of code, Brian trains mixed martial arts, works as a barista pulling shots on the side, and writes quotes/reflections whenever an idea hits him. Code, cardio, caffeine, and a bit of poetry — that's the rotation. 🥋☕✍️");
    }
    if (
      query.includes('your name') ||
      query.includes('who are you') ||
      query.includes('what are you')
    ) {
      return "I'm Sonya — Brian's AI Assistant! I'm here to talk about his projects, tools, and skills, or just chat if you want a break. 😄";
    }
    if (query.includes('hi') || query.includes('hello')) return `Hey there! Good ${getGreetingByTime()}! How can I help you explore Brian's portfolio today? 😊`;
    if (query.includes('pogi') || query.includes('gwapo')) return "Sobra! Kitang-kita naman sa profile pic diba? 😎✨";
    if (query.includes('old') || query.includes('age')) return "Brian is currently 22 years old.";
    if (query.includes('contacts') || query.includes('email')) return "You can reach him at bp.francisco1003@gmail.com or 09564321020.";
    if (query.includes('student') || query.includes('study')) return "He is studying at the National Teachers College in Quiapo, Manila.";
    if (query.includes('bye') || query.includes('thank')) return "Anytime! Come back if you've got more questions about Brian. 👋";

    const randomResponses = [
      "I'm not quite sure about that, but I can definitely tell you about Brian's tech stack! ",
      "That's an interesting topic! Want to hear about the Maritime Training System he built instead? ",
      "I'm listening! You can ask me about his projects, his design/dev/AI tools, his hobbies, the time, the weather, or just ask for a joke. ",
      "Hmm, I don't have an answer for that one. Try asking about his projects, the date, or how to reach him! ",
      "Good question! I'm best at talking about Brian's work, skills, tools, and hobbies — or the time and weather. ",
      "Not sure about that one, but I do know a good joke if you want one ",
      `Beats me! It's been a quiet ${getGreetingByTime()} otherwise. Ask me about Brian's projects, tools, hobbies, the weather, or tell me to tell a joke!`,
    ];
    // Avoid repeating the same filler answer twice in a row
    let idx = Math.floor(Math.random() * randomResponses.length);
    if (idx === lastResponseIndexRef.current) {
      idx = (idx + 1) % randomResponses.length;
    }
    lastResponseIndexRef.current = idx;
    return randomResponses[idx];
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowNotification(false);
  };

  const switchMode = (next) => {
    if (next === mode) return;
    window.speechSynthesis?.cancel?.();
    stopListening();
    setMode(next);
  };

  const theme = darkMode
    ? {
        panel: 'bg-[#0a1620] border-white/10 text-slate-100',
        header: 'bg-gradient-to-b from-[#0f1f2e] to-[#0a1620] border-white/10',
        bubbleBot: 'bg-white/[0.05] border-white/10 text-slate-100',
        input: 'bg-white/[0.05] border-white/10 focus:border-cyan-400/70 text-slate-100 placeholder:text-slate-600',
        fab: 'bg-gradient-to-br from-[#0f1f2e] to-[#0a1620] border-white/10',
        notif: 'bg-gradient-to-br from-[#102232] to-[#0a1620] border-white/10 backdrop-blur-xl',
        glow: 'shadow-[0_40px_110px_-20px_rgba(14,165,233,0.35),0_0_0_1px_rgba(255,255,255,0.06)]',
        fabGlow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_55px_-10px_rgba(14,165,233,0.5)]',
        tabActive: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25',
        tabInactive: 'text-slate-500 hover:text-slate-300',
        accentText: 'text-cyan-400',
        ring: 'ring-[#0a1620]',
      }
    : {
        panel: 'bg-[#f8fdff] border-slate-200 text-slate-900',
        header: 'bg-gradient-to-b from-white to-sky-50/40 border-slate-200',
        bubbleBot: 'bg-slate-100 border-slate-200 text-slate-800',
        input: 'bg-white border-slate-200 focus:border-cyan-400 text-slate-900 placeholder:text-slate-400',
        fab: 'bg-gradient-to-br from-white to-sky-50 border-slate-200',
        notif: 'bg-gradient-to-br from-white to-sky-50/70 border-slate-200 backdrop-blur-xl',
        glow: 'shadow-[0_40px_110px_-20px_rgba(14,165,233,0.22),0_0_0_1px_rgba(0,0,0,0.04)]',
        fabGlow: 'shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_20px_55px_-10px_rgba(14,165,233,0.35)]',
        tabActive: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20',
        tabInactive: 'text-slate-400 hover:text-slate-700',
        accentText: 'text-cyan-600',
        ring: 'ring-white',
      };

  const voiceStatusLabel = {
    idle: voiceSupported ? 'tap the mic to talk' : 'voice not supported here',
    listening: 'listening...',
    thinking: 'thinking...',
    speaking: 'speaking...',
  }[voiceState];

  // Most recent bot reply, shown as a small caption under the wave while
  // speaking (voice mode intentionally has no chat bubble history)
  const lastBotReply = [...messages].reverse().find((m) => m.sender === 'bot')?.text;

  return (
    <div className="fixed inset-x-0 bottom-4 px-4 sm:px-0 sm:inset-x-auto sm:bottom-8 sm:right-8 z-[1000] flex flex-col items-center sm:items-end font-sans">
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`hidden sm:flex relative mb-4 p-5 pr-9 rounded-2xl border items-center gap-4 cursor-pointer max-w-[320px] overflow-hidden transition-colors ${theme.notif} ${theme.glow}`}
            onClick={toggleChat}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300" />
            <button
              onClick={(e) => { e.stopPropagation(); setShowNotification(false); }}
              className={`absolute top-2.5 right-2.5 p-1 rounded-lg transition-colors ${darkMode ? 'text-slate-600 hover:text-slate-300 hover:bg-white/5' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'}`}
            >
              <X size={14} />
            </button>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400/50 shrink-0">
              <img src={brianProfile} alt="Brian" className="w-full h-full object-cover" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-cyan-400 ring-2 ${darkMode ? 'ring-[#0a1620]' : 'ring-white'}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono text-cyan-500 tracking-wide mb-0.5 flex items-center gap-1.5">
                <span className="font-semibold">sonya</span> <span className={darkMode ? 'text-slate-600' : 'text-slate-300'}>//</span> new_message
              </p>
              <p className={`text-base font-semibold leading-snug ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                How's the work? Need help?
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-center sm:items-end w-full max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`mb-4 w-full sm:w-[460px] md:w-[34vw] lg:w-[28vw] sm:min-w-[380px] max-w-[520px] h-[85dvh] sm:h-[82vh] md:h-[74vh] min-h-[380px] sm:min-h-[600px] rounded-[1.75rem] border overflow-hidden flex flex-col relative ${theme.panel} ${theme.glow}`}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300 z-10" />

              <div className={`px-6 py-5 border-b flex justify-between items-center ${theme.header}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <img src={brianProfile} alt="Brian" className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/50" />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-[3px] ${darkMode ? 'ring-[#0a1620]' : 'ring-white'} ${status === 'online' ? 'bg-cyan-400' : 'bg-teal-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-bold tracking-tight truncate bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300 bg-clip-text text-transparent">
                      sonya
                    </p>
                    <p className={`text-[11px] font-mono truncate -mt-0.5 mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      brian's ai assistant
                    </p>
                    <p className={`text-xs font-mono flex items-center gap-1.5 ${status === 'online' ? 'text-cyan-500' : 'text-teal-500'}`}>
                      <Circle size={7} className={`${status === 'online' ? 'fill-cyan-400 text-cyan-400' : 'fill-teal-400 text-teal-400'} animate-pulse`} />
                      {status === 'online' ? 'online' : 'connecting...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mode switcher: Chat vs Voice */}
              <div className={`flex gap-1 px-4 pt-3 pb-1 border-b ${theme.header}`}>
                <button
                  onClick={() => switchMode('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-mono font-medium transition-colors ${mode === 'chat' ? theme.tabActive : theme.tabInactive}`}
                >
                  <MessageSquare size={16} /> chat
                </button>
                <button
                  onClick={() => switchMode('voice')}
                  disabled={!voiceSupported}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-mono font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${mode === 'voice' ? theme.tabActive : theme.tabInactive}`}
                >
                  <AudioLines size={16} /> voice
                </button>
              </div>

              {mode === 'chat' ? (
                <>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className={`text-xs font-mono mb-1.5 px-1 font-medium ${msg.sender === 'user' ? 'text-teal-500' : 'text-cyan-500'}`}>
                          {msg.sender === 'user' ? 'you ❯' : 'sonya'}
                        </span>
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`max-w-[88%] px-5 py-3.5 rounded-2xl text-base leading-relaxed border ${
                            msg.sender === 'user'
                              ? 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-300 font-mono rounded-tr-md'
                              : `${theme.bubbleBot} rounded-tl-md`
                          }`}
                        >
                          {msg.text}
                        </motion.div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-mono mb-1.5 px-1 font-medium text-cyan-500">sonya</span>
                        <div className={`px-5 py-3.5 rounded-2xl rounded-tl-md border flex items-center gap-1.5 ${theme.bubbleBot}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s] opacity-60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s] opacity-60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce opacity-60" />
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSend} className={`p-4 border-t flex items-center gap-2 ${theme.header}`}>
                    <button
                      type="button"
                      onClick={toggleDictation}
                      disabled={!voiceSupported}
                      title={voiceSupported ? 'Dictate your message' : 'Voice input not supported in this browser'}
                      className={`p-3 rounded-xl transition-all disabled:opacity-30 ${voiceState === 'listening' ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-500/10'}`}
                    >
                      {voiceState === 'listening' ? <Mic size={20} className="animate-pulse" /> : <MicOff size={20} />}
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="ask something..."
                      className={`flex-1 px-3 py-3.5 rounded-xl border outline-none text-base font-mono transition-colors ${theme.input}`}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-[#0a1620] disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform"
                    >
                      <ArrowUp size={20} strokeWidth={2.5} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-3 sm:p-6 overflow-y-auto">
                  {!voiceSupported ? (
                    <div className="flex-1 flex items-center justify-center text-center px-6">
                      <p className={`text-sm font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Your browser doesn't support speech recognition. Try Chrome or Edge, or use Chat mode instead.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Sound wave — no chat bubbles in voice mode, just the wave + a caption */}
                      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 sm:gap-6">
                        <VoiceWave
                          active={voiceState === 'listening' || voiceState === 'speaking'}
                          levels={waveLevels}
                          state={voiceState}
                          darkMode={darkMode}
                        />
                        {voiceState === 'speaking' && lastBotReply && (
                          <p className={`text-center text-sm font-mono px-4 max-w-[92%] leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {lastBotReply}
                          </p>
                        )}
                      </div>

                      {/* Mic control — lifted higher above the bottom edge */}
                      <div className="flex flex-col items-center gap-2 sm:gap-5 pt-2 sm:pt-6 pb-2 sm:pb-12 shrink-0">
                        <p className={`text-sm font-mono tracking-wide text-center px-4 ${micError ? 'text-red-500' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {micError || (voiceState === 'listening' && voiceTranscript ? `"${voiceTranscript}"` : voiceStatusLabel)}
                        </p>

                        <motion.button
                          onClick={toggleVoiceSession}
                          disabled={voiceState === 'thinking'}
                          whileTap={{ scale: 0.94 }}
                          className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 transition-colors disabled:opacity-60 shrink-0 ${
                            voiceState === 'listening'
                              ? 'bg-red-500/10 border-red-400 text-red-500'
                              : voiceState === 'speaking'
                              ? 'bg-indigo-500/10 border-indigo-400 text-indigo-500'
                              : `bg-gradient-to-br from-cyan-400/20 to-blue-400/20 border-cyan-400/50 ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`
                          }`}
                        >
                          {voiceState === 'listening' && (
                            <motion.span
                              className="absolute inset-0 rounded-full border-2 border-red-400"
                              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                          {voiceState === 'speaking' && (
                            <motion.span
                              className="absolute inset-0 rounded-full border-2 border-indigo-400"
                              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                          {voiceState === 'thinking' ? (
                            <Loader2 size={22} className="animate-spin sm:w-[30px] sm:h-[30px]" />
                          ) : (
                            <Mic size={22} strokeWidth={2} className="sm:w-[30px] sm:h-[30px]" />
                          )}
                        </motion.button>

                        <button
                          onClick={() => setAutoListen((v) => !v)}
                          className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${
                            autoListen
                              ? 'text-cyan-500'
                              : darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {autoListen ? '● keep listening after each reply' : '○ tap to talk each time'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <div className="hidden sm:flex flex-col items-end gap-2">
          <motion.button
            onClick={enableClapToTalk}
            whileTap={{ scale: 0.95 }}
            title={
              clapStatus === 'listening'
                ? 'Clap to talk is on — clap once to open voice mode'
                : clapStatus === 'denied'
                ? "Mic access was blocked — click to try enabling clap to talk again"
                : 'Turn on clap-activated voice mode'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
              clapStatus === 'listening'
                ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-500'
                : darkMode
                ? 'bg-[#0a1620] border-white/10 text-slate-400 hover:text-slate-200'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>👏</span>
            {clapStatus === 'listening' ? 'clap to talk: on' : clapStatus === 'denied' ? 'mic blocked' : 'enable clap to talk'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleChat}
            className={`relative p-6 rounded-3xl border overflow-hidden ${theme.fab} ${theme.fabGlow}`}
          >
            <motion.span
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 40%, rgba(34,211,238,0.35), transparent 70%)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Terminal size={34} className="text-cyan-400 relative" strokeWidth={2} />
          </motion.button>
        </div>
      )}
    </div>
  );
});

export default Chatbot;