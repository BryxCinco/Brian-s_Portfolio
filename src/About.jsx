import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  User, 
  Code2, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  MapPin,
  ChevronRight,
  Trophy,
  Star,
  Layers,
  History,
  Smartphone
} from 'lucide-react';

// Assets - Profiles
import brian1 from './assets/Brian1.png';
import InstagramProfile from './assets/InstagramProfile.png';
import FacebookProfile from './assets/FacebookProfile.png';
import LinkedinProfile from './assets/LinkedinProfile.png';

// Assets - Logos
import InstagramLogo from './assets/InstagramLogo.png';
import FacebookLogo from './assets/FacebookLogo.png';
import LinkedInLogo from './assets/LinkedInLogo.png';

// Scroll Animation Component Wrapper
const ScrollReveal = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const experiences = [
    {
      role: "IT Intern",
      company: "Grandline Maritime Inc.",
      period: "2026 - Present",
      desc: "Developing secure maritime Training Management Systems and modernizing web interfaces.",
      skills: ["React", "PHP", "Security"]
    },
    {
      role: "Full-Stack Developer (Freelance)",
      company: "Various Projects",
      period: "2025 - 2026",
      desc: "Built e-commerce platforms and logistics tracking systems like SweepXpress and Dough Re Mi.",
      skills: ["MySQL", "Tailwind", "Vite"]
    }
  ];

  const academicTimeline = [
    {
      year: "4th Year: Professional Mastery",
      period: "2025 - 2026",
      project: "Maritime LMS & Capstone",
      desc: "Developed a secure, anti-screenshot learning portal for maritime students. Currently finishing IT Internship.",
      achievement: "Outstanding Intern Candidate & Lead Developer",
      icon: <ShieldCheck size={20} />
    },
    {
      year: "3rd Year: Full-Stack Expansion",
      period: "2024 - 2025",
      project: "SweepXpress & Soundlify",
      desc: "Engineered a real-time logistics system and a modern music streaming interface using React and Tailwind.",
      achievement: "Certified in Python Essentials & Backend Dev (DICT)",
      icon: <Layers size={20} />
    },
    {
      year: "2nd Year: Systems & Databases",
      period: "2023 - 2024",
      project: "Dough Re Mi (E-commerce)",
      desc: "Built a full-stack bakery system using PHP and MySQL. Mastered database normalization and CRUD operations.",
      achievement: "Dean's List (Consistent Academic Excellence)",
      icon: <Code2 size={20} />
    },
    {
      year: "1st Year: Foundations of Logic",
      period: "2022 - 2023",
      project: "Banking Logic & CLI Tools",
      desc: "Focused on Algorithm design and basic data structures using C and Python.",
      achievement: "Top 5 in First-Year Programming Competition",
      icon: <Cpu size={20} />
    }
  ];

  const projectShowcase = [
    {
      name: "Facebook",
      tech: "Brian Francisco",
      screenshot: FacebookProfile,
      logo: FacebookLogo,
      url: "https://web.facebook.com/Bryx.Francisco111/" 
    },
    {
      name: "Instagram",
      tech: "@Bryx_Cinco",
      screenshot: InstagramProfile,
      logo: InstagramLogo,
      url: "https://www.instagram.com/bryx_cinco/" 
    },
    {
      name: "Linkedin",
      tech: "Brian Francisco",
      screenshot: LinkedinProfile,
      logo: LinkedInLogo,
      url: "https://www.linkedin.com/in/brian-francisco-419b163a4/" 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-slate-900 dark:text-blue-50 pt-32 pb-20 px-6 lg:px-12 overflow-hidden relative transition-colors duration-500"
    >
      
      <div className="max-w-[1400px] mx-auto space-y-32">
        
        {/* HERO SECTION - Entry Animation */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#00b4ff]/10 border border-[#00b4ff]/20 rounded-md text-[#00b4ff] dark:text-[#00e5ff] text-xs font-black uppercase tracking-widest">
              <User size={14} /> More Things About Me
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">
              Behind the <span className="text-[#00b4ff]">Pixels.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-blue-100/70 font-medium leading-relaxed max-w-3xl">
              I am Brian Paul, a BSIT student at <span className="text-[#00b4ff] dark:text-white font-bold">National Teachers College</span> currently bridging the gap between security-focused backend architecture and fluid frontend experiences.
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-blue-300/60">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#00b4ff]"/> Manila, PH</div>
              <div className="flex items-center gap-2"><Globe size={16} className="text-[#00b4ff]"/> Full-Stack Security</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 rounded-md overflow-hidden border-2 border-[#00b4ff]/30 rotate-3 hover:rotate-0 transition-transform duration-700 aspect-square shadow-2xl">
              <img src={brian1} alt="Brian" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-4 bg-[#0088ff]/20 blur-3xl rounded-full -z-0 animate-pulse" />
          </motion.div>
        </section>

        {/* ACADEMIC ROADMAP - Scroll Animation */}
        <ScrollReveal>
          <section className="space-y-16">
            <div className="flex items-center gap-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Academic Roadmap</h3>
              <div className="h-[1px] flex-1 bg-[#00b4ff]/20"></div>
              <History className="text-[#00b4ff]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {academicTimeline.map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md p-8 hover:border-[#00b4ff]/40 transition-all group relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.2] dark:opacity-[0.05] group-hover:scale-125 transition-transform duration-500 text-[#00b4ff] dark:text-white">
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black text-[#00b4ff] dark:text-[#00e5ff] uppercase tracking-widest mb-4">{item.period}</p>
                  <h4 className="text-lg font-black mb-2 text-slate-900 dark:text-white">{item.year}</h4>
                  <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase mb-4 tracking-tighter">{item.project}</p>
                  <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed mb-6">{item.desc}</p>
                  <div className="pt-4 border-t border-[#00b4ff]/10 flex items-start gap-2">
                    <Star size={14} className="text-yellow-500 shrink-0 mt-1" />
                    <p className="text-[11px] font-bold text-slate-700 dark:text-blue-200 italic">{item.achievement}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* EXPERIENCE & ACHIEVEMENTS - Scroll Animation */}
        <ScrollReveal>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md p-10 md:p-14 space-y-10 shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Work Experience</h3>
                <Briefcase className="text-[#00b4ff]" />
              </div>
              <div className="space-y-12">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-[#00b4ff]/20 group">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#00b4ff] rounded-full group-hover:scale-125 transition-transform" />
                    <p className="text-[10px] font-black text-[#00b4ff] dark:text-[#00e5ff] uppercase tracking-widest mb-2">{exp.period}</p>
                    <h4 className="text-xl font-black mb-1 text-slate-900 dark:text-white">{exp.role}</h4>
                    <p className="text-sm font-bold text-slate-500 dark:text-white/60 mb-4">{exp.company}</p>
                    <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed mb-4">{exp.desc}</p>
                    <div className="flex gap-2">
                      {exp.skills.map(s => (
                        <span key={s} className="text-[9px] px-2 py-1 bg-[#00b4ff]/10 border border-[#00b4ff]/20 rounded-md font-black text-[#0088ff] dark:text-[#00e5ff] uppercase">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#0088ff] to-[#004080] rounded-md p-10 md:p-14 text-white shadow-xl relative overflow-hidden group">
                <Trophy className="absolute -right-10 -bottom-10 size-64 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">Key Achievements</h3>
                <div className="space-y-6 relative z-10">
                  {[
                    "President’s Lister Academic Award (NTC)",
                    "Best in Mobile Application Design 2024",
                    "Verified Professional Certification (DICT/Cisco)",
                    "Grandline IT Excellence Recognition"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center">
                        <Star size={18} className="text-yellow-400" />
                      </div>
                      <p className="font-bold text-lg">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/40 dark:bg-white/5 border border-[#00b4ff]/10 rounded-md p-10 grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <ShieldCheck className="text-[#00b4ff] dark:text-[#00e5ff] mb-4" />
                    <p className="text-xs font-black uppercase text-slate-400 dark:text-white/40">Focus</p>
                    <p className="font-black text-slate-900 dark:text-white">Cybersecurity & Auth</p>
                 </div>
                 <div className="space-y-2">
                    <Code2 className="text-[#00b4ff] dark:text-[#00e5ff] mb-4" />
                    <p className="text-xs font-black uppercase text-slate-400 dark:text-white/40">Style</p>
                    <p className="font-black text-slate-900 dark:text-white">Clean & Scalable</p>
                 </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* MISSION STATEMENT */}
        <ScrollReveal>
          <section className="text-center py-20 relative">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic leading-tight text-slate-900 dark:text-white">
              "Coding with <span className="text-[#00b4ff]">purpose</span>, <br />designing for <span className="text-[#00b4ff]">people</span>."
            </h2>
            <p className="text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
              My goal is to create digital solutions that are not just visually striking, but robust and user-centric. Every year of my BSIT journey has been a step towards mastering high-performance software and systems.
            </p>
          </section>
        </ScrollReveal>

        {/* IPHONE PROJECT SHOWCASE WITH LINKS */}
        <ScrollReveal>
          <section className="space-y-16 pb-20">
            <div className="flex items-center gap-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">My Socials</h3>
              <div className="h-[1px] flex-1 bg-[#00b4ff]/20"></div>
              <Smartphone className="text-[#00b4ff]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {projectShowcase.map((project, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center group"
                >
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative mx-auto border-gray-900 dark:border-black bg-gray-900 border-[10px] rounded-[3.2rem] h-[750px] w-[350px] shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-[#00b4ff]/40 cursor-pointer block"
                  >
                    {/* Dynamic Island - iPhone 17 */}
                    <div className="w-[120px] h-[34px] bg-black top-[12px] rounded-full left-1/2 -translate-x-1/2 absolute z-20 flex items-center justify-end pr-3">
                      <div className="w-[10px] h-[10px] rounded-full bg-gray-800"></div>
                    </div>

                    {/* Left side: Action Button + Volume Up/Down */}
                    <div className="h-[28px] w-[3px] bg-gray-700 absolute -left-[13px] top-[130px] rounded-l-lg"></div>
                    <div className="h-[45px] w-[3px] bg-gray-800 absolute -left-[13px] top-[185px] rounded-l-lg"></div>
                    <div className="h-[45px] w-[3px] bg-gray-800 absolute -left-[13px] top-[240px] rounded-l-lg"></div>

                    {/* Right side: Power Button + Camera Control */}
                    <div className="h-[65px] w-[3px] bg-gray-800 absolute -right-[13px] top-[160px] rounded-r-lg"></div>
                    <div className="h-[38px] w-[4px] bg-gradient-to-b from-gray-600 to-gray-800 absolute -right-[14px] top-[250px] rounded-r-lg"></div>
                    
                    <div className="relative w-full h-full">
                      <div className="rounded-[2.7rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800">
                        <img 
                          src={project.screenshot} 
                          className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all" 
                          alt={project.name} 
                        />
                      </div>

                      {/* BIG CIRCLE LOGO */}
                      <div className="absolute bottom-[-64px] left-1/2 -translate-x-1/2 w-32 h-32 bg-white dark:bg-gray-900 border-[8px] border-gray-900 dark:border-black rounded-full z-30 flex items-center justify-center shadow-2xl ring-4 ring-white/5 transition-transform duration-500 group-hover:scale-110">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                             <img 
                              src={project.logo} 
                              alt={`${project.name} Logo`} 
                              className="w-full h-full object-contain"
                             />
                          </div>
                      </div>
                    </div>
                  </a>
                  
                  <div className="mt-20 text-center space-y-2">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{project.name}</h4>
                    <p className="text-xs font-black text-[#00b4ff] dark:text-[#00e5ff] uppercase tracking-widest">{project.tech}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>

      </div>
    </motion.div>
  );
};

export default About;