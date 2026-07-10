import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  User,
  Code2,
  Cpu,
  Globe,
  ShieldCheck,
  Briefcase,
  MapPin,
  Trophy,
  Star,
  Layers,
  History,
  Smartphone,
  Quote
} from 'lucide-react';


// Import Chatbot component
import Chatbot from './Chatbot';

// Assets - Profiles
import brian1 from './assets/Brian1.png';
import InstagramProfile from './assets/InstagramProfile.png';
import FacebookProfile from './assets/FacebookProfile.png';
import LinkedinProfile from './assets/LinkedinProfile.png';

// Assets - Logos
import InstagramLogo from './assets/InstagramLogo.png';
import FacebookLogo from './assets/FacebookLogo.png';
import LinkedInLogo from './assets/LinkedInLogo.png';

const ScrollReveal = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, ease: 'easeOut' }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Small reusable section eyebrow — label + hairline rule + icon
const SectionEyebrow = ({ label, icon }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <h3 className="text-[9px] sm:text-[11px] md:text-[12px] font-black text-purple-500 uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1em] whitespace-nowrap">
      {label}
    </h3>
    <div className="h-[1px] flex-1 bg-purple-500/20"></div>
    {icon}
  </div>
);

const About = ({ darkMode }) => {
  const experiences = [
    {
      role: 'Software Engineer',
      company: 'Grandline Maritime Inc.',
      period: '2026 - Present',
      desc: 'Developing secure maritime Training Management Systems and modernizing web interfaces.',
      skills: ['React', 'PHP', 'Security']
    },
    {
      role: 'Full-Stack Developer (Freelance)',
      company: 'Various Projects',
      period: '2025 - 2026',
      desc: 'Built e-commerce platforms and logistics tracking systems like SweepXpress and Dough Re Mi.',
      skills: ['MySQL', 'Tailwind', 'Vite']
    }
  ];

  const academicTimeline = [
    {
      year: '4th Year: Professional Mastery',
      period: '2025 - 2026',
      project: 'Maritime LMS & Capstone',
      desc: 'Developed a secure, anti-screenshot learning portal for maritime students. Currently finishing IT Internship.',
      achievement: 'Outstanding Intern Candidate & Lead Developer',
      icon: <ShieldCheck size={24} />
    },
    {
      year: '3rd Year: Full-Stack Expansion',
      period: '2024 - 2025',
      project: 'SweepXpress & Soundlify',
      desc: 'Engineered a real-time logistics system and a modern music streaming interface using React and Tailwind.',
      achievement: 'Certified in Python Essentials & Backend Dev (DICT)',
      icon: <Layers size={24} />
    },
    {
      year: '2nd Year: Systems & Databases',
      period: '2023 - 2024',
      project: 'Dough Re Mi (E-commerce)',
      desc: 'Built a full-stack bakery system using PHP and MySQL. Mastered database normalization and CRUD operations.',
      achievement: "Dean's List (Consistent Academic Excellence)",
      icon: <Code2 size={24} />
    },
    {
      year: '1st Year: Foundations of Logic',
      period: '2022 - 2023',
      project: 'Banking Logic & CLI Tools',
      desc: 'Focused on Algorithm design and basic data structures using C and Python.',
      achievement: 'Top 5 in First-Year Programming Competition',
      icon: <Cpu size={24} />
    }
  ];

  const projectShowcase = [
    {
      name: 'Facebook',
      tech: 'Brian Francisco',
      screenshot: FacebookProfile,
      logo: FacebookLogo,
      url: 'https://web.facebook.com/Bryx.Francisco111/'
    },
    {
      name: 'Instagram',
      tech: '@Bryx_Cinco',
      screenshot: InstagramProfile,
      logo: InstagramLogo,
      url: 'https://www.instagram.com/bryx_cinco/'
    },
    {
      name: 'Linkedin',
      tech: 'Brian Francisco',
      screenshot: LinkedinProfile,
      logo: LinkedInLogo,
      url: 'https://www.linkedin.com/in/brian-francisco-419b163a4/'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden relative transition-colors duration-500"
    >
      <div className="max-w-[1400px] mx-auto space-y-20 sm:space-y-24 lg:space-y-32">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-500 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              <User size={14} /> Discovery Phase
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.95] text-slate-900 dark:text-white">
              Behind the <span className="text-purple-600">Pixels.</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-slate-600 dark:text-purple-100/70 font-medium leading-relaxed max-w-3xl mx-auto lg:mx-0">
              I am Brian Paul, an aspiring Full-Stack Engineer with a focus on UI/UX design, AI integration, and APIs — someone who wants to build things and turn ideas into real-world solutions.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-500 dark:text-purple-300/60">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-purple-500" /> Manila, PH
              </div>
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-purple-500" /> Full-Stack Security
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative order-1 lg:order-2 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-none mx-auto w-full"
          >
            <div className="relative z-10 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] overflow-hidden border-4 border-purple-500/20 rotate-3 hover:rotate-0 transition-transform duration-700 aspect-square shadow-2xl">
              <img src={brian1} alt="Brian" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-4 bg-purple-600/20 blur-3xl rounded-full -z-0 animate-pulse" />
          </motion.div>
        </section>

        {/* ACADEMIC ROADMAP - Matching Bento Style */}
        <ScrollReveal>
          <section className="space-y-10 sm:space-y-16">
            <SectionEyebrow label="Academic Roadmap" icon={<History className="text-purple-500 shrink-0" />} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {academicTimeline.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 backdrop-blur-md border border-purple-500/10 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-7 sm:p-8 lg:p-10 hover:border-purple-500/40 transition-all group relative overflow-hidden shadow-xl"
                >
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-40 transition-all duration-500 text-purple-500 group-hover:scale-125">
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-5 sm:mb-6">{item.period}</p>
                  <h4 className="text-lg sm:text-xl font-black mb-2 text-slate-900 dark:text-white leading-tight">{item.year}</h4>
                  <p className="text-xs font-black text-purple-400/60 uppercase mb-5 sm:mb-6 tracking-tighter">{item.project}</p>
                  <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed mb-8 sm:mb-10">{item.desc}</p>
                  <div className="pt-6 border-t border-purple-500/10 flex items-start gap-3">
                    <Star size={16} className="text-yellow-500 shrink-0 mt-1" />
                    <p className="text-[11px] font-bold text-slate-700 dark:text-purple-200 italic leading-relaxed">{item.achievement}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* WORK EXPERIENCE & ACHIEVEMENTS */}
        <ScrollReveal>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Experience Card */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-purple-500/10 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] p-7 sm:p-10 md:p-16 space-y-10 sm:space-y-12 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
                  Professional Journey
                </h3>
                <Briefcase className="text-purple-500 shrink-0" />
              </div>
              <div className="space-y-12 sm:space-y-16">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-8 sm:pl-10 border-l-2 border-purple-500/20 group">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-purple-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-3">{exp.period}</p>
                    <h4 className="text-xl sm:text-2xl font-black mb-1 text-slate-900 dark:text-white">{exp.role}</h4>
                    <p className="text-sm font-bold text-slate-500 dark:text-purple-300/60 mb-5 sm:mb-6">{exp.company}</p>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 leading-relaxed mb-6 sm:mb-8">{exp.desc}</p>
                    <div className="flex flex-wrap gap-3">
                      {exp.skills.map((s) => (
                        <span key={s} className="text-[10px] px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl font-black text-purple-500 uppercase tracking-widest">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Card Stack */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8 flex flex-col">
              <div className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] p-7 sm:p-10 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <Trophy className="absolute -right-12 -bottom-12 size-56 sm:size-72 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic mb-8 sm:mb-10">Key Accolades</h3>
                <div className="space-y-6 sm:space-y-8 relative z-10">
                  {[
                    "President's Lister Academic Award (NTC)",
                    'Best in Mobile Application Design 2024',
                    'Verified Professional Certification (DICT/Cisco)',
                    'Grandline IT Excellence Recognition'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                        <Star size={20} className="text-yellow-400" />
                      </div>
                      <p className="font-black text-base sm:text-lg tracking-tight">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motto Card */}
              <div className="bg-white/5 backdrop-blur-md border border-purple-500/10 rounded-[2.5rem] sm:rounded-[3.5rem] p-7 sm:p-12 relative overflow-hidden group shadow-2xl">
                <Quote className="absolute top-8 right-8 opacity-10 group-hover:rotate-12 transition-transform" size={40} />
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">The Philosophy</p>
                  <h4 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight text-slate-900 dark:text-white">
                    'Persistence over <span className="text-purple-500">perfection</span>.'
                  </h4>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* MISSION STATEMENT */}
        <ScrollReveal>
          <section className="text-center py-10 sm:py-20 relative px-2">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 sm:mb-10 italic leading-tight text-slate-900 dark:text-white">
              'Coding with{' '}
              <span className="text-purple-600 underline decoration-purple-500/20 underline-offset-8">purpose</span>,{' '}
              <br className="hidden sm:block" />
              designing for people.'
            </h2>
            <p className="text-base sm:text-xl text-slate-600 dark:text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">
              My goal is to create digital solutions that are not just visually striking, but robust and user-centric. Every year of my BSIT journey has been a step towards mastering high-performance software.
            </p>
          </section>
        </ScrollReveal>

        {/* SOCIAL SHOWCASE (iPhone Style) */}
        <ScrollReveal>
          <section className="space-y-14 sm:space-y-20 pb-10 sm:pb-20">
            <SectionEyebrow label="Social Archives" icon={<Smartphone className="text-purple-500 shrink-0" />} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 sm:gap-20 md:gap-10 lg:gap-16">
              {projectShowcase.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center group"
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mx-auto border-gray-900 dark:border-black bg-gray-900 border-[10px] sm:border-[12px] md:border-[16px] rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[4rem] h-[520px] w-[250px] sm:h-[620px] sm:w-[300px] md:h-[700px] md:w-[340px] lg:h-[750px] lg:w-[360px] shadow-2xl transition-all duration-700 group-hover:-translate-y-6 group-hover:shadow-[0_40px_80px_rgba(168,85,247,0.3)] cursor-pointer block overflow-visible"
                  >
                    <div className="w-[100px] sm:w-[120px] md:w-[150px] h-[22px] sm:h-[25px] md:h-[28px] bg-gray-900 top-0 rounded-b-[1.8rem] left-1/2 -translate-x-1/2 absolute z-20"></div>

                    <div className="relative w-full h-full">
                      <div className="rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800">
                        <img
                          src={project.screenshot}
                          className="w-full h-full object-cover brightness-90 group-hover:brightness-105 transition-all duration-700"
                          alt={project.name}
                        />
                      </div>

                      <div className="absolute bottom-[-44px] sm:bottom-[-52px] md:bottom-[-60px] left-1/2 -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white dark:bg-gray-900 border-[6px] sm:border-[7px] md:border-[8px] border-gray-950 rounded-full z-30 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden">
                          <img src={project.logo} alt={project.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  </a>

                  <div className="mt-16 sm:mt-20 md:mt-24 text-center space-y-2 sm:space-y-3">
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{project.name}</h4>
                    <p className="text-xs font-black text-purple-500 uppercase tracking-[0.3em]">{project.tech}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>

      <Chatbot darkMode={darkMode} />
    </motion.div>
  );
};

export default About;