import { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, Eye, Heart, Compass, ShieldAlert, Check, Leaf, Shield, HeartPulse, Sparkles } from 'lucide-react';

export default function SustainabilityView() {
  const [pledgeChecked, setPledgeChecked] = useState(false);

  const programs = [
    { title: 'Zero Plastics by 2028', desc: 'Our single-estate lines are packaged strictly in biodegradable sugarcane fiber, recycled glass vials, or infinitely recyclable double-gilded brass tins.', icon: Leaf },
    { title: 'Artisan Woodcraft Chests', desc: 'Our premium wooden gift chests are hand-carved in Moratuwa using only certified upcycled timber harvested from pruned Ceylon tea estates.', icon: Compass },
    { title: 'Carbon Neutral Maritime Transit', desc: 'We offset 100% of carbon shipping emissions by planting wild mango and cinnamon forests in Sri Lanka’s dry zone plains.', icon: Sprout },
    { title: 'Canopy Forest Preservation', desc: 'We reject monoculture strip-farming. Our spices are shade-grown under multi-story forest canopies alongside wild vanilla, cocoa, and banana trees.', icon: Shield }
  ];

  return (
    <div id="sustainability-view-container" className="font-sans bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Banner Card */}
        <div id="sustainability-hero" className="relative h-80 rounded-none overflow-hidden bg-forest flex items-center p-8 md:p-16 border border-gold/20 shadow-xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1200")' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
          <div className="relative space-y-3 z-10 text-white max-w-2xl">
            <span className="text-xs uppercase tracking-luxury text-gold font-bold">Earth steward</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-none">Biodiverse Forestry</h1>
            <p className="text-xs md:text-sm text-ivory/75 font-light leading-relaxed">
              We cultivate spices that heal both the human body and the forest biome. Explore our carbon-neutral packaging, upcycled timber craft, and direct co-op equity goals.
            </p>
          </div>
        </div>

        {/* Narrative columns */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">Regenerative Agriculture</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest">The Rainforest Canopy Standard</h2>
            <div className="w-16 h-[1px] bg-gold" />
            <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">
              Conventional commercial spices are grown in stripped monoculture hillsides where heavy machinery can shave the land. This leads to intensive soil erosion, water depletion, and severe pesticide runoff.
            </p>
            <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light">
              At CEYVANA, we champion the **Kandyan Forest Garden system (Forest Garden Forestry)**. This traditional multi-layered canopy mimics wild rainforest ecosystems. Tall coconut and jackfruit trees provide high shade; cacao, pepper vines, and nutmeg grow in the middle layer; while cardamom and ginger flourish on the nutrient-rich forest floor. No chemical fertilizers are used—only wild leaf compost and natural monsoon rainfall.
            </p>
          </div>

          <div className="rounded-none overflow-hidden aspect-[4/3] border border-gold/15 shadow-xl relative">
            <img src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800" alt="Regenerative canopy forest spice farming" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Visualized programs grid */}
        <section className="space-y-12 bg-white p-8 md:p-12 rounded-none border border-gold/15 shadow-sm">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">Active Protocols</span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-forest">The 4 Sourcing Commitments</h3>
            <div className="w-12 h-[1px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {programs.map((prog, idx) => (
              <div key={idx} className="flex gap-4 items-start p-6 rounded-none bg-ivory border border-gold/15 hover:border-gold/35 transition-colors">
                <div className="p-3 bg-forest text-gold rounded-none shrink-0">
                  <prog.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-forest">{prog.title}</h4>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-light">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE COMMUNITY IMPACT CALCULATOR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-forest text-ivory p-8 md:p-12 rounded-none border border-gold/30 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,164,75,0.1),transparent)] pointer-events-none" />
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Your Circle Impact</span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold">Trace Your Sourcing Value</h3>
            <div className="w-16 h-[1px] bg-gold" />
            <p className="text-xs md:text-sm text-ivory/80 leading-relaxed font-light">
              We pledge <strong>5% of gross export revenue</strong> directly to the Wellesley-Gunawardene Rural Development Trust. This independent co-op foundation builds solar-powered water purification wells, distributes compost milling machinery, and funds English and agronomy schooling for farmer daughters.
            </p>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-none text-center shrink-0 min-w-[120px]">
                <span className="block font-serif font-bold text-gold text-2xl">4.8★</span>
                <span className="text-[8px] uppercase tracking-luxury text-ivory/50">Grower Satisfaction</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-none text-center shrink-0 min-w-[120px]">
                <span className="block font-serif font-bold text-gold text-2xl">30,000+</span>
                <span className="text-[8px] uppercase tracking-luxury text-ivory/50">Trees Planted Since 21</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-charcoal p-6 rounded-none border border-gold/25 space-y-4">
            <h4 className="font-serif font-bold text-lg text-forest flex items-center gap-1.5">
              <Sparkles className="text-gold" size={18} />
              <span>Sourcing Quality Oath</span>
            </h4>
            <p className="text-[11px] text-charcoal/60 leading-relaxed font-light">
              By checking the box below, you verify your support for organic, shade-grown agriculture. We promise to protect your spices and lock in their alpine volatile chemical profiles.
            </p>
            
            {pledgeChecked ? (
              <div className="p-4 bg-forest/5 text-forest border border-gold/30 text-xs rounded-none text-center font-bold animate-fade-in">
                Thank you for supporting sustainable rainforest farms.
              </div>
            ) : (
              <button
                onClick={() => setPledgeChecked(true)}
                className="w-full py-3 bg-forest hover:bg-gold text-white hover:text-forest text-xs uppercase tracking-luxury font-bold rounded-none transition-colors border border-forest hover:border-gold shadow-md cursor-pointer"
              >
                Sign the Sourcing Pledge
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
