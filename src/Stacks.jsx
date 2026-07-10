import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Palette,
  Sparkles,
  Rocket,
  Wrench,
  Workflow,
  Zap,
  RefreshCw,
  GitBranch,
  Waves,
  LayoutDashboard
} from 'lucide-react';

// ============================================================================
// STACKS.JSX — "Everything I Build With"
// A full inventory of languages, tools, AI collaborators, hosts, editors and
// methodologies, styled to match the existing purple glassmorphism system
// used across App.jsx / Certifications.jsx / Project.jsx.
// ============================================================================

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
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

const SectionEyebrow = ({ label, icon }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <h3 className="text-[9px] sm:text-[11px] md:text-[12px] font-black text-purple-500 uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1em] whitespace-nowrap">
      {label}
    </h3>
    <div className="h-[1px] flex-1 bg-purple-500/20"></div>
    {icon}
  </div>
);

// ----------------------------------------------------------------------------
// DATA — every logo is pulled from a public CDN so no local assets are needed.
// Simple Icons (cdn.simpleicons.org) covers established brands.
// LobeHub's static SVG CDN covers newer AI-native tools Simple Icons lacks.
// ----------------------------------------------------------------------------

// SIMPLE: single-color brand marks, recolored on the fly via cdn.simpleicons.org
// DEVICON: multi-color "original" brand marks, served straight from the
//          devicons/devicon GitHub repo via jsDelivr (no recoloring needed)
// LOBE: AI-native brand marks (Claude, Codex, ChatGPT, Antigravity, CapCut...)
//       that Simple Icons/Devicon don't carry — served from lobehub/lobe-icons
const SIMPLE = (slug, color) => `https://cdn.simpleicons.org/${slug}/${color}`;
const DEVICON = (name, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/${name}/${name}-${variant}.svg`;
const LOBE = (slug) =>
  `https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-svg/icons/${slug}.svg`;

const stackCategories = [
  {
    id: 'core',
    title: 'Core Stack',
    subtitle: 'Languages, frameworks & build tools',
    accent: 'from-purple-600 to-indigo-700',
    icon: <Code2 size={18} className="text-purple-400" />,
    items: [
      { name: 'HTML', logo: DEVICON('html5') },
      { name: 'CSS', logo: DEVICON('css3') },
      { name: 'JavaScript', logo: DEVICON('javascript') },
      { name: 'React', logo: DEVICON('react') },
      { name: 'Node.js', logo: DEVICON('nodejs') },
      { name: 'JSON', logo: DEVICON('json') },
      { name: 'SQL', logo: DEVICON('mysql') },
      { name: 'Python', logo: DEVICON('python') },
      { name: 'Tailwind', logo: DEVICON('tailwindcss') },
      { name: 'Bootstrap', logo: DEVICON('bootstrap') },
      { name: 'Vite', logo: DEVICON('vitejs') },
    ],
  },
  {
    id: 'art',
    title: 'Design & Motion',
    subtitle: 'Visual, video & prototyping tools',
    accent: 'from-fuchsia-600 to-purple-700',
    icon: <Palette size={18} className="text-purple-400" />,
    items: [
      { name: 'Canva', logo: DEVICON('canva') },
      { name: 'CapCut', logo: LOBE('capcut') },
      { name: 'Figma', logo: DEVICON('figma') },
      { name: 'Framer', logo: SIMPLE('framer', '0055FF') },
      { name: 'Adobe PS', logo: DEVICON('photoshop') },
      { name: 'DaVinci', logo: SIMPLE('davinciresolve', '233A51') },
    ],
  },
  {
    id: 'ai',
    title: 'AI Collaborators',
    subtitle: 'Models & assistants in the daily loop',
    accent: 'from-indigo-600 to-violet-700',
    icon: <Sparkles size={18} className="text-purple-400" />,
    items: [
      { name: 'Gemini', logo: SIMPLE('googlegemini', '8E75B2') },
      { name: 'Claude', logo: SIMPLE('claude', 'D97757') },
      { name: 'Perplexity', logo: SIMPLE('perplexity', '1FB8CD') },
      { name: 'Copilot', logo: SIMPLE('githubcopilot', '000000') },
      { name: 'Codex', logo: LOBE('codex-color') },
      { name: 'ChatGPT', logo: LOBE('openai') },
      { name: 'DeepSeek', logo: SIMPLE('deepseek', '4D6BFE') },
      { name: 'Cursor', logo: SIMPLE('cursor', '000000') },
    ],
  },
  {
    id: 'ship',
    title: 'Ship & Host',
    subtitle: 'Publishing, deployment & storage',
    accent: 'from-purple-700 to-fuchsia-700',
    icon: <Rocket size={18} className="text-purple-400" />,
    items: [
      { name: 'GitHub', logo: SIMPLE('github', '181717') },
      { name: 'Replit', logo: SIMPLE('replit', 'F26207') },
      { name: 'Vercel', logo: SIMPLE('vercel', '000000') },
      { name: 'Netlify', logo: SIMPLE('netlify', '00C7B7') },
      { name: 'Drive', logo: SIMPLE('googledrive', '4285F4') },
    ],
  },
  {
    id: 'devtools',
    title: 'Workspace',
    subtitle: 'Editors, IDEs & daily-driver apps',
    accent: 'from-violet-700 to-indigo-800',
    icon: <Wrench size={18} className="text-purple-400" />,
    items: [
      { name: 'Discord', logo: SIMPLE('discord', '5865F2') },
      { name: 'Antigravity', logo: LOBE('antigravity-color') },
      { name: 'VS Code', logo: DEVICON('vscode') },
      { name: 'Notepad++', logo: SIMPLE('notepadplusplus', '90E59A') },
      { name: 'PyCharm', logo: DEVICON('pycharm') },
    ],
  },
];

// Methodologies have no brand logos — represented with icon badges instead,
// kept visually consistent with the logo tiles above.
const methodologies = [
  { name: 'Agile', icon: <Zap size={22} />, desc: 'Iterative delivery in short, feedback-driven cycles.' },
  { name: 'Scrum', icon: <RefreshCw size={22} />, desc: 'Sprints, standups & backlog grooming.' },
  { name: 'SDLC', icon: <GitBranch size={22} />, desc: 'Plan, build, test, deploy, maintain.' },
  { name: 'Waterfall', icon: <Waves size={22} />, desc: 'Sequential phases for fixed-scope work.' },
  { name: 'Kanban', icon: <LayoutDashboard size={22} />, desc: 'Visualizing flow with a living task board.' },
];

// ----------------------------------------------------------------------------
// Reusable logo tile — mirrors the "skills" tile styling from App.jsx
// ----------------------------------------------------------------------------
const LogoTile = ({ name, logo }) => (
  <div className="flex flex-col items-center gap-3 sm:gap-4 group">
    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/5 border border-purple-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:border-purple-500/40 group-hover:-translate-y-1">
      <img
        src={logo}
        alt={name}
        loading="lazy"
        className="w-7 h-7 sm:w-10 sm:h-10 object-contain transition-transform"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60 text-purple-400 text-center">
      {name}
    </span>
  </div>
);

const CategoryCard = ({ category }) => (
  <RevealOnScroll>
    <div className="bg-white/5 backdrop-blur-md border border-purple-500/10 rounded-[2.5rem] sm:rounded-[3rem] p-7 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] space-y-8 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className={`p-2.5 rounded-xl bg-gradient-to-br ${category.accent} bg-opacity-10 border border-purple-500/20`}>
              {category.icon}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              {category.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm opacity-60 font-medium pl-1">{category.subtitle}</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">
          {category.items.length} tools
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 sm:gap-8">
        {category.items.map((item) => (
          <LogoTile key={item.name} name={item.name} logo={item.logo} />
        ))}
      </div>
    </div>
  </RevealOnScroll>
);

function Stacks({ darkMode }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <RevealOnScroll>
        <div className="space-y-5 sm:space-y-6">
          <SectionEyebrow label="Everything I Build With" icon={<Workflow size={16} className="text-purple-500/40" />} />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">
            The Full Stack<span className="text-purple-500">.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-bold opacity-70 max-w-2xl leading-relaxed">
            Code, design, AI collaborators, hosting, tooling and the workflows that hold it all
            together — the complete toolkit behind every project.
          </p>
        </div>
      </RevealOnScroll>

      {stackCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}

      {/* Methodologies — icon-based, since these are practices, not brands */}
      <RevealOnScroll>
        <div className="bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-transparent backdrop-blur-xl border border-purple-500/30 rounded-[2.5rem] sm:rounded-[3rem] p-7 sm:p-10 shadow-2xl space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Workflow size={18} className="text-purple-400" />
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Methodologies
                </h3>
              </div>
              <p className="text-xs sm:text-sm opacity-60 font-medium pl-1">
                How the work actually gets organized and shipped
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">
              {methodologies.length} practices
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 sm:gap-6">
            {methodologies.map((m) => (
              <div
                key={m.name}
                className="bg-white/5 border border-purple-500/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center gap-3 transition-all hover:border-purple-500/40 hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  {m.icon}
                </div>
                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-purple-400">
                  {m.name}
                </p>
                <p className="text-[11px] sm:text-xs opacity-60 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}

export default Stacks;