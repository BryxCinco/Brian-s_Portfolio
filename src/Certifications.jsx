import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  Palette,
  Wifi,
  Network,
  Code2,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  BadgeCheck,
  ExternalLink,
  Calendar,
  Building2,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// CERTIFICATE IMAGES
// Place every PNG in ./assets/PNGVER/ next to this file, using the exact
// filenames below (these match the certs you uploaded).
// ============================================================================

import daDataScienceEthics from './assets/PNGVER/DA-DSECoursera-1.png';
import gdGraphicDesign from './assets/PNGVER/GD-AICADICT-1.png';
import iotEmbeddedSystems from './assets/PNGVER/IOT-ESCEDUCBA-1.png';
import llmPredictiveModeling from './assets/PNGVER/LLM-IMCoursera-1.png';
import netCyberPhysical from './assets/PNGVER/NET-CPSCoursera-1.png';
import progCssEssentials from './assets/PNGVER/PROG-CSSECisco-1.png';
import progJsEssentials1 from './assets/PNGVER/PROG-JSE1Cisco-1.png';
import progJsEssentials2 from './assets/PNGVER/PROG-JSE2Cisco-1.png';
import progPythonEssentials1 from './assets/PNGVER/PROG-PHYCisco-1.png';
import progPythonEssentials2 from './assets/PNGVER/PROG-PHY2Cisco-1.png';
import sweBlockchainBasics from './assets/PNGVER/SWE-BLCBCoursera-1.png';
import sweCicd from './assets/PNGVER/SWE-CICDCoursera-1.png';
import sweReactFrontend from './assets/PNGVER/SWE-DFERIBM-1.png';
import sweNodeBackend from './assets/PNGVER/SWE-DNOEXJSIBM-1.png';
import sweIntroSoftwareEng from './assets/PNGVER/SWE-ISEIBM-1.png';
import sweSimulink from './assets/PNGVER/SWE-MSSCoursera-1.png';
import sweSimulationDecision from './assets/PNGVER/SWE-SMDMCoursera-1.png';
import sweSustainableDevGoals from './assets/PNGVER/SWE-TSDGCoursera-1.png';
import aiSustainableDevWebinar from './assets/PNGVER/AI-AISDDICT.png';
import aiAnalyzeReviews from './assets/PNGVER/AI-ARCisco.png';
import aiEthicalIssuesAI from './assets/PNGVER/AI-EIAICoursera.png';
import aiEthicalIssuesComputing from './assets/PNGVER/AI-EICACoursera.png';
import aiPromptEngineering from './assets/PNGVER/AI-IAIPEDICT.png';
import aiIntroModernAI from './assets/PNGVER/AI-IMAICisco.png';
import aiUpdateResume from './assets/PNGVER/AI-URCisco.png';
import acnCompletion from './assets/PNGVER/ACN-COC.png';
import acnParticipation from './assets/PNGVER/COP-ACN.png';

// ============================================================================
// CERTIFICATION DATA
// Every cert has TWO separate images:
//   - logo: the small issuer badge shown on the card.
//   - img:  the actual certificate screenshot, shown large in the modal.
// Also needs: title, issuer, date, description, and an optional verifyUrl
// (external credential link shown as a secondary action inside the modal).
// ============================================================================

const certCategories = [
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    icon: <Cpu size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Introduction to Predictive Modeling',
        issuer: 'University of Minnesota · Coursera',
        date: 'Dec 12, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: llmPredictiveModeling,
        description: 'Covers the fundamentals of building predictive models, including regression techniques, model evaluation, and applying data-driven forecasting to real-world decisions.',
        verifyUrl: 'https://coursera.org/verify/3V1HSNI6OCYV'
      },
      {
        title: 'Ethical Issues in AI and Professional Ethics',
        issuer: 'University of Colorado Boulder · Coursera',
        date: 'Sep 26, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: aiEthicalIssuesAI,
        description: 'Examines ethical frameworks for evaluating AI systems, covering algorithmic bias, accountability, and the professional responsibilities of those who build AI-powered technology.',
        verifyUrl: 'https://coursera.org/verify/LV4LV62X1OLQ'
      },
      {
        title: 'Ethical Issues in Computing Applications',
        issuer: 'University of Colorado Boulder · Coursera',
        date: 'Dec 8, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: aiEthicalIssuesComputing,
        description: 'Explores ethical considerations across computing applications broadly, including privacy, security, professional codes of conduct, and the societal impact of software systems.',
        verifyUrl: 'https://coursera.org/verify/A01QN8X3MUU4'
      },
      {
        title: 'Introduction to Modern AI',
        issuer: 'Cisco Networking Academy · DICT-ITU DTC Initiative',
        date: 'Jun 24, 2026',
        logo: 'https://cdn.simpleicons.org/cisco/1BA0D7',
        img: aiIntroModernAI,
        description: 'Introduces the modern AI landscape, covering machine learning basics, generative AI, and how contemporary AI tools are applied across industries.',
        verifyUrl: '#'
      },
      {
        title: 'Introduction to Artificial Intelligence and Prompt Engineering Frameworks',
        issuer: 'DICT Region 2 · ILCDB',
        date: 'Jun 12, 2026',
        logo: 'https://cdn.simpleicons.org/openai/412991',
        img: aiPromptEngineering,
        description: 'Government-led training on core AI concepts and prompt engineering frameworks, covering how to structure prompts effectively for reliable, high-quality AI outputs.',
        verifyUrl: '#'
      },
      {
        title: 'Apply AI: Analyze Customer Reviews',
        issuer: 'Cisco Networking Academy · DICT-ITU DTC Initiative',
        date: 'Jul 3, 2026',
        logo: 'https://cdn.simpleicons.org/cisco/1BA0D7',
        img: aiAnalyzeReviews,
        description: 'Hands-on application of AI tools to analyze customer review data, extracting sentiment and actionable insights from unstructured text.',
        verifyUrl: '#'
      },
      {
        title: 'Apply AI: Update Your Resume',
        issuer: 'Cisco Networking Academy · DICT-ITU DTC Initiative',
        date: 'Jul 3, 2026',
        logo: 'https://cdn.simpleicons.org/cisco/1BA0D7',
        img: aiUpdateResume,
        description: 'Practical use of AI tools to refine and strengthen a resume, covering prompt strategies for tailoring content, tone, and structure to a target role.',
        verifyUrl: '#'
      },
      {
        title: 'Artificial Intelligence For Sustainable Development',
        issuer: 'DICT Region 2 - Nueva Vizcaya',
        date: 'Jun 23, 2026',
        logo: 'https://cdn.simpleicons.org/googlescholar/4285F4',
        img: aiSustainableDevWebinar,
        description: 'Webinar attendance certificate covering how artificial intelligence can be applied to advance sustainable development goals and community-level initiatives.',
        verifyUrl: '#'
      }
    ]
  },
  {
    id: 'data',
    label: 'Data Analytics',
    icon: <Database size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Data Science Ethics',
        issuer: 'University of Michigan · Coursera',
        date: 'Sep 12, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: daDataScienceEthics,
        description: 'Explores the ethical dimensions of data science practice, including data privacy, algorithmic bias, informed consent, and responsible use of data-driven systems.',
        verifyUrl: 'https://coursera.org/verify/FPM80HPH90HO'
      }
    ]
  },
  {
    id: 'design',
    label: 'Graphic Design',
    icon: <Palette size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Basic Graphic Design Using AI-Powered Canva',
        issuer: 'DICT-ITU DTC Initiative',
        date: 'Jun 12, 2026',
        logo: 'https://cdn.simpleicons.org/canva/00C4CC',
        img: gdGraphicDesign,
        description: 'Hands-on training in fundamental graphic design principles using Canva\u2019s AI-powered tools, covering layout, composition, and rapid design workflows.',
        verifyUrl: '#'
      }
    ]
  },
  {
    id: 'iot',
    label: 'Internet of Things',
    icon: <Wifi size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Embedded Systems using C',
        issuer: 'EDUCBA · Coursera',
        date: 'Dec 11, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: iotEmbeddedSystems,
        description: 'Covers embedded systems programming fundamentals in C, including microcontroller architecture, memory-constrained development, and hardware-level debugging for IoT devices.',
        verifyUrl: 'https://coursera.org/verify/2TMSH4V0ZMZJ'
      }
    ]
  },
  {
    id: 'networking',
    label: 'Networking & Systems',
    icon: <Network size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Cyber-Physical Systems: Modeling and Simulation',
        issuer: 'UC Santa Cruz · Coursera',
        date: 'Sep 26, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: netCyberPhysical,
        description: 'Examines how networked, physical, and computational systems interact, covering modeling techniques and simulation methods for cyber-physical infrastructure.',
        verifyUrl: 'https://coursera.org/verify/2PP5O5QYDXXJ'
      }
    ]
  },
  {
    id: 'programming',
    label: 'Programming',
    icon: <Code2 size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'CSS Essentials',
        issuer: 'Cisco Networking Academy · JS Institute',
        date: 'Jun 9, 2026',
        logo: 'https://cdn.simpleicons.org/css3/1572B6',
        img: progCssEssentials,
        description: 'Covers core CSS concepts including selectors, the box model, flexbox, and responsive styling techniques for building modern web layouts.',
        verifyUrl: '#'
      },
      {
        title: 'JavaScript Essentials 1',
        issuer: 'Cisco Networking Academy · JS Institute',
        date: 'Jun 17, 2026',
        logo: 'https://cdn.simpleicons.org/javascript/F7DF1E',
        img: progJsEssentials1,
        description: 'Introduces JavaScript fundamentals, including variables, data types, control flow, functions, and basic program structure.',
        verifyUrl: '#'
      },
      {
        title: 'JavaScript Essentials 2',
        issuer: 'Cisco Networking Academy · JS Institute',
        date: 'Jul 1, 2026',
        logo: 'https://cdn.simpleicons.org/javascript/F7DF1E',
        img: progJsEssentials2,
        description: 'Builds on JavaScript fundamentals with object-oriented programming, exception handling, modules, and higher-order functions.',
        verifyUrl: '#'
      },
      {
        title: 'Python Essentials 1',
        issuer: 'Cisco Networking Academy · Python Institute',
        date: 'May 3, 2024',
        logo: 'https://cdn.simpleicons.org/python/3776AB',
        img: progPythonEssentials1,
        description: 'Foundational Python training covering syntax, data types, control flow, functions, and basic input/output operations.',
        verifyUrl: '#'
      },
      {
        title: 'Python Essentials 2',
        issuer: 'Cisco Networking Academy · Python Institute',
        date: 'May 16, 2024',
        logo: 'https://cdn.simpleicons.org/python/3776AB',
        img: progPythonEssentials2,
        description: 'Continues foundational Python training into intermediate territory, covering modules, exceptions, object-oriented programming, and file processing.',
        verifyUrl: '#'
      }
    ]
  },
  {
    id: 'softwareEngineering',
    label: 'Software Engineering',
    icon: <ShieldCheck size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Blockchain Basics',
        issuer: 'University at Buffalo, SUNY · Coursera',
        date: 'Dec 12, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweBlockchainBasics,
        description: 'Introduces blockchain fundamentals, including distributed ledgers, consensus mechanisms, cryptographic hashing, and smart contract concepts.',
        verifyUrl: 'https://coursera.org/verify/E673GPV87BUY'
      },
      {
        title: 'Continuous Integration and Continuous Delivery (CI/CD)',
        issuer: 'IBM · Coursera',
        date: 'Dec 12, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweCicd,
        description: 'Covers CI/CD pipeline design, automated testing and deployment strategies, and DevOps practices for shipping software reliably.',
        verifyUrl: 'https://coursera.org/verify/N9S8I5LFXP8R'
      },
      {
        title: 'Developing Front-End Apps with React',
        issuer: 'IBM · Coursera',
        date: 'Oct 24, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweReactFrontend,
        description: 'Covers building single-page applications with React, including components, hooks, state management, and connecting a front end to backend APIs.',
        verifyUrl: 'https://coursera.org/verify/STYJ5SJCM7VU'
      },
      {
        title: 'Developing Back-End Apps with Node.js and Express',
        issuer: 'IBM · Coursera',
        date: 'Dec 6, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweNodeBackend,
        description: 'Covers building a REST API backend with Node.js and Express, including routing, middleware, authentication, and connecting to a database.',
        verifyUrl: 'https://coursera.org/verify/GL2HRRRAWTSU'
      },
      {
        title: 'Introduction to Software Engineering',
        issuer: 'IBM · Coursera',
        date: 'Sep 26, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweIntroSoftwareEng,
        description: 'Introductory course covering the software development lifecycle, engineering best practices, version control, and foundational design principles.',
        verifyUrl: 'https://coursera.org/verify/QLJQVVK1PXVR'
      },
      {
        title: 'Modeling and Simulation with Simulink',
        issuer: 'MathWorks · Coursera',
        date: 'Sep 12, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweSimulink,
        description: 'Covers building and simulating dynamic system models in Simulink, including block diagrams, signal flow, and simulation analysis.',
        verifyUrl: 'https://coursera.org/verify/V2L5W23ZDPPO'
      },
      {
        title: 'Simulation Models for Decision Making',
        issuer: 'University of Minnesota · Coursera',
        date: 'Oct 24, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweSimulationDecision,
        description: 'Explores using simulation models to support business and engineering decisions, including scenario analysis and quantitative decision frameworks.',
        verifyUrl: 'https://coursera.org/verify/KHNNISYDJ83V'
      },
      {
        title: 'The Sustainable Development Goals \u2013 A Global, Transdisciplinary Vision for the Future',
        issuer: 'University of Copenhagen · Coursera',
        date: 'Dec 19, 2025',
        logo: 'https://cdn.simpleicons.org/coursera/0056D2',
        img: sweSustainableDevGoals,
        description: 'Explores the UN Sustainable Development Goals through a transdisciplinary lens, covering how technology and engineering practice intersect with global sustainability challenges.',
        verifyUrl: 'https://coursera.org/verify/L2KNLQ2U6PI3'
      }
    ]
  },
  {
    id: 'professional',
    label: 'Professional Training',
    icon: <Award size={16} className="text-[#00b4ff] shrink-0" />,
    certs: [
      {
        title: 'Accenture Technology Academy \u2013 Certificate of Completion',
        issuer: 'Accenture · Microsoft',
        date: 'May 22, 2026',
        logo: 'https://cdn.simpleicons.org/accenture/A100FF',
        img: acnCompletion,
        description: 'Awarded for successfully completing the Accenture Technology Academy under Microsoft, a 154-hour program run from April 30 to May 22, 2026.',
        verifyUrl: '#'
      },
      {
        title: 'Accenture Technology Academy \u2013 Certificate of Participation',
        issuer: 'Accenture · Microsoft',
        date: 'May 22, 2026',
        logo: 'https://cdn.simpleicons.org/accenture/A100FF',
        img: acnParticipation,
        description: 'Recognizes active participation in the 154-hour Accenture Technology Academy under Microsoft, running from April 30 to May 22, 2026.',
        verifyUrl: '#'
      }
    ]
  }
];

// Flat list, in data order — used for the homepage preview.
const allCerts = certCategories.flatMap((category) =>
  category.certs.map((cert) => ({ ...cert, categoryLabel: category.label }))
);

// ============================================================================
// SHARED PIECES
// ============================================================================

const SectionEyebrow = ({ label, icon }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <h3 className="text-[9px] sm:text-[11px] md:text-[12px] font-black text-[#00b4ff] uppercase tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1em] whitespace-nowrap">
      {label}
    </h3>
    <div className="h-[1px] flex-1 bg-[#00b4ff]/20"></div>
    {icon}
  </div>
);

const CertCard = ({ cert, darkMode, onSelect }) => (
  <div
    onClick={() => onSelect(cert)}
    className={`group relative flex flex-col gap-5 sm:gap-6 p-6 sm:p-8 rounded-md sm:rounded-md border backdrop-blur-md cursor-pointer transition-all duration-500 hover:-translate-y-1 shadow-lg ${
      darkMode
        ? 'bg-white/5 border-[#00b4ff]/10 hover:border-[#00b4ff]/30'
        : 'bg-white/70 border-[#99f5ff] hover:border-[#00e5ff]'
    }`}
  >
    <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-1 bg-[#0088ff] text-white text-[8px] sm:text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">
      <BadgeCheck size={11} /> Verified
    </div>

    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-white flex items-center justify-center shadow-md overflow-hidden shrink-0 p-3">
      <img src={cert.logo} alt={cert.issuer} className="w-full h-full object-contain" />
    </div>

    <div className="space-y-1.5 sm:space-y-2 pr-4">
      <h4 className="text-base sm:text-lg font-black leading-tight text-slate-900 dark:text-white">
        {cert.title}
      </h4>
      <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#00e5ff]/70">
        {cert.issuer}
      </p>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-[#00b4ff]/10">
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40">
        {cert.date}
      </span>
      <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#00b4ff] opacity-60 group-hover:opacity-100 transition-opacity">
        View
        <ChevronRight size={12} />
      </span>
    </div>
  </div>
);

// Modal shown when a certificate card is clicked — shows the image/logo
// alongside title, issuer, date and description instead of jumping offsite.
const CertModal = ({ cert, darkMode, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!cert) return null;

  const hasRealVerifyUrl = cert.verifyUrl && cert.verifyUrl !== '#';

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-md sm:rounded-md border shadow-2xl animate-scale-in ${
          darkMode
            ? 'bg-[#001a33]/90 border-[#00b4ff]/20 text-[#e0f4ff]'
            : 'bg-white border-[#99f5ff] text-slate-900'
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-end p-3 sm:p-4">
          <button
            onClick={onClose}
            aria-label="Close certificate details"
            className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-colors ${
              darkMode ? 'bg-black/40 hover:bg-black/60 text-white' : 'bg-white/80 hover:bg-white text-slate-900'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {cert.img ? (
          // Certificate screenshot + issuer logo shown together:
          // big screenshot fills the frame, small logo badge overlaps
          // its bottom-left corner so both are visible at once.
          <div className={`relative flex items-center justify-center p-4 sm:p-6 max-h-[50vh] ${darkMode ? 'bg-black/20' : 'bg-[#e0f4ff]'}`}>
            <img
              src={cert.img}
              alt={cert.title}
              className="w-full max-h-[46vh] object-contain rounded-md"
            />
            <div
              className={`absolute bottom-3 left-3 sm:bottom-5 sm:left-5 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-white flex items-center justify-center shadow-lg overflow-hidden p-2 border-2 ${
                darkMode ? 'border-[#001a33]' : 'border-white'
              }`}
            >
              <img src={cert.logo} alt={cert.issuer} className="w-full h-full object-contain" />
            </div>
          </div>
        ) : (
          // No screenshot yet: fall back to showing just the logo, larger.
          <div className={`flex items-center justify-center p-8 sm:p-10 ${darkMode ? 'bg-white/5' : 'bg-[#e0f4ff]'}`}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-md bg-white flex items-center justify-center shadow-lg overflow-hidden p-5">
              <img src={cert.logo} alt={cert.issuer} className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-1.5 bg-[#0088ff] text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest w-fit">
            <BadgeCheck size={11} /> Verified Credential
          </div>

          <h3 className="text-xl sm:text-2xl font-black leading-tight">{cert.title}</h3>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-black uppercase tracking-widest opacity-60">
            <span className="flex items-center gap-1.5">
              <Building2 size={13} className="text-[#00b4ff]" /> {cert.issuer}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#00b4ff]" /> {cert.date}
            </span>
          </div>

          {cert.description && (
            <p className="text-sm leading-relaxed opacity-70">
              {cert.description}
            </p>
          )}

          {hasRealVerifyUrl && (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 pt-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#00b4ff] hover:text-[#00e5ff] transition-colors"
            >
              View Original Credential <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FULL CERTIFICATIONS PAGE (all categories, all certs)
// Used on its own nav section, e.g. activeSection === 'certificates'.
// ============================================================================

export default function Certifications({ darkMode = true }) {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="space-y-14 sm:space-y-20 pt-6 sm:pt-10">
      <CertModal cert={selectedCert} darkMode={darkMode} onClose={() => setSelectedCert(null)} />

      {certCategories.map((category) => (
        <div key={category.id} className="space-y-8 sm:space-y-10">
          <SectionEyebrow label={category.label} icon={category.icon} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {category.certs.map((cert, idx) => (
              <CertCard
                key={`${category.id}-${idx}`}
                cert={cert}
                darkMode={darkMode}
                onSelect={setSelectedCert}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

// ============================================================================
// HOMEPAGE PREVIEW (a handful of certs + a "View All" card leading to the
// full Certificates nav section)
// ============================================================================

export function CertificationsPreview({ darkMode = true, count = 4, onViewAll }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const featured = allCerts.slice(0, count);

  return (
    <section className="space-y-8 sm:space-y-10">
      <CertModal cert={selectedCert} darkMode={darkMode} onClose={() => setSelectedCert(null)} />

      <SectionEyebrow
        label="Certifications"
        icon={<ShieldCheck size={16} className="text-[#00b4ff] shrink-0" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {featured.map((cert, idx) => (
          <CertCard key={idx} cert={cert} darkMode={darkMode} onSelect={setSelectedCert} />
        ))}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className={`w-full flex items-center justify-center gap-3 py-5 sm:py-6 rounded-md sm:rounded-md border font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 ${
            darkMode
              ? 'bg-white/5 border-[#00b4ff]/10 hover:border-[#00b4ff]/30 text-[#66f0ff]'
              : 'bg-white/70 border-[#99f5ff] hover:border-[#00e5ff] text-[#b3e0ff]'
          }`}
        >
          View All Certificates <ArrowRight size={16} />
        </button>
      )}
    </section>
  );
}