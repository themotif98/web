import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: string) => void;
}

export default function Hero({ setCurrentTab }: HeroProps) {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen lg:h-screen w-full flex flex-col lg:flex-row pt-20 overflow-hidden bg-ivory text-charcoal"
    >
      {/* Left Column: 60% Geometric Forest Cover */}
      <div className="w-full lg:w-[60%] bg-forest relative flex items-center justify-center p-8 min-h-[450px] lg:h-full overflow-hidden">
        {/* Radial dark glow */}
        <div className="absolute inset-0 bg-radial-gradient from-forest/30 to-black/40 pointer-events-none" />

        {/* Origin Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-8 border border-gold/30 bg-forest/40 p-3 text-[10px] text-gold uppercase tracking-luxury font-semibold backdrop-blur-sm z-10"
        >
          Origin: Central Highlands, Sri Lanka
        </motion.div>

        {/* Elegant Centered Framed Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-[480px] aspect-square bg-[#1a4530] flex items-center justify-center overflow-hidden shadow-2xl relative group border border-gold/10"
        >
          {/* Unsplash luxury spice image background with blend mode */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] group-hover:scale-110"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=1200")',
              mixBlendMode: 'luminosity',
              opacity: 0.4
            }}
          />

          {/* Luxury gold double frame line */}
          <div className="absolute inset-4 border border-gold/25 pointer-events-none" />
          <div className="absolute inset-6 border border-gold/10 pointer-events-none" />

          {/* Giant, elegant background typography */}
          <div className="absolute inset-0 flex items-center justify-center text-ivory/[0.04] text-[100px] md:text-[140px] font-serif italic select-none pointer-events-none">
            Ceylon
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-forest/30" />

          {/* Core overlay micro details */}
          <div className="absolute bottom-8 left-8 right-8 text-center">
            <span className="text-[10px] text-gold tracking-luxury uppercase font-medium">Estate Sourced</span>
            <h4 className="text-xl text-ivory font-serif mt-1 font-bold">The Royal Harvest</h4>
          </div>
        </motion.div>

        {/* Sustainable & Premium Sourcing Footer Details */}
        <div className="absolute bottom-8 left-8 flex items-center gap-4 text-gold/60 text-[9px] uppercase tracking-luxury">
          <span>Premium Sourcing</span>
          <div className="w-12 h-[1px] bg-gold/40"></div>
          <span>Sustainable Harvest</span>
        </div>
      </div>

      {/* Right Column: 40% Editorial Balancing Canvas */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 lg:py-0 bg-ivory text-charcoal h-full relative z-10 border-t lg:border-t-0 lg:border-l border-gold/20">
        <div className="max-w-md mx-auto lg:mx-0">
          {/* Establish Label */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 text-gold font-bold uppercase text-[11px] tracking-luxury flex items-center gap-2"
          >
            <span>Est. 1924</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[10px] font-medium text-charcoal/60 lowercase tracking-normal">Direct To Discerning Kitchens</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-forest leading-[1.1] mb-6 font-bold"
          >
            The Essence of <br />
            <span className="font-serif italic font-normal text-gold">Pure Ceylon</span>
          </motion.h1>

          {/* Tagline Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs md:text-sm text-charcoal/70 leading-relaxed mb-10 max-w-sm font-light"
          >
            Authentically sourced from the lush, volcanic landscapes of Sri Lanka and crafted for discerning kitchens around the world. Experience world-class aromatics, hand-harvested by multi-generational farmers.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col gap-4"
          >
            <button
              id="hero-cta-shop-luxury"
              onClick={() => {
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-forest text-ivory px-8 py-4 text-xs uppercase tracking-luxury hover:bg-[#1a4530] transition-colors duration-300 flex items-center justify-between group font-semibold shadow-md cursor-pointer"
            >
              <span>Shop Collection</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            
            <button
              id="hero-cta-story-luxury"
              onClick={() => {
                setCurrentTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border border-forest text-forest px-8 py-4 text-xs uppercase tracking-luxury hover:bg-forest hover:text-ivory transition-all duration-300 font-semibold cursor-pointer"
            >
              View Our Story
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
