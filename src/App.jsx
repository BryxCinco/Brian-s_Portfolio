import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sun,
  Moon,
  Truck,
  Music,
  Anchor,
  Coffee,
  Download,
  MessageSquare,
  Globe,
  ExternalLink,
  X,
  Home,
  User,
  Mail,
  Menu,
  Quote,
  Lock,
  Award,
  Box,
  Layers
} from 'lucide-react';

// Import ang Components
import Carousel from './Carousel';
import About from './About';
import Contact from './Contact';
import Chatbot from './Chatbot';
import Certifications, { CertificationsPreview } from './Certifications';
import Project from './Project';
import Stacks from './Stacks';

// CV / Resume Import
import brianCV from './assets/Brian_Paul_Francisco_CV.pdf';

// Local Assets Import
import brian1 from './assets/Brian1.png';
import brian2 from './assets/Brian2.png';
import brian3 from './assets/Brian3.png';
import brian4 from './assets/Brian4.png';
import brian5 from './assets/Brian5.png';
import brian6 from './assets/Brian6.png';

// Project & Tool Images
import sweepImg from './assets/SweepXpress.png';
import soundImg from './assets/Soundlify.png';
import maritimeImg from './assets/Grandline.png';
import doughImg from './assets/Dough Re Mi.png';
import vsCodeLogo from './assets/VSCODE.png';
import canvaLogo from './assets/Canva.png';
import cssLogo from './assets/CSS.png';

// ============================================================================
// THEME TRANSITION & ANIMATION ENGINE
// ============================================================================

const THEME_TRANSITION_DURATION_MS = 650;
const THEME_TRANSITION_EASING = 'cubic-bezier(0.83, 0, 0.17, 1)';

const themeTransitionStyles = `
  ::view-transition-group(root) {
    animation-duration: ${THEME_TRANSITION_DURATION_MS}ms;
  }

  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
    display: block;
  }

  ::view-transition-old(root) {
    z-index: 1;
  }

  ::view-transition-new(root) {
    z-index: 9999;
  }

  @keyframes circleExpand {
    0% { clip-path: circle(0% at 50% 50%); }
    100% { clip-path: circle(150% at 50% 50%); }
  }

  .animate-circle-expand {
    animation: circleExpand 1s cubic-bezier(0.83, 0, 0.17, 1) forwards;
  }

  @keyframes bulletinPop {
    0% { opacity: 0; transform: scale(0.7) translateY(10px); filter: brightness(2.4); }
    40% { opacity: 1; transform: scale(1.08) translateY(0); filter: brightness(1.4); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
  }

  .animate-bulletin-pop {
    animation: bulletinPop 150ms ease-out forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(root) {
      animation-duration: 0.01ms !important;
    }
  }
`;

const ThemeTransitionStyles = () => <style>{themeTransitionStyles}</style>;

function useThemeTransition(setDarkMode) {
  const isAnimating = useRef(false);

  const supportsViewTransitions = useCallback(() => {
    return typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
  }, []);

  const prefersReducedMotion = useCallback(() => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const toggleTheme = useCallback(
    (event) => {
      if (isAnimating.current) return;

      const originX = event?.clientX ?? window.innerWidth / 2;
      const originY = event?.clientY ?? window.innerHeight / 2;

      const endRadius = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY)
      );

      const applyTheme = () => setDarkMode((prev) => !prev);

      if (!supportsViewTransitions() || prefersReducedMotion()) {
        applyTheme();
        return;
      }

      isAnimating.current = true;

      const transition = document.startViewTransition(() => {
        applyTheme();
      });

      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${originX}px ${originY}px)`,
            `circle(${endRadius}px at ${originX}px ${originY}px)`,
          ];

          document.documentElement.animate(
            { clipPath },
            {
              duration: THEME_TRANSITION_DURATION_MS,
              easing: THEME_TRANSITION_EASING,
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {});

      transition.finished.finally(() => {
        isAnimating.current = false;
      });
    },
    [setDarkMode, supportsViewTransitions, prefersReducedMotion]
  );

  return { toggleTheme };
}

const RevealOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-20 scale-95"
      }`}
    >
      {children}
    </div>
  );
};

const SectionEyebrow = ({ label, icon }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <h3 className="text-[9px] sm:text-[11px] md:text-[12px] font-black text-[#00b4ff] uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1em] whitespace-nowrap">
      {label}
    </h3>
    <div className="h-[1px] flex-1 bg-[#00b4ff]/20"></div>
    {icon}
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatbotRef = useRef(null);

  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'home';
  });

  const [showIntro, setShowIntro] = useState(() =>
    !sessionStorage.getItem('hasAnimated') && activeSection === 'home'
  );

  const [currentGreeting, setCurrentGreeting] = useState("Hello");
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const greetings = [
    "Hello", "¡Hola!", "Bonjour", "Hallo", "Ciao", "こんにちは", "नमस्ते",
    "مرحبا", "你好", "안녕하세요", "Привет", "שלום", "Merhaba",
    "Szia", "Hej", "Zdravo", "Hei", "Ahoj", "Goddag", "Γεια"
  ];

  useEffect(() => {
    if (!showIntro) return;

    const runSequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));

      for (let i = 0; i < greetings.length; i++) {
        setCurrentGreeting(greetings[i]);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      setCurrentGreeting("Kamusta");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('hasAnimated', 'true');
      }, 1000);
    };

    runSequence();
  }, [showIntro]);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const { toggleTheme } = useThemeTransition(setDarkMode);

  const skills = [
    { name: 'HTML', logo: 'https://cdn.simpleicons.org/html5/E34F26' },
    { name: 'CSS', logo: cssLogo },
    { name: 'Javascript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB' },
    { name: 'PHP', logo: 'https://cdn.simpleicons.org/php/777BB4' },
    { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776AB' },
    { name: 'JSON', logo: 'https://cdn.simpleicons.org/json/000000' },
    { name: 'Bootstrap', logo: 'https://cdn.simpleicons.org/bootstrap/7952B3' },
    { name: 'Tailwind', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
    { name: 'MySQL', logo: 'https://cdn.simpleicons.org/mysql/4479A1' },
  ];

  const projects = [
    {
      name: 'SweepXpress',
      role: 'Logistics System',
      desc: 'Real-time supply chain efficiency and tracking solutions.',
      icon: <Truck size={28} className="text-[#00d4ff]" />,
      image: sweepImg
    },
    {
      name: 'Soundlify',
      role: 'Streaming Platform',
      desc: 'Modern music interface with seamless audio playback.',
      icon: <Music size={28} className="text-[#00d4ff]" />,
      image: soundImg
    },
    {
      name: 'Maritime LMS',
      role: 'Learning Portal',
      desc: 'Secure environment for maritime students.',
      icon: <Anchor size={28} className="text-[#00d4ff]" />,
      image: maritimeImg
    },
    {
      name: 'Dough Re Mi',
      role: 'Coffee & Bakery',
      desc: 'Full-stack e-commerce system using PHP and MySQL.',
      icon: <Coffee size={28} className="text-[#00d4ff]" />,
      image: doughImg
    },
  ];

  const info = [
    { label: "Status", val: "Fresh Graduate IT Student" },
    { label: "Education", val: "BSIT - National Teachers College" },
    { label: "Location", val: "Sta Cruz, Manila, PH" },
    { label: "Specialization", val: "Full-Stack Developer & UI/UX" }
  ];

  const galleryImages = [brian2, brian3, brian4, brian5, brian6];

  return (
    <>
      {showIntro && (
        <div className={`fixed inset-0 z-[9999] ${isAnimatingOut ? 'pointer-events-none' : ''}`}>
          {/* top slice panel */}
          <div
            className={`absolute top-0 left-0 w-full h-1/2 bg-[#0a1628] transition-transform duration-[900ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${isAnimatingOut ? '-translate-y-full' : 'translate-y-0'}`}
          />
          {/* bottom slice panel */}
          <div
            className={`absolute bottom-0 left-0 w-full h-1/2 bg-[#0a1628] transition-transform duration-[900ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${isAnimatingOut ? 'translate-y-full' : 'translate-y-0'}`}
          />
          {/* greeting text */}
          <div className={`absolute inset-0 flex items-center justify-center px-4 transition-opacity duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}>
            <h1
              key={currentGreeting}
              className="animate-bulletin-pop text-white text-4xl sm:text-6xl md:text-8xl font-black text-center"
              style={{textShadow: "0 0 50px rgba(255,255,255,0.7), 0 0 100px rgba(255,255,255,0.35)"}}
            >
              {currentGreeting}
            </h1>
          </div>
        </div>
      )}
      <div className={darkMode ? 'dark bg-[#0a1628] text-[#e0f4ff]' : 'light bg-[#e0f4ff] text-slate-900'}>
      <ThemeTransitionStyles />
      <div className="min-h-screen relative transition-colors duration-700 selection:bg-[#00b4ff] selection:text-white pb-20 overflow-x-hidden bg-inherit">

        <div className="fixed top-[-10%] left-[-10%] w-[70%] h-[70%] sm:w-[50%] sm:h-[50%] rounded-full bg-[#0088ff]/20 blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[70%] h-[70%] sm:w-[50%] sm:h-[50%] rounded-full bg-[#0059b3]/20 blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

        {selectedImage && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedImage(null)}>
            <button className="cursor-target absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-[#00e5ff] transition-colors z-[1001]" aria-label="Close preview">
              <X size={32} className="sm:hidden" />
              <X size={40} className="hidden sm:block" />
            </button>
            <div className="relative rounded-md shadow-2xl animate-scale-in">
              <img
                src={selectedImage}
                className="max-w-full max-h-[85vh] object-contain"
                alt="Preview"
              />
            </div>
          </div>
        )}

        <div className={`fixed inset-0 z-[1000] transition-all duration-500 ${isSidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className={`absolute left-4 sm:left-6 top-20 sm:top-24 bottom-4 sm:bottom-6 w-[78vw] max-w-[280px] sm:w-72 backdrop-blur-2xl border rounded-md sm:rounded-md p-7 sm:p-10 flex flex-col transition-all duration-500 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[130%]'} ${darkMode ? 'bg-[#001a33]/40 border-[#00b4ff]/20 text-[#e0f4ff]' : 'bg-white/90 border-[#99f5ff] text-slate-900'}`}>
            <div className="flex justify-between items-center mb-10 sm:mb-12">
              <span className="font-black text-lg sm:text-xl tracking-tighter">NAV<span className="text-[#00b4ff]">IGATION</span></span>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation" className={`cursor-target p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-[#ccf7ff]'}`}>
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 overflow-y-auto">
              {[
                { name: 'Home', icon: <Home size={18}/>, id: 'home' },
                { name: 'About', icon: <User size={18}/>, id: 'about' },
                { name: 'Certificates', icon: <Award size={18}/>, id: 'certificates' },
                { name: 'Projects', icon: <Box size={18}/>, id: 'projects' },
                { name: 'Stacks', icon: <Layers size={18}/>, id: 'stacks' },
                { name: 'Contact Me', icon: <Mail size={18}/>, id: 'contact' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`cursor-target flex items-center gap-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all group ${activeSection === item.id ? 'opacity-100 text-[#00b4ff]' : 'opacity-60 hover:opacity-100'}`}
                >
                  <span className={`p-3 border rounded-md group-hover:bg-[#00b4ff]/20 transition-all ${activeSection === item.id ? 'bg-[#00b4ff]/20 border-[#00b4ff]' : 'bg-black/5 border-[#00b4ff]/10'}`}>{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <div className={`mt-auto pt-8 sm:pt-10 border-t ${darkMode ? 'border-[#00b4ff]/10' : 'border-[#99f5ff]'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Ready for</p>
              <p className="text-xs font-black text-[#00b4ff] uppercase">Deployment 2026</p>
            </div>
          </div>
        </div>

        <nav className="fixed top-0 w-full z-[100] p-4 sm:p-6 flex justify-between items-center px-4 sm:px-6 md:px-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`cursor-target backdrop-blur-xl border px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-black tracking-tighter text-lg sm:text-xl md:text-2xl shadow-[0_0_20px_rgba(0,180,255,0.1)] hover:scale-105 active:scale-95 transition-all group ${darkMode ? 'bg-white/5 border-[#00b4ff]/20' : 'bg-white/70 border-[#99f5ff]'}`}
          >
            BP<span className="text-[#00b4ff]" style={{textShadow: "0 0 15px rgba(0,180,255,0.6)"}}>.DEV</span>
            <span className="ml-2 hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity"><Menu size={16} className="inline mb-1" /></span>
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => chatbotRef.current?.open()}
              aria-label="Open chat assistant"
              title="Chat with Sonya"
              className={`cursor-target sm:hidden p-3 rounded-full backdrop-blur-xl border hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,180,255,0.1)] ${darkMode ? 'bg-white/5 border-[#00b4ff]/20' : 'bg-white/70 border-[#99f5ff]'}`}
            >
              <MessageSquare size={20} className={darkMode ? 'text-[#66f0ff]' : 'text-[#003366]'} />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`cursor-target p-3 sm:p-4 rounded-full backdrop-blur-xl border hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,180,255,0.1)] ${darkMode ? 'bg-white/5 border-[#00b4ff]/20' : 'bg-white/70 border-[#99f5ff]'}`}
            >
              {darkMode ? <Sun size={20} className="text-[#66f0ff]" /> : <Moon size={20} className="text-[#003366]" />}
            </button>
          </div>
        </nav>

        <div key={activeSection} className="w-full max-w-[1800px] mx-auto pt-24 sm:pt-32 px-4 sm:px-6 lg:px-12 space-y-6">

          {activeSection === 'home' ? (
            <>
              <RevealOnScroll>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                  <header className="lg:col-span-9 bg-white/5 dark:bg-[#001a33]/10 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md lg:rounded-md p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative group animate-fade-in-up overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-0 right-0 p-6 sm:p-12 text-[8rem] sm:text-[12rem] md:text-[18rem] font-black opacity-[0.03] text-[#00e5ff] pointer-events-none uppercase leading-none">Code</div>
                    <div className="relative shrink-0 animate-scale-in">
                      <div className="w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-md sm:rounded-md overflow-hidden shadow-[0_0_40px_rgba(0,180,255,0.2)] border-4 border-[#00b4ff]/20 rotate-2">
                        <img src={brian1} alt="Brian" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-[#0088ff] text-white px-5 sm:px-8 py-2 sm:py-3 rounded-md font-black text-[10px] sm:text-xs uppercase shadow-[0_10px_20px_rgba(0,180,255,0.3)]">Software Engineer</div>
                    </div>
                    <div className="text-center md:text-left space-y-4 sm:space-y-6 flex-1 relative z-10">
                      <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-slate-900 dark:text-white" style={{textShadow: "0 0 30px rgba(0,180,255,0.3)"}}>Brian Paul<span className="text-[#00b4ff]" style={{textShadow: "0 0 40px rgba(0,180,255,0.6)"}}>.</span></h1>
                      <p className="text-base sm:text-xl md:text-2xl font-bold opacity-70 max-w-2xl leading-relaxed">
                        An aspiring <span className="text-[#00b4ff]" style={{textShadow: "0 0 12px rgba(0,180,255,0.4)"}}>Full-Stack Engineer</span> with a focus on UI/UX design, AI integration, and APIs — someone who wants to build things and turn ideas into real-world solutions.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center md:justify-start">
                        <a
                          href={brianCV}
                          download="Brian_Paul_Francisco_CV.pdf"
                          className="cursor-target flex items-center justify-center gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-[#0088ff] text-white rounded-md font-black text-xs uppercase tracking-widest hover:bg-[#00b4ff] transition-all shadow-[0_10px_25px_rgba(0,180,255,0.4)]"
                        >
                          <Download size={16} /> Download CV
                        </a>
                        <button
                          onClick={() => {
                            setActiveSection('about');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="cursor-target flex items-center justify-center gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-white/5 border border-[#00b4ff]/20 rounded-md font-black text-xs uppercase tracking-widest hover:border-[#00b4ff]/50 transition-all"
                        >
                          <User size={16} /> About Me
                        </button>
                      </div>
                    </div>
                  </header>

                  <div className="lg:col-span-3 flex flex-col gap-6">
                    <section className="flex-1 bg-gradient-to-br from-[#0088ff] to-[#004080] rounded-md sm:rounded-md p-7 sm:p-10 shadow-[0_15px_35px_rgba(0,180,255,0.3)] animate-fade-in-up">
                      <div className="flex items-center gap-2 mb-5 sm:mb-6 opacity-80 uppercase font-black text-[10px] tracking-widest !text-white">
                        <Globe size={14} className="!text-white" /> Location
                      </div>
                      <p className="text-3xl sm:text-4xl font-black italic leading-tight mb-3 sm:mb-4 tracking-tighter !text-white">"Manila, PH."</p>
                      <p className="text-sm opacity-90 !text-white">Ready for high-level software deployments and integrations.</p>
                    </section>
                    <section className="bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md p-7 sm:p-8 flex flex-wrap gap-2 shadow-lg animate-fade-in-up">
                      {['Fast Learner', 'Problem Solver', 'UI Expert', 'Secure'].map((t) => (
                        <span key={t} className="px-4 py-2 bg-[#00b4ff]/10 border border-[#00b4ff]/20 rounded-md text-[10px] font-black uppercase text-[#00e5ff] tracking-widest">{t}</span>
                      ))}
                    </section>
                  </div>
                </div>
              </RevealOnScroll>

              <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                <section className="lg:col-span-4 flex flex-col gap-6">
                  <RevealOnScroll>
                    <div className="bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md lg:rounded-md p-7 sm:p-10 lg:p-12 space-y-6 sm:space-y-10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                      <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[#00b4ff]" style={{textShadow: "0 0 10px rgba(0,180,255,0.5)"}}>Curriculum Vitae</h3>
                      <div className="space-y-6 sm:space-y-8">
                        {info.map((i) => (
                          <div key={i.label} className="group">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff]/60 transition-colors">{i.label}</p>
                            <p className="text-base sm:text-lg font-black">{i.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </RevealOnScroll>
                  <RevealOnScroll>
                    <div className="flex-1 bg-gradient-to-br from-[#003366]/40 via-[#004d99]/20 to-transparent backdrop-blur-xl border border-[#00b4ff]/30 rounded-md sm:rounded-md lg:rounded-md p-7 sm:p-10 lg:p-14 relative overflow-hidden group shadow-2xl">
                      <Quote className="absolute top-8 right-8 sm:top-10 sm:right-10 opacity-10 transition-all duration-700" size={64} />
                      <div className="relative z-10 space-y-6 sm:space-y-8">
                        <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#00b4ff]">Dev & Life Philosophy</p>
                        <div className="space-y-4 sm:space-y-6">
                          <h4 className="text-2xl sm:text-3xl md:text-4xl font-black italic leading-[1.1] tracking-tighter">
                            "Turning complex logic into <span className="text-[#00b4ff] underline decoration-[#00b4ff]/30 underline-offset-8" style={{textShadow: "0 0 15px rgba(0,180,255,0.5)"}}>seamless</span> user experiences."
                          </h4>
                          <p className="text-base sm:text-lg md:text-xl font-bold opacity-80 leading-relaxed italic">
                            "Innovation is not just about writing code; it's about solving real-world problems with <span className="text-[#00e5ff]">precision</span> and <span className="text-[#00e5ff]">purpose</span>."
                          </p>
                        </div>
                        <div className="pt-4 sm:pt-6 flex items-center gap-4">
                          <div className="h-[2px] w-12 bg-[#00b4ff]/50"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Persistence Over Perfection</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00b4ff]/10 blur-[100px] rounded-full transition-all duration-1000"></div>
                    </div>
                  </RevealOnScroll>
                </section>

                <section className="lg:col-span-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[#00b4ff]">Selected Work</h3>
                    <button
                      onClick={() => {
                        setActiveSection('projects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-target text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#00e5ff]/70 hover:text-[#00e5ff] transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((p, idx) => (
                    <RevealOnScroll key={idx}>
                      <div
                        className="cursor-target bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md p-6 sm:p-8 transition-all duration-500 shadow-lg cursor-pointer h-full"
                        onClick={() => setSelectedImage(p.image)}
                      >
                        <div className="relative h-44 sm:h-56 rounded-md sm:rounded-md overflow-hidden mb-6 sm:mb-8 border border-[#00b4ff]/10">
                          <img src={p.image} className="w-full h-full object-cover transition-all duration-1000" alt={p.name} />
                          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-[#003366]/80 backdrop-blur-md rounded-md flex items-center justify-center text-white shadow-xl">
                            {p.icon}
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 dark:text-white">{p.name}</h4>
                          <p className="text-sm opacity-60 font-medium">{p.desc}</p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  ))}
                  </div>
                </section>

                <section className="lg:col-span-12">
                  <RevealOnScroll>
                    <div className="bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md lg:rounded-md p-7 sm:p-12 md:p-20 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                      <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 items-center">
                        <div className="lg:w-1/3 text-center lg:text-left space-y-4 sm:space-y-6">
                          <h3 className="text-[10px] sm:text-[11px] font-black text-[#00b4ff] uppercase tracking-[0.3em] sm:tracking-[0.5em]">Skillset</h3>
                          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">Modern Stack.</h2>
                          <p className="opacity-60 text-base sm:text-lg">Specializing in high-performance web applications and databases.</p>
                        </div>
                        <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 sm:gap-8">
                          {skills.map((s, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 sm:gap-4">
                              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/5 border border-[#00b4ff]/10 rounded-md sm:rounded-md flex items-center justify-center transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                                <img src={s.logo} alt="" className="w-7 h-7 sm:w-10 sm:h-10 transition-transform" />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 text-[#00b4ff] text-center">{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                </section>

                <section className="lg:col-span-12 pt-6 sm:pt-10">
                  <CertificationsPreview
                    darkMode={darkMode}
                    count={4}
                    onViewAll={() => {
                      setActiveSection('certificates');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </section>
              </main>

              <RevealOnScroll>
                <section className="pt-14 sm:pt-20 space-y-8 sm:space-y-10 overflow-hidden">
                  <h3 className="text-[10px] sm:text-[12px] font-black text-[#00b4ff] uppercase tracking-[0.3em] sm:tracking-[1em] text-center">Visual Archives</h3>

                  {/* Mobile: swipeable carousel */}
                  <div className="sm:hidden">
                    <Carousel
                      items={galleryImages}
                      darkMode={darkMode}
                      cardWidth="78vw"
                      maxWidth={360}
                      renderItem={(img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          aria-label="Preview archive image"
                          className="cursor-target block w-full aspect-[4/3] bg-white/5 border border-[#00b4ff]/10 rounded-md overflow-hidden"
                        >
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                      )}
                    />
                  </div>

                  {/* Desktop / tablet: infinite marquee */}
                  <div className="hidden sm:flex animate-infinite-scroll gap-5 sm:gap-8 w-max pb-10">
                    {[...galleryImages, ...galleryImages].map((img, idx) => (
                      <div key={idx} className="cursor-target w-[350px] h-60 md:w-[450px] md:h-72 bg-white/5 border border-[#00b4ff]/10 rounded-md overflow-hidden shrink-0 relative cursor-pointer" onClick={() => setSelectedImage(img)}>
                        <img src={img} className="absolute inset-0 w-full h-full object-cover transition-all duration-500" alt="" />
                      </div>
                    ))}
                  </div>
                </section>
              </RevealOnScroll>
            </>
          ) : activeSection === 'about' ? (
            <div className="animate-fade-in">
               <About />
            </div>
          ) : activeSection === 'certificates' ? (
            <div className="animate-fade-in">
               <Certifications darkMode={darkMode} />
            </div>
          ) : activeSection === 'projects' ? (
            <div className="animate-fade-in">
               <Project darkMode={darkMode} />
            </div>
          ) : activeSection === 'stacks' ? (
            <div className="animate-fade-in">
               <Stacks darkMode={darkMode} />
            </div>
          ) : (
            <div className="animate-fade-in">
               <Contact darkMode={darkMode} />
            </div>
          )}

          <RevealOnScroll>
            <footer className="pt-14 sm:pt-20 border-t border-[#00b4ff]/10 text-center space-y-6 sm:space-y-8 pb-10 px-4">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-12 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] opacity-60">
                 <a href="#" className="cursor-target hover:text-[#00b4ff] transition-colors">Github</a>
                 <a href="#" className="cursor-target hover:text-[#00b4ff] transition-colors">LinkedIn</a>
                 <a href="#" className="cursor-target hover:text-[#00b4ff] transition-colors">Twitter</a>
              </div>
              <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[1em] opacity-20 text-[#00b4ff]">
                 © {new Date().getFullYear()} Brian Paul Francisco
              </p>
            </footer>
          </RevealOnScroll>

          <Chatbot ref={chatbotRef} darkMode={darkMode} />
        </div>
      </div>
      </div>
    </>
  );
}

export default App;