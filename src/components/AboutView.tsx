import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ShieldCheck, Heart, Award, Sparkles, Sprout, ArrowRight } from 'lucide-react';

export default function AboutView() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const timelineEvents = [
    { year: '1892', title: 'The Ancestral Garden', desc: 'The Wellesley-Gunawardene family establishes a private spice forest in the highland hills of Matale, cultivating wild cinnamon and black pepper for localized culinary medicine.' },
    { year: '1974', title: 'Organic Co-Op Formation', desc: 'Sovereign community farmers band together to ban modern synthetic agro-chemicals, restoring ancient compost techniques and preserving tropical rainforest soil biomes.' },
    { year: '2015', title: 'Birth of CEYVANA', desc: 'CEYVANA is formally incorporated as an international luxury brand with a mission to bring single-origin, lab-certified Ceylon spices directly to Michelin-starred kitchens globally.' },
    { year: '2021', title: 'USDA Organic & ISO Certification', desc: 'Our estate processing facilities secure official USDA Organic, HACCP, and ISO 22000 gold seals, certifying complete food safety and chemical purity.' },
    { year: '2026', title: 'The Global Circle', desc: 'CEYVANA expands distribution routes to 50+ countries, maintaining 100% direct-sourcing tracking from farmer to final hermetic packaging.' }
  ];

  const corePillars = [
    { title: 'Sovereign Heritage', desc: 'We preserve original non-hybridized botanical species, protecting ancient Sri Lankan agricultural genetics from industrialized modern degradation.', icon: Compass },
    { title: 'Farmer Equity', desc: 'We operate under Direct-Trade terms, paying 40% above fair-trade market minimums to ensure our artisan growers and harvesters thrive.', icon: Heart },
    { title: 'Chemical Purity', desc: 'Every harvest batch undergoes clinical gas-chromatography mass-spectrometry (GC-MS) testing to verify zero heavy metals or synthetic pesticide residues.', icon: ShieldCheck },
    { title: 'Canopy Forestry', desc: 'Our spices are not grown in denuded monoculture plains, but inside complex biodiverse rainforest canopies that act as active carbon sinks.', icon: Sprout }
  ];

  const partners = [
    { name: 'Kiri Banda & Family', region: 'Knuckles Range, Sri Lanka', crop: 'Alba Grade Cinnamon', quote: 'Growing with Ceyvana allows us to protect our forest garden and send our grandchildren to university in Colombo.', image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=300' },
    { name: 'Amara Senanayake', region: 'Ella Highlands, Sri Lanka', crop: 'Ella Turmeric & Ginger', quote: 'Traditional crop rotation keeps our soil rich. Ceyvana honors our heritage by paying us true values for our craft.', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300' }
  ];

  return (
    <div id="about-view-container" className="font-sans bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Cinematic Header */}
        <div id="about-hero" className="relative h-80 rounded-none overflow-hidden bg-forest flex items-center p-8 md:p-16 border border-gold/20 shadow-xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=1200")' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
          <div className="relative space-y-3 z-10 text-white max-w-2xl">
            <span className="text-xs uppercase tracking-luxury text-gold font-bold">Ancient Roots</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-none">The Sovereign Heritage</h1>
            <p className="text-xs md:text-sm text-ivory/75 font-light leading-relaxed">
              We do not build generic food commodities. We steward legacy botanical arts, supporting multi-generational families cultivating the absolute peak of aromatic spice crops.
            </p>
          </div>
        </div>

        {/* Narrative Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">The Saga of Serendib</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">A Land of Mist & Mountains</h2>
            <div className="w-16 h-[1px] bg-gold" />
            <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">
              Centuries ago, ancient maritime routes crossed oceans solely to obtain Ceylon Cinnamon—the "sweet, fine bark" of Sri Lanka. The island's geography, framed by Indian Ocean monsoons and high volcanic plateaus, fosters an environment found nowhere else on earth. 
            </p>
            <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">
              Unlike cassia—the cheap commercial alternative packed with toxic coumarin compound—genuine Ceylon Cinnamon is hand-peeled into extremely thin parchment-like scrolls. It reveals a highly sophisticated aromatic bouquet of vanilla, mint, and citrus honey. CEYVANA was founded to preserve this delicate art, refusing industrialized cutting corners.
            </p>
          </div>

          <div className="lg:col-span-6 rounded-none overflow-hidden aspect-[4/3] relative border border-gold/15 shadow-xl">
            <img src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800" alt="Ceylon mountains and spice forests" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-forest/10 hover:bg-forest/0 transition-colors duration-500" />
          </div>
        </section>

        {/* INTERACTIVE TIMELINE */}
        <section id="interactive-timeline" className="bg-forest text-ivory py-20 px-8 rounded-none border border-gold/30 shadow-2xl space-y-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(199,164,75,0.1),transparent)] pointer-events-none" />
          
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">Evolution</span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold">The Chronicles of Sourcing</h3>
            <div className="w-12 h-[1px] bg-gold mx-auto" />
          </div>

          {/* Timeline Selector bar */}
          <div className="flex flex-wrap justify-center gap-4 border-b border-white/10 pb-6">
            {timelineEvents.map((evt, idx) => (
              <button
                key={evt.year}
                onClick={() => setActiveTimeline(idx)}
                className={`px-4 py-2 rounded-none text-xs uppercase tracking-luxury font-mono border transition-all ${activeTimeline === idx ? 'bg-gold border-gold text-forest font-bold' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              >
                {evt.year}
              </button>
            ))}
          </div>

          {/* Active timeline view */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTimeline}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto text-center space-y-4"
            >
              <h4 className="font-serif font-bold text-2xl text-gold">{timelineEvents[activeTimeline].title}</h4>
              <p className="text-xs md:text-sm text-ivory/80 leading-relaxed font-light max-w-2xl mx-auto">
                {timelineEvents[activeTimeline].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* CORE VALUES BENTO */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">Commitments</span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-forest">Sovereign Sourcing Pillars</h3>
            <div className="w-12 h-[1px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {corePillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-none border border-gold/15 shadow-sm hover:shadow-lg transition-all space-y-4 text-center"
              >
                <div className="w-12 h-12 rounded-none bg-gold/10 text-gold flex items-center justify-center mx-auto">
                  <p.icon size={22} />
                </div>
                <h4 className="font-serif font-bold text-base text-forest">{p.title}</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FARMER SPOTLIGHT SECTION */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">The Families</span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-forest">Farming Families Spotlight</h3>
            <div className="w-12 h-[1px] bg-gold mx-auto" />
            <p className="text-xs text-charcoal/50 max-w-md mx-auto">
              Meet the artisan growers who hand-tend the soil, gather the pods, and cure the quills of CEYVANA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {partners.map((p, idx) => (
              <div key={idx} className="bg-white rounded-none overflow-hidden border border-gold/15 shadow-md flex flex-col md:flex-row">
                <img src={p.image} alt={p.name} className="w-full md:w-44 h-48 object-cover object-center" />
                <div className="p-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-luxury text-gold font-bold">{p.region}</span>
                    <h4 className="font-serif font-bold text-base text-forest mt-0.5">{p.name}</h4>
                    <span className="inline-block bg-forest/5 text-forest font-bold text-[9px] uppercase px-2 py-0.5 rounded-none mt-1">{p.crop} Specialist</span>
                  </div>
                  <p className="text-xs text-charcoal/70 italic font-light leading-relaxed mt-2">
                    "{p.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
