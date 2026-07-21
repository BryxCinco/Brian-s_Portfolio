import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import emailjs from '@emailjs/browser';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  X,
  Radio,
  Clock,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

// Import Chatbot component
import Chatbot from './Chatbot';

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0 }) => {
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
      transition={{ duration: 0.6, delay: delay, ease: 'easeOut' }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 30 }
      }}
    >
      {children}
    </motion.div>
  );
};

const Contact = ({ darkMode }) => {
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const contactInfo = [
    { icon: <Mail size={20} />, label: 'Email', val: 'brian@example.com', href: 'mailto:brian@example.com' },
    { icon: <Phone size={20} />, label: 'Phone', val: '+63 912 345 6789', href: 'tel:+639123456789' },
    { icon: <MapPin size={20} />, label: 'Office', val: 'Manila, PH', href: null }
  ];

  const handleSubmitContact = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // EmailJS Integration
    const serviceID = 'service_1111';
    const templateID = 'template_yjvv0ch';
    const publicKey = 'lwxim5qaSvPtwlwxL';

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      title: 'Portfolio Inquiry'
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setIsSent(true);
        setShowModal(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSent(false), 3000);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        setErrorMsg(
          `May error: ${err.text || 'Unknown Error'}. Status: ${err.status || 'N/A'}. Siguraduhin na ang variables sa EmailJS Dashboard ay tugma sa: name, email, message.`
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative space-y-10 pb-20 pt-10"
    >
      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative bg-[#0a1628] border border-[#00b4ff]/30 rounded-md p-8 md:p-12 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="absolute top-6 right-6 text-[#00e5ff]/50 hover:text-[#00e5ff] transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Message Sent!</h2>
              <p className="text-sm text-[#99f5ff]/60 mb-8 leading-relaxed">
                Salamat sa pag-message! Makakarating ito sa aking Gmail at susubukan kong sumagot agad.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-[#0088ff] text-white rounded-md font-black text-xs uppercase tracking-widest hover:bg-[#00b4ff] transition-all shadow-[0_10px_20px_rgba(0,180,255,0.3)] active:scale-95"
              >
                Awesome
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <ScrollReveal>
        <div className="text-center space-y-4 px-4">
          <h2 className="text-[10px] sm:text-[12px] font-black text-[#00b4ff] uppercase tracking-[0.6em] sm:tracking-[1em]">
            Get In Touch
          </h2>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Contact Me<span className="text-[#00b4ff]">.</span>
          </h1>
          <p className="opacity-60 text-base sm:text-lg max-w-2xl mx-auto">
            Open for collaboration, internship opportunities, or just a friendly "Hello World!"
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* LEFT: CONTACT FORM */}
        <div className="lg:col-span-7">
          <ScrollReveal delay={0.15}>
            <div className="bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md p-6 sm:p-8 md:p-12 shadow-xl h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
                  Send a Message
                </h3>
                <p className="text-sm opacity-50 mt-2 dark:text-white/60">
                  Fill in the details below — I read every message myself.
                </p>
              </div>

              <form onSubmit={handleSubmitContact} className="space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-[#00b4ff] ml-2">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="w-full bg-[#00b4ff]/5 border border-[#00b4ff]/10 rounded-md p-4 outline-none focus:border-[#00b4ff]/50 focus:ring-2 focus:ring-[#00b4ff]/20 transition-all text-sm font-bold dark:text-white"
                      placeholder="Juan Dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#00b4ff] ml-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full bg-[#00b4ff]/5 border border-[#00b4ff]/10 rounded-md p-4 outline-none focus:border-[#00b4ff]/50 focus:ring-2 focus:ring-[#00b4ff]/20 transition-all text-sm font-bold dark:text-white"
                      placeholder="juan@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-[#00b4ff] ml-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="6"
                    required
                    className="w-full flex-1 min-h-[140px] bg-[#00b4ff]/5 border border-[#00b4ff]/10 rounded-md p-6 outline-none focus:border-[#00b4ff]/50 focus:ring-2 focus:ring-[#00b4ff]/20 transition-all text-sm font-bold resize-none dark:text-white"
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-md p-4 text-red-400"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed">{errorMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-[#0088ff] text-white rounded-md font-black text-xs uppercase tracking-widest hover:bg-[#00b4ff] transition-all shadow-[0_10px_25px_rgba(0,180,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSent ? (
                    <>
                      <CheckCircle2 size={18} /> Message Sent!
                    </>
                  ) : isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </ScrollReveal>
        </div>

        {/* RIGHT: STATUS + CONTACT INFO */}
        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
          {/* SIGNAL / AVAILABILITY CARD — signature element */}
          <ScrollReveal delay={0.3}>
            <div className="bg-gradient-to-br from-[#0088ff] to-[#003d80] rounded-md sm:rounded-md p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
              <Radio className="absolute -right-8 -bottom-8 size-40 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Channel Open</p>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight">
                  Currently available for new missions.
                </h3>
                <div className="flex items-center gap-2 pt-2 text-xs font-bold opacity-80">
                  <Clock size={14} /> Usual reply time: within 24 hours
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CONTACT INFO CARD */}
          <ScrollReveal delay={0.45}>
            <div className="flex-1 bg-white/5 backdrop-blur-md border border-[#00b4ff]/10 rounded-md sm:rounded-md p-8 sm:p-10 shadow-xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00b4ff] mb-8">
                Direct Lines
              </h3>
              <div className="space-y-2">
                {contactInfo.map((item, i) => {
                  const Wrapper = item.href ? 'a' : 'div';
                  return (
                    <Wrapper
                      key={i}
                      {...(item.href ? { href: item.href } : {})}
                      className={`flex items-center gap-4 p-4 rounded-md transition-all group ${item.href ? 'hover:bg-[#00b4ff]/10 cursor-pointer' : ''}`}
                    >
                      <div className="w-12 h-12 shrink-0 bg-[#00b4ff]/10 rounded-md flex items-center justify-center text-[#00b4ff] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-sm font-black truncate dark:text-white">{item.val}</p>
                      </div>
                      {item.href && (
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-[#00b4ff] opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </Wrapper>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Chatbot darkMode={darkMode} />
    </motion.div>
  );
};

export default Contact;