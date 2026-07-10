import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  MousePointerClick,
} from 'lucide-react';
 
// ============================================================================
// ASSETS — landscapes are Websites, portraits are Poster Designs
// ============================================================================
import Carousel from './Carousel';
import doughRemiSite from './assets/Dough Re Mi.png';
import soundlifySite from './assets/Soundlify.png';
import sweepXpressSite from './assets/SweepXpress.png';
import grandlineSite from './assets/Grandline.png';
 
import adventurePoster from './assets/Keep On Keeping On.png';
import lamboPoster from './assets/Lambo Poster.png';
import dronePoster from './assets/Drown Poster.png';
import matchaPoster from './assets/Matcha Poster.png';
import musicFestPoster from './assets/Music Fest Poster.png';
 
// ============================================================================
// DATA
// ============================================================================
// NOTE: fill in each `url` with the live deployment when it's ready.
// Until then it stays "#" and the vacuum effect will still play, it just
// won't navigate anywhere at the end (see useVacuum's guard below).
 
const websites = [
  {
    name: 'Dough Re Mi',
    tag: 'Bakery & Caramel E-Commerce',
    desc: 'A full-stack ordering platform for a home bakery brand — browsing, bagging, and checkout built around a soft, dessert-forward visual identity.',
    image: doughRemiSite,
    url: 'https://www.facebook.com/Bryx.Francisco111', // sample link — swap in the real URL later
  },
  {
    name: 'Soundlify',
    tag: 'Community & Resident Portal',
    desc: 'A registration and login gateway for a community services platform, designed to keep members securely connected to local programs and records.',
    image: soundlifySite,
    url: 'https://www.facebook.com/Bryx.Francisco111', // sample link — swap in the real URL later
  },
  {
    name: 'SweepXpress',
    tag: 'Logistics Admin Dashboard',
    desc: 'A secured admin control panel for monitoring orders, inventory, and customers in real time, with audit-logged sign-ins for accountability.',
    image: sweepXpressSite,
    url: 'https://www.facebook.com/Bryx.Francisco111', // sample link — swap in the real URL later
  },
  {
    name: 'Grandline Maritime',
    tag: 'LMS Portal for Maritime Training',
    desc: 'A certification and training management portal for maritime professionals, pairing a secure login flow with live system status at a glance.',
    image: grandlineSite,
    url: 'https://www.facebook.com/Bryx.Francisco111', // sample link — swap in the real URL later
  },
];
 
const posters = [
  {
    name: 'Adventure Awaits',
    tag: 'Travel & Outdoor',
    desc: 'A warm, layered forest silhouette poster built around a hand-lettered script mark — made to invite wanderlust at a glance.',
    image: adventurePoster,
  },
  {
    name: 'Huracán — Instinctive Technology',
    tag: 'Automotive Print Ad',
    desc: 'A moody, high-contrast automotive spread pairing a matte hero shot with a macro detail — precision engineering rendered in near-black tones.',
    image: lamboPoster,
  },
  {
    name: 'Advanced Drone System',
    tag: 'Product & E-Commerce',
    desc: 'A specs-first product poster over a coastal sunset backdrop, built to sell performance features and a limited-time offer at a glance.',
    image: dronePoster,
  },
  {
    name: 'HookieCoofie — Matcha Special',
    tag: 'Cafe Promo Poster',
    desc: 'A breezy, leaf-strewn promo for a seasonal matcha menu, priced clearly and finished with a bold savings callout.',
    image: matchaPoster,
  },
  {
    name: 'Eclipse — Midnight Music Fest',
    tag: 'Event Poster',
    desc: 'A neon-drenched rave flyer built around a lunar eclipse motif, with tiered ticketing laid out for fast scanning on the go.',
    image: musicFestPoster,
  },
];
 
// ============================================================================
// SMALL SHARED PIECES
// ============================================================================
 
const SectionEyebrow = ({ label, icon }) => (
  <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
    <h3 className="text-[9px] sm:text-[11px] md:text-[12px] font-black text-purple-500 uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1em] whitespace-nowrap">
      {label}
    </h3>
    <div className="h-[1px] flex-1 bg-purple-500/20" />
    {icon}
  </div>
);
 
// ============================================================================
// VACUUM EFFECT — a bright light source at the right edge of the screen
// wakes up, and everything on the page gets pulled into it: content shrinks,
// streaks toward the right, and drains into the light before it flashes and
// hands off to the live link. `active` (bool) drives the page-content
// transform below; `stage` drives the light/beam/streaks overlay.
// ============================================================================
 
const VACUUM_MS = 1700; // slow drain — this is the part we want seen
const FLASH_MS = 260; // bright pop once everything's been pulled in
const RESTORE_MS = 750; // page settles back once we've handed off
 
const VACUUM_EASE = 'cubic-bezier(0.74,0,0.86,0.13)'; // slow start, hard yank at the end
 
const useVacuum = () => {
  const [target, setTarget] = useState(null); // { name, url }
  const [stage, setStage] = useState('idle'); // idle -> sucking -> flash -> restoring
  const arrivedRef = useRef(false);
 
  const trigger = (site) => {
    arrivedRef.current = false;
    setTarget(site);
    setStage('sucking');
  };
 
  useEffect(() => {
    if (stage !== 'sucking') return undefined;
    const t = setTimeout(() => setStage('flash'), VACUUM_MS);
    return () => clearTimeout(t);
  }, [stage]);
 
  useEffect(() => {
    if (stage !== 'flash') return undefined;
    const t = setTimeout(() => {
      if (!arrivedRef.current && target) {
        arrivedRef.current = true;
        if (target.url && target.url !== '#') {
          window.open(target.url, '_blank', 'noopener,noreferrer');
        }
      }
      setStage('restoring');
    }, FLASH_MS);
    return () => clearTimeout(t);
  }, [stage, target]);
 
  useEffect(() => {
    if (stage !== 'restoring') return undefined;
    const t = setTimeout(() => {
      setStage('idle');
      setTarget(null);
    }, RESTORE_MS);
    return () => clearTimeout(t);
  }, [stage]);
 
  return { target, stage, trigger };
};
 
// The light source + motion streaks, fixed above everything.
const VacuumLight = ({ stage, name }) => {
  const active = stage === 'sucking' || stage === 'flash';
  const flashing = stage === 'flash';
 
  return (
    <div className="fixed inset-0 z-[2000] pointer-events-none overflow-hidden">
      {/* streaks — thin horizontal lines racing toward the light while it drains */}
      {stage === 'sucking' &&
        Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="absolute right-0 h-[2px] rounded-full"
            style={{
              top: `${(100 / 8) * (i + 1)}%`,
              width: '46%',
              background:
                'linear-gradient(90deg, rgba(216,180,254,0) 0%, rgba(216,180,254,0.85) 70%, rgba(255,255,255,0.95) 100%)',
              animation: `vacuum-streak ${850 + (i % 3) * 180}ms ${i * 90}ms cubic-bezier(0.7,0,0.84,0) 1 both`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
 
      {/* the light itself, hugging the right edge */}
      <div
        className="absolute top-0 right-0 h-full"
        style={{
          width: active ? '38vw' : '0px',
          background:
            'radial-gradient(ellipse 70% 100% at 100% 50%, rgba(255,255,255,0.95) 0%, rgba(216,180,254,0.9) 25%, rgba(168,85,247,0.55) 55%, rgba(168,85,247,0) 80%)',
          boxShadow: active ? '-40px 0 120px 40px rgba(168,85,247,0.5)' : 'none',
          transition: `width ${VACUUM_MS}ms ${VACUUM_EASE}, box-shadow ${VACUUM_MS}ms ${VACUUM_EASE}`,
        }}
      />
 
      {/* full-screen flash the instant everything's been drawn in */}
      <div
        className="absolute inset-0 bg-white transition-opacity"
        style={{
          opacity: flashing ? 1 : 0,
          transitionDuration: flashing ? '90ms' : `${FLASH_MS + 120}ms`,
          transitionTimingFunction: flashing ? 'ease-in' : 'ease-out',
        }}
      />
 
      {name && (
        <div
          className="absolute inset-0 flex items-center justify-end pr-10 sm:pr-16 transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0 }}
        >
          <span className="text-white font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs [writing-mode:vertical-rl] drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]">
            Pulling in {name}
          </span>
        </div>
      )}
    </div>
  );
};
 
// ============================================================================
// WEBSITE CARD — big thumbnail + portal-gated live link + description
// ============================================================================
 
const WebsiteCard = ({ site, darkMode, onPreview, onVisit }) => (
  <div className="bg-white/5 backdrop-blur-md border border-purple-500/10 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-lg transition-all duration-500 hover:border-purple-500/30 group">
    <button
      onClick={() => onPreview(site)}
      className="relative w-full aspect-video overflow-hidden block"
      aria-label={`Preview ${site.name}`}
    >
      <img
        src={site.image}
        alt={site.name}
        className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-purple-300 mb-1">
          {site.tag}
        </p>
        <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter leading-none">
          {site.name}
        </h4>
      </div>
    </button>
 
    <div className="p-6 sm:p-8 space-y-4 sm:space-y-5">
      <p className="text-sm opacity-60 font-medium leading-relaxed">{site.desc}</p>
 
      {/* Visit Website — triggers the vacuum, then hands off to the live link */}
      <a
        href={site.url || '#'}
        onClick={(e) => {
          e.preventDefault();
          onVisit(site);
        }}
        title={site.url && site.url !== '#' ? `Visit ${site.name}` : 'Live link coming soon'}
        className={`inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-white/5 border-purple-500/20 text-purple-300 hover:border-purple-500/40'
            : 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400'
        }`}
      >
        <Globe size={14} /> Visit Website <ExternalLink size={12} className="opacity-50" />
      </a>
    </div>
  </div>
);
 
// ============================================================================
// POSTER STACK — sits centered as an open cascade; the poster under the
// cursor lifts itself clear of the rest; a click opens the full view.
// ============================================================================
 
const PosterStack = ({ items, darkMode, onPreview }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const mid = (items.length - 1) / 2;
 
  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 select-none">
      <div className="relative w-[280px] h-[400px] sm:w-[340px] sm:h-[480px] md:w-[400px] md:h-[560px]">
        {items.map((poster, idx) => {
          const offsetFromCenter = idx - mid;
          const isHovered = hoveredIdx === idx;
 
          const baseTransform = `translateX(${offsetFromCenter * 92}px) translateY(${Math.abs(offsetFromCenter) * 22}px) rotate(${offsetFromCenter * 7}deg)`;
          const hoverTransform = `translateX(${offsetFromCenter * 92}px) translateY(-36px) rotate(0deg) scale(1.06)`;
 
          return (
            <div
              key={poster.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx((cur) => (cur === idx ? null : cur))}
              onClick={() => onPreview(poster, idx)}
              style={{
                transform: isHovered ? hoverTransform : baseTransform,
                zIndex: isHovered ? 100 : items.length - Math.abs(offsetFromCenter),
              }}
              className={`absolute top-0 left-1/2 -ml-[140px] sm:-ml-[170px] md:-ml-[200px] w-[280px] h-[400px] sm:w-[340px] sm:h-[480px] md:w-[400px] md:h-[560px] overflow-hidden border-2 cursor-pointer transition-all duration-400 ease-out ${
                isHovered
                  ? 'shadow-[0_35px_60px_rgba(0,0,0,0.55)] border-purple-400/70'
                  : `shadow-[0_15px_30px_rgba(0,0,0,0.35)] ${darkMode ? 'border-purple-500/20' : 'border-purple-300/40'}`
              }`}
            >
              <img
                src={poster.image}
                alt={poster.name}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          );
        })}
      </div>
 
      <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
        <MousePointerClick size={12} /> Hover a poster to lift it out · Click for the full view
      </div>
    </div>
  );
};
 
// ============================================================================
// POSTER CAROUSEL CARD — single poster, used by the mobile swipe carousel
// ============================================================================

const PosterCarouselCard = ({ poster, darkMode, onPreview }) => (
  <button
    onClick={onPreview}
    aria-label={`Preview ${poster.name}`}
    className={`relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden border-2 shadow-[0_15px_30px_rgba(0,0,0,0.35)] block text-left ${
      darkMode ? 'border-purple-500/20' : 'border-purple-300/40'
    }`}
  >
    <img
      src={poster.image}
      alt={poster.name}
      draggable={false}
      className="w-full h-full object-cover pointer-events-none"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
    <div className="absolute bottom-4 left-4 right-4">
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-300 mb-1">
        {poster.tag}
      </p>
      <h4 className="text-lg font-black text-white tracking-tight leading-tight">{poster.name}</h4>
    </div>
  </button>
);

// ============================================================================
// LIGHTBOX — full view for both websites and posters, with poster nav
// ============================================================================
 
const Lightbox = ({ active, onClose, onNav }) => {
  if (!active) return null;
  const { item, list, index } = active;
  const hasNav = Array.isArray(list) && list.length > 1;
 
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-purple-400 transition-colors z-[1001]"
      >
        <X size={32} className="sm:hidden" />
        <X size={40} className="hidden sm:block" />
      </button>
 
      {hasNav && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="Previous"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-purple-400 transition-colors z-[1001]"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-purple-400 transition-colors z-[1001]"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}
 
      <div
        className="relative flex flex-col items-center gap-5 sm:gap-6 max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.name}
          className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl animate-scale-in"
        />
        <div className="text-center space-y-2 max-w-xl px-2">
          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">{item.name}</h4>
          <p className="text-sm text-purple-200/80 font-medium leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
};
 
// ============================================================================
// MAIN — Project.jsx
// ============================================================================
 
const Project = ({ darkMode = true }) => {
  const [active, setActive] = useState(null); // { item, list, index }
  const { target: vacuumTarget, stage: vacuumStage, trigger: visitWebsite } = useVacuum();
 
  const openWebsite = (site) => setActive({ item: site, list: null, index: null });
  const openPoster = (poster, index) => setActive({ item: poster, list: posters, index });
 
  const navigate = (dir) => {
    setActive((prev) => {
      if (!prev || !prev.list) return prev;
      const nextIndex = (prev.index + dir + prev.list.length) % prev.list.length;
      return { item: prev.list[nextIndex], list: prev.list, index: nextIndex };
    });
  };

  const draining = vacuumStage === 'sucking' || vacuumStage === 'flash';
 
  return (
    <div className="relative">
      <style>{`
        @keyframes vacuum-streak {
          0% { transform: translateX(-60vw) scaleX(1); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateX(0) scaleX(0.25); opacity: 0; }
        }
      `}</style>
 
      <Lightbox active={active} onClose={() => setActive(null)} onNav={navigate} />
      <VacuumLight stage={vacuumStage} name={vacuumTarget?.name} />
 
      {/* Everything below gets pulled toward the light on the right when a
          "Visit Website" is clicked, then settles back once the new tab opens. */}
      <div
        style={{
          transform: draining
            ? 'translateX(18%) scaleX(0.05) scaleY(0.55)'
            : 'translateX(0%) scaleX(1) scaleY(1)',
          transformOrigin: '100% 50%',
          opacity: draining ? 0 : 1,
          filter: draining ? 'blur(10px) brightness(1.5)' : 'blur(0px) brightness(1)',
          transitionProperty: 'transform, opacity, filter',
          transitionDuration: vacuumStage === 'restoring' ? `${RESTORE_MS}ms` : `${VACUUM_MS}ms`,
          transitionTimingFunction:
            vacuumStage === 'restoring' ? 'cubic-bezier(0.16,1,0.3,1)' : VACUUM_EASE,
        }}
        className="space-y-16 sm:space-y-24 animate-fade-in"
      >
        {/* ================= WEBSITES ================= */}
        <section>
          <SectionEyebrow label="Websites" icon={<Globe size={16} className="text-purple-500" />} />
          <p className="text-sm sm:text-base opacity-60 max-w-2xl mb-8 sm:mb-10">
            Full-stack builds spanning e-commerce, admin dashboards, and secure portals. Click
            a thumbnail for a closer look, or visit a site and watch it get pulled into the light.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {websites.map((site) => (
              <WebsiteCard
                key={site.name}
                site={site}
                darkMode={darkMode}
                onPreview={openWebsite}
                onVisit={visitWebsite}
              />
            ))}
          </div>
        </section>
 
        {/* ================= POSTER DESIGN ================= */}
        <section>
          <SectionEyebrow label="Poster Design" icon={<Layers size={16} className="text-purple-500" />} />
          <p className="text-sm sm:text-base opacity-60 max-w-2xl mb-8 sm:mb-10">
            A fanned cascade of print work — hover any poster to lift it clear of the rest, and click it
            for the full view.
          </p>
          {/* Mobile: swipeable carousel */}
          <div className="sm:hidden py-6">
            <Carousel
              items={posters}
              darkMode={darkMode}
              renderItem={(poster, idx) => (
                <PosterCarouselCard
                  poster={poster}
                  darkMode={darkMode}
                  onPreview={() => openPoster(poster, idx)}
                />
              )}
            />
          </div>

          {/* Desktop / tablet: fanned cascade stack */}
          <div className="hidden sm:flex justify-center py-10 sm:py-16">
            <PosterStack items={posters} darkMode={darkMode} onPreview={openPoster} />
          </div>
        </section>
      </div>
    </div>
  );
};
 
export default Project;