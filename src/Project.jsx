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
// Until then it stays "#" and the portal effect will still play, it just
// won't navigate anywhere at the end (see usePortalTransition's guard below).
 
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
    <h3 className="text-[9px] sm:text-[11px] md:text-[12px] font-black text-[#00b4ff] uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1em] whitespace-nowrap">
      {label}
    </h3>
    <div className="h-[1px] flex-1 bg-[#00b4ff]/20" />
    {icon}
  </div>
);
 
// ============================================================================
// PORTAL EFFECT — a small ring of light blinks open in the center of the
// screen, then flares into a full swirling portal. The page content gets
// pulled toward it, spinning and shrinking down to a point as it "zooms in"
// through the portal. A flash marks the moment of arrival, then the portal
// snaps shut and the page settles back. `stage` drives the portal overlay;
// the page-content transform (in Project) reads `sucking`/`flash` to zoom in.
// ============================================================================

const OPEN_MS = 380; // the portal blinks open
const ZOOM_MS = 1300; // the page spins and zooms into it — the part we want seen
const FLASH_MS = 220; // bright pop the instant we've gone all the way through
const RESTORE_MS = 700; // the portal snaps shut and the page settles back

const ZOOM_EASE = 'cubic-bezier(0.74,0,0.86,0.13)'; // slow start, hard pull at the end
const OPEN_EASE = 'cubic-bezier(0.34,1.56,0.64,1)'; // little overshoot "pop" as it opens

const usePortalTransition = () => {
  const [target, setTarget] = useState(null); // { name, url }
  const [stage, setStage] = useState('idle'); // idle -> opening -> sucking -> flash -> restoring
  const arrivedRef = useRef(false);

  const trigger = (site) => {
    arrivedRef.current = false;
    setTarget(site);
    setStage('opening');
  };

  useEffect(() => {
    if (stage !== 'opening') return undefined;
    const t = setTimeout(() => setStage('sucking'), OPEN_MS);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'sucking') return undefined;
    const t = setTimeout(() => setStage('flash'), ZOOM_MS);
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

// The portal ring + inward-spiraling streaks + flash, fixed above everything.
const PortalOverlay = ({ stage, name }) => {
  const opened = stage === 'opening' || stage === 'sucking';
  const spinning = stage === 'sucking';
  const flashing = stage === 'flash';

  // Ring blinks open with a little pop, then snaps shut fast once we're through.
  const ringSize = opened ? 'min(58vw, 58vh, 300px)' : '0px';
  const ringTransitionMs = stage === 'opening' ? OPEN_MS : stage === 'sucking' ? 90 : 220;
  const ringTransitionEase = stage === 'opening' ? OPEN_EASE : 'cubic-bezier(0.6,0,0.9,0.2)';

  return (
    <div className="fixed inset-0 z-[2000] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* streaks — thin radial slivers racing inward along the portal's rim */}
      {spinning &&
        Array.from({ length: 10 }).map((_, i) => {
          const angle = (360 / 10) * i;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
            >
              <div
                className="w-[3px] h-[70px] rounded-full"
                style={{
                  transformOrigin: '50% 100%',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(216,180,254,0.9) 55%, rgba(255,255,255,0.95) 100%)',
                  animation: `portal-suck ${900 + (i % 3) * 150}ms ${i * 65}ms cubic-bezier(0.6,0,0.9,0.2) infinite`,
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          );
        })}

      {/* the portal ring itself, blinking open in the center */}
      <div
        className="rounded-full"
        style={{
          width: ringSize,
          height: ringSize,
          padding: '4px',
          background:
            'conic-gradient(from 0deg, #00b4ff, #a855f7, #d8b4fe, #00e5ff, #00b4ff)',
          boxShadow: opened
            ? '0 0 50px 14px rgba(0,180,255,0.55), 0 0 110px 40px rgba(168,85,247,0.4)'
            : 'none',
          transition: `width ${ringTransitionMs}ms ${ringTransitionEase}, height ${ringTransitionMs}ms ${ringTransitionEase}, box-shadow ${ringTransitionMs}ms ease`,
          animation: spinning ? 'portal-spin 2.4s linear infinite' : 'none',
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, #ffffff 0%, rgba(216,180,254,0.95) 18%, rgba(139,92,246,0.9) 45%, rgba(30,10,50,0.97) 78%, rgba(10,5,20,0.98) 100%)',
          }}
        />
      </div>

      {/* full-screen flash the instant we've gone all the way through */}
      <div
        className="absolute inset-0 bg-white transition-opacity"
        style={{
          opacity: flashing ? 1 : 0,
          transitionDuration: flashing ? '80ms' : `${FLASH_MS + 120}ms`,
          transitionTimingFunction: flashing ? 'ease-in' : 'ease-out',
        }}
      />

      {name && (
        <div
          className="absolute left-0 right-0 flex justify-center transition-opacity duration-300"
          style={{ top: 'calc(50% + min(34vh, 175px))', opacity: opened ? 1 : 0 }}
        >
          <span className="text-white font-black uppercase tracking-[0.35em] text-[10px] sm:text-xs drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]">
            Entering {name}
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
  <div className="bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md overflow-hidden shadow-lg transition-all duration-500 hover:border-[#00b4ff]/30 group">
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
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-[#66f0ff] mb-1">
          {site.tag}
        </p>
        <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter leading-none">
          {site.name}
        </h4>
      </div>
    </button>
 
    <div className="p-6 sm:p-8 space-y-4 sm:space-y-5">
      <p className="text-sm opacity-60 font-medium leading-relaxed">{site.desc}</p>
 
      {/* Visit Website — opens the portal, zooms in, then hands off to the live link */}
      <a
        href={site.url || '#'}
        onClick={(e) => {
          e.preventDefault();
          onVisit(site);
        }}
        title={site.url && site.url !== '#' ? `Visit ${site.name}` : 'Live link coming soon'}
        className={`inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-md border transition-all ${
          darkMode
            ? 'bg-white/5 border-[#00b4ff]/20 text-[#66f0ff] hover:border-[#00b4ff]/40'
            : 'bg-[#e0f4ff] border-[#99f5ff] text-[#0066cc] hover:border-[#00e5ff]'
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
                  ? 'shadow-[0_35px_60px_rgba(0,0,0,0.55)] border-[#00e5ff]/70'
                  : `shadow-[0_15px_30px_rgba(0,0,0,0.35)] ${darkMode ? 'border-[#00b4ff]/20' : 'border-[#66f0ff]/40'}`
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
    className={`relative w-full aspect-[3/4] rounded-md overflow-hidden border-2 shadow-[0_15px_30px_rgba(0,0,0,0.35)] block text-left ${
      darkMode ? 'border-[#00b4ff]/20' : 'border-[#66f0ff]/40'
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
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#66f0ff] mb-1">
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
        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-[#00e5ff] transition-colors z-[1001]"
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
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#00e5ff] transition-colors z-[1001]"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#00e5ff] transition-colors z-[1001]"
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
          className="max-w-full max-h-[72vh] object-contain rounded-md shadow-2xl animate-scale-in"
        />
        <div className="text-center space-y-2 max-w-xl px-2">
          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">{item.name}</h4>
          <p className="text-sm text-[#99f5ff]/80 font-medium leading-relaxed">{item.desc}</p>
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
  const { target: portalTarget, stage: portalStage, trigger: visitWebsite } = usePortalTransition();
 
  const openWebsite = (site) => setActive({ item: site, list: null, index: null });
  const openPoster = (poster, index) => setActive({ item: poster, list: posters, index });
 
  const navigate = (dir) => {
    setActive((prev) => {
      if (!prev || !prev.list) return prev;
      const nextIndex = (prev.index + dir + prev.list.length) % prev.list.length;
      return { item: prev.list[nextIndex], list: prev.list, index: nextIndex };
    });
  };

  const zoomingIn = portalStage === 'sucking' || portalStage === 'flash';
 
  return (
    <div className="relative">
      <style>{`
        @keyframes portal-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes portal-suck {
          0% { transform: translateY(-160px) scaleY(1); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(0) scaleY(0.25); opacity: 0; }
        }
      `}</style>
 
      <Lightbox active={active} onClose={() => setActive(null)} onNav={navigate} />
      <PortalOverlay stage={portalStage} name={portalTarget?.name} />
 
      {/* Everything below spins and zooms into the portal at the center of the
          screen when a "Visit Website" is clicked, then settles back once the
          new tab opens. */}
      <div
        style={{
          transform: zoomingIn
            ? 'scale(0.04) rotate(24deg)'
            : 'scale(1) rotate(0deg)',
          transformOrigin: '50% 50%',
          opacity: zoomingIn ? 0 : 1,
          filter: zoomingIn ? 'blur(10px) brightness(1.6)' : 'blur(0px) brightness(1)',
          transitionProperty: 'transform, opacity, filter',
          transitionDuration: portalStage === 'restoring' ? `${RESTORE_MS}ms` : `${ZOOM_MS}ms`,
          transitionTimingFunction:
            portalStage === 'restoring' ? 'cubic-bezier(0.16,1,0.3,1)' : ZOOM_EASE,
        }}
        className="space-y-16 sm:space-y-24 animate-fade-in"
      >
        {/* ================= WEBSITES ================= */}
        <section>
          <SectionEyebrow label="Websites" icon={<Globe size={16} className="text-[#00b4ff]" />} />
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
          <SectionEyebrow label="Poster Design" icon={<Layers size={16} className="text-[#00b4ff]" />} />
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