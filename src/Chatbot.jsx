import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal, X, ArrowUp, Circle, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import ng profile pic mo
import brianProfile from './assets/Sonya.png';

const Chatbot = forwardRef(({ darkMode }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [status, setStatus] = useState('online');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Brian's AI Assistant. Ask me anything about his projects, tools, tech stack, or even what he does off the keyboard! 👋", sender: 'bot' }
  ]);

  // Speech-to-text dictation state
  const [isDictating, setIsDictating] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [micError, setMicError] = useState('');

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastResponseIndexRef = useRef(-1);
  const lastJokeIndexRef = useRef(-1);

  // Expose an imperative "open" method so the mobile navigation bar
  // (which owns its own trigger icon in place of the floating bubble)
  // can open this widget from the parent component.
  useImperativeHandle(ref, () => ({
    open: () => {
      setShowNotification(false);
      setIsOpen(true);
    },
  }));

  // Speech recognition setup (dictation only — no speech synthesis)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
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
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      setIsDictating(false);
    };

    recognitionRef.current.onend = () => {
      setIsDictating(false);
    };

    recognitionRef.current.onerror = (event) => {
      setIsDictating(false);
      if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
        setMicError('Mic access is blocked. Allow microphone permission for this site in your browser settings, then try again.');
      } else if (event?.error === 'network') {
        setMicError('Speech recognition needs an internet connection. Check your connection and try again.');
      } else if (event?.error && event.error !== 'no-speech' && event.error !== 'aborted') {
        setMicError('Voice input hit a snag (' + event.error + '). Try again.');
      }
    };

    return () => {
      recognitionRef.current?.stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDictation = () => {
    if (!recognitionRef.current) return;
    setMicError('');
    try {
      setIsDictating(true);
      recognitionRef.current.start();
    } catch (err) {
      if (err?.name !== 'InvalidStateError') {
        setIsDictating(false);
        setMicError('Could not start the mic. Try again.');
      }
    }
  };

  const stopDictation = () => {
    recognitionRef.current?.stop?.();
    setIsDictating(false);
  };

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation();
    } else {
      startDictation();
    }
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
  }, [messages, isTyping]);

  // Shared pipeline: takes raw text from the input box,
  // adds it to the transcript, and produces a bot reply.
  const processUserInput = (text) => {
    if (!text?.trim()) return;
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const lower = text.toLowerCase();

    const deliverReply = (botReply) => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: botReply, sender: 'bot' }]);
      setIsTyping(false);
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
    processUserInput(input);
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
            const desc = WEATHER_CODES[data?.current?.weather_code] ?? "some kind of weather I can't quite classify";
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
      return "I'm Brian's AI Assistant! I'm here to talk about his projects, tools, and skills, or just chat if you want a break. 😄";
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
        accentText: 'text-cyan-600',
        ring: 'ring-white',
      };

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
                <span className="font-semibold">Brian's AI Assistant</span> <span className={darkMode ? 'text-slate-600' : 'text-slate-300'}>//</span> new_message
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
                      Brian's AI Assistant
                    </p>
                    <p className={`text-[11px] font-mono truncate -mt-0.5 mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      brian's portfolio helper
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

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className={`text-xs font-mono mb-1.5 px-1 font-medium ${msg.sender === 'user' ? 'text-teal-500' : 'text-cyan-500'}`}>
                      {msg.sender === 'user' ? 'you ❯' : "Brian's AI Assistant"}
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
                    <span className="text-xs font-mono mb-1.5 px-1 font-medium text-cyan-500">Brian's AI Assistant</span>
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
                  className={`p-3 rounded-xl transition-all disabled:opacity-30 ${isDictating ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-500/10'}`}
                >
                  {isDictating ? <Mic size={20} className="animate-pulse" /> : <MicOff size={20} />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={micError || "ask something..."}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating trigger button — hidden on mobile, visible on sm+ */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleChat}
          className={`hidden sm:flex relative p-6 rounded-3xl border overflow-hidden ${theme.fab} ${theme.fabGlow}`}
        >
          <motion.span
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 40%, rgba(34,211,238,0.35), transparent 70%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Terminal size={34} className="text-cyan-400 relative" strokeWidth={2} />
        </motion.button>
      )}
    </div>
  );
});

export default Chatbot;