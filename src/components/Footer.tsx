import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const certifications = [
    { name: 'USDA Organic', desc: '100% Certified Organic cultivation.' },
    { name: 'GMP Certified', desc: 'Good Manufacturing Practices compliant.' },
    { name: 'HACCP Approved', desc: 'Systematic hazard & food safety controls.' },
    { name: 'ISO 22000', desc: 'Global food safety management standards.' },
    { name: 'FDA Registered', desc: 'Registered with USA Food & Drug Admin.' },
    { name: 'Sovereign Export Quality', desc: 'Sri Lankan Department of Agriculture seal.' }
  ];

  return (
    <footer id="main-footer" className="bg-forest text-ivory/80 pt-20 pb-12 border-t border-gold/20 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
        
        {/* Brand Column */}
        <div id="footer-brand-col" className="space-y-6">
          <div className="flex flex-col">
            <span className="text-3xl font-serif tracking-[0.2em] font-bold text-ivory">CEYVANA</span>
            <span className="text-[9px] tracking-[0.4em] uppercase font-light text-gold/80 -mt-0.5">THE ESSENCE OF PURE CEYLON</span>
          </div>
          <p className="text-xs leading-relaxed text-ivory/70">
            Exporting the world's finest, authentically sourced, and hand-harvested spices directly from the lush rainforests and highlands of Sri Lanka to discerning kitchens worldwide.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-none border border-white/10 hover:border-gold hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-none border border-white/10 hover:border-gold hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="https://wa.me/94770000000" target="_blank" rel="noopener noreferrer" className="p-2 rounded-none border border-white/10 hover:border-gold hover:text-gold transition-colors flex items-center gap-1.5" aria-label="WhatsApp Support">
              <Phone size={14} />
              <span className="text-[10px] tracking-wider uppercase">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div id="footer-links-col" className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gold">Navigations</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setCurrentTab('shop'); window.scrollTo(0,0); }} className="hover:text-gold transition-colors">Boutique Collection</button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('sommelier'); window.scrollTo(0,0); }} className="hover:text-gold transition-colors flex items-center gap-1">AI Spice Sommelier <span className="text-[9px] text-gold font-serif italic">(New)</span></button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('recipes'); window.scrollTo(0,0); }} className="hover:text-gold transition-colors">Gourmet Recipes</button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('about'); window.scrollTo(0,0); }} className="hover:text-gold transition-colors">Our Sourcing & Heritage</button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('sustainability'); window.scrollTo(0,0); }} className="hover:text-gold transition-colors">Sustainability Commitments</button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('blog'); window.scrollTo(0,0); }} className="hover:text-gold transition-colors">Botanical Blog</button>
            </li>
          </ul>
        </div>

        {/* Global Sourcing Info */}
        <div id="footer-contact-col" className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gold">Corporate Offices</h4>
          <ul className="space-y-3 text-xs text-ivory/70">
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
              <span>
                <strong>Colombo Flagship HQ:</strong><br />
                75 Galle Face Centre Road, Colombo 00300, Sri Lanka
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
              <span>
                <strong>Matale Sourcing Station:</strong><br />
                Spice Gardens Highway, Matale, Sri Lanka
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={14} className="text-gold" />
              <span>+94 (11) 790-2300</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} className="text-gold" />
              <span>concierge@ceyvana.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div id="footer-newsletter-col" className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gold">Join the Ceyvana Circle</h4>
          <p className="text-xs leading-relaxed text-ivory/70">
            Subscribe to receive direct botanical dispatches, rare harvest announcements, and original gourmet recipes.
          </p>
          {subscribed ? (
            <div className="p-3 bg-white/5 rounded-none border border-gold/40 text-xs text-gold">
              Welcome to the Circle. Enjoy 10% off your first collection order. Use code: <strong className="font-mono">CEYVANACIRCLE</strong>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-white/20 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-white/40"
              />
              <button type="submit" className="text-gold hover:text-white transition-colors p-1" aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </form>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-ivory/50">
            <Globe size={10} className="text-gold animate-spin" />
            <span>Shipping World-Class Spices to 50+ Countries</span>
          </div>
        </div>

      </div>

      {/* Certification Badges */}
      <div id="footer-certifications" className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 border-b border-white/10 text-center">
        {certifications.map((cert, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-3 rounded-none bg-white/5 border border-white/5 hover:border-gold/30 transition-all duration-300">
            <ShieldCheck size={20} className="text-gold mb-1.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-ivory">{cert.name}</span>
            <span className="text-[8px] text-ivory/40 mt-0.5">{cert.desc}</span>
          </div>
        ))}
      </div>

      {/* Legal & Payments */}
      <div id="footer-legal-bar" className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory/50">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>© {new Date().getFullYear()} CEYVANA (Private) Limited. All Rights Reserved. Crafted for fine kitchens.</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-1.5 text-[10px]">
            <a href="#privacy" className="hover:text-gold transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-gold transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#exports" className="hover:text-gold transition-colors">Export Licensing</a>
          </div>
        </div>

        {/* Payment Network Symbols */}
        <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-none border border-white/5">
          <span className="text-[9px] uppercase tracking-widest text-gold/60 mr-1.5">Secure Checkout</span>
          <span className="font-bold text-white/40 font-mono text-[10px] tracking-tighter">STRIPE</span>
          <span className="font-bold text-white/40 font-sans text-[10px] italic">PayPal</span>
          <span className="font-bold text-white/40 font-sans text-[10px] tracking-tight"> Pay</span>
          <span className="font-bold text-white/40 font-sans text-[10px]">Google Pay</span>
        </div>
      </div>
    </footer>
  );
}
