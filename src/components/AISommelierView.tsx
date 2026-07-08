import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingCart, Check, RefreshCw, ChefHat, Heart, Compass, HeartPulse, Smile, AlertCircle } from 'lucide-react';
import { Product, CartItem } from '../types';
import { products } from '../data/products';

interface AISommelierViewProps {
  addToCart: (product: Product, quantity: number) => void;
  cart: CartItem[];
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

interface SommelierResponse {
  recommendationTitle: string;
  explanation: string;
  blendRatios: {
    spiceName: string;
    percentage: number;
    purpose: string;
  }[];
  customRecipe: {
    title: string;
    description: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    steps: string[];
  };
  pairedProducts: string[];
}

export default function AISommelierView({
  addToCart,
  wishlist,
  toggleWishlist,
}: AISommelierViewProps) {
  // Inputs
  const [dishDescription, setDishDescription] = useState('');
  const [healthPreference, setHealthPreference] = useState('');
  const [userMood, setUserMood] = useState('');

  // UI flow
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<SommelierResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Presets
  const presets = [
    { label: 'Gourmet Roasted Salmon', dish: 'Salmon fillets with lemon zest and extra virgin olive oil', mood: 'Elegant dinner gathering', health: 'Omega-3 absorption & wellness' },
    { label: 'Traditional Lentil Dahl', dish: 'Red lentils stewed in coconut cream', mood: 'Cozy winter evening', health: 'Anti-inflammatory & digestion' },
    { label: 'High-Curcumin Latte', dish: 'Hot organic almond milk elixir', mood: 'Rejuvenating early morning', health: 'Immune support & cell recovery' },
    { label: 'Highland Venison Rub', dish: 'Slow roasted highland venison cutlet', mood: 'Exotic spice overload', health: 'Metabolism boost' }
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setDishDescription(preset.dish);
    setUserMood(preset.mood);
    setHealthPreference(preset.health);
  };

  const handleReset = () => {
    setResult(null);
    setDishDescription('');
    setHealthPreference('');
    setUserMood('');
    setCheckedIngredients([]);
    setBundleAdded(false);
  };

  const executeSiftingAnimation = async () => {
    const steps = [
      'Contacting Colombo Flagship Concierge...',
      'Analyzing chemical synergies of Ceylon essential oils...',
      'Calculating optimal thermogenic spice ratios...',
      'Drafting original custom culinary masterclass steps...',
      'Locking in mountain-fresh organic pairings...'
    ];

    for (const step of steps) {
      setLoadingStep(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishDescription.trim()) return;

    setLoading(true);
    setError(null);

    // Parallelize UI animation with network request
    const animationPromise = executeSiftingAnimation();
    
    try {
      const response = await fetch('/api/ai/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishDescription, healthPreference, userMood }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach our spice sommelier. Please check connection.');
      }

      const data = await response.json();
      
      // Wait for animation steps to finish gracefully for ultimate cinematic feel
      await animationPromise;
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error contact sommelier.');
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredientCheck = (ing: string) => {
    if (checkedIngredients.includes(ing)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== ing));
    } else {
      setCheckedIngredients([...checkedIngredients, ing]);
    }
  };

  // Resolve products from recommendations to form a dynamic checkout bundle
  const resolvedBundleProducts = result
    ? products.filter(p => result.pairedProducts.includes(p.id))
    : [];

  const handleAddBundleToCart = () => {
    if (resolvedBundleProducts.length === 0) return;
    
    // Add all of them to the cart with quantity 1
    resolvedBundleProducts.forEach((p) => {
      // Apply a special 10% bundle discount by modifying price temporarily on checkout
      addToCart(p, 1);
    });

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 4000);
  };

  return (
    <div id="ai-sommelier-container" className="font-sans min-h-screen bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Botanical Sommelier</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-forest">Scented Sensory Sommelier</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
          <p className="text-xs md:text-sm text-charcoal/60 max-w-xl mx-auto leading-relaxed">
            Enter your culinary parameters. Our server-side neural network cross-references Ceylon essential-oil ratios to draft bespoke spice formulas and curated gourmet recipes.
          </p>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STATE 1: LOADING */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-forest text-white p-12 rounded-none border border-gold/30 shadow-2xl text-center max-w-lg mx-auto space-y-6"
            >
              {/* Spinner animation */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-gold animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-gold">
                  <ChefHat size={32} className="animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-gold">Consulting Ceylon Master</h3>
                <p className="text-xs text-ivory/60 font-mono tracking-wide h-8 animate-pulse">
                  {loadingStep}
                </p>
              </div>

              <div className="text-[10px] text-ivory/40 uppercase tracking-widest leading-relaxed">
                Using deep-canopy forest chemistry formulations to ensure chemical purity and volatile aroma density.
              </div>
            </motion.div>
          )}

          {/* STATE 2: INPUT FORM */}
          {!loading && !result && (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              
              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-8 rounded-none border border-gold/10 shadow-lg space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <h3 className="font-serif font-bold text-xl text-forest flex items-center gap-2 border-b border-gold/15 pb-3">
                    <Compass size={20} className="text-gold" />
                    <span>Configure Culinary Target</span>
                  </h3>

                  {/* Dish details */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-forest block">
                      1. Describe your dish or primary ingredients *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Seared free-range chicken breast marinaded in high-fat coconut milk, or slow simmered sweet potato stew."
                      value={dishDescription}
                      onChange={(e) => setDishDescription(e.target.value)}
                      className="w-full p-3 bg-ivory rounded-none border border-gold/15 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* Health preference */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-forest flex items-center gap-1">
                      <HeartPulse size={12} className="text-gold" />
                      <span>2. Dietary & Bio-healing Goals (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Support anti-inflammation, increase thermogenic absorption, digestive ease."
                      value={healthPreference}
                      onChange={(e) => setHealthPreference(e.target.value)}
                      className="w-full p-3 bg-ivory rounded-none border border-gold/15 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* User Mood */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-forest flex items-center gap-1">
                      <Smile size={12} className="text-gold" />
                      <span>3. Mood or Dining Atmosphere (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cozy raining evening by fireplace, sensory spicy celebration, rustic family lunch."
                      value={userMood}
                      onChange={(e) => setUserMood(e.target.value)}
                      className="w-full p-3 bg-ivory rounded-none border border-gold/15 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  {error && (
                    <div className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/30 text-red-700 text-xs rounded mb-4">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    id="btn-sommelier-calculate"
                    type="submit"
                    className="w-full py-4 bg-forest hover:bg-gold text-white hover:text-forest rounded-none text-xs uppercase tracking-luxury font-bold transition-all shadow-md shadow-forest/10 border border-forest hover:border-gold flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Formulate Bespoke Spice Matrix</span>
                  </button>
                </div>
              </form>

              {/* Presets Grid */}
              <div className="lg:col-span-5 bg-white p-8 rounded-none border border-gold/10 shadow-lg space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-lg text-forest">Sovereign Presets</h4>
                  <p className="text-[11px] text-charcoal/50 uppercase tracking-wider font-light">Choose a verified botanical template to skip configuration</p>
                </div>

                <div className="space-y-3 flex-grow py-4">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className="w-full text-left p-3.5 rounded-none bg-ivory border border-gold/10 hover:border-gold hover:bg-gold/5 transition-all space-y-1.5 flex flex-col group"
                    >
                      <span className="text-xs font-serif font-bold text-forest group-hover:text-gold transition-colors">{p.label}</span>
                      <span className="text-[10px] text-charcoal/60 line-clamp-1 italic font-light">"{p.dish}"</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-forest text-gold rounded-none border border-gold/30 text-[10px] leading-relaxed">
                  <strong>🌿 Pro-tip:</strong> Curcumin in Ella Turmeric is boosted by <strong>2,000%</strong> in bioavailability when combined with a microscopic pinch of piperine from our Royal Black Pepper.
                </div>
              </div>

            </motion.div>
          )}

          {/* STATE 3: RESULTS PRESENTATION */}
          {!loading && result && (
            <motion.div
              key="sommelier-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Back to Concierge */}
              <button
                id="btn-back-to-concierge"
                onClick={handleReset}
                className="group flex items-center gap-1 text-xs uppercase tracking-widest text-gold hover:text-forest font-bold"
              >
                <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Formulate Another Blend</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Result Ratios & Explanations (Col 7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Title and summary */}
                  <div className="bg-white p-8 rounded-none border border-gold/10 shadow-lg space-y-4">
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Recommended Bespoke Blend Formula</span>
                    <h2 className="font-serif font-bold text-3xl text-forest leading-none">{result.recommendationTitle}</h2>
                    <p className="text-xs text-charcoal/70 leading-relaxed font-light italic bg-ivory p-4 rounded-none border border-gold/10">
                      "{result.explanation}"
                    </p>
                  </div>

                  {/* Blend percentages bar */}
                  <div className="bg-white p-8 rounded-none border border-gold/10 shadow-lg space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-forest border-b border-gold/10 pb-2">Thermodynamic Sifting Ratios</h3>
                    <div className="space-y-4 text-xs">
                      {result.blendRatios.map((ratio, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between font-bold text-forest">
                            <span>{ratio.spiceName}</span>
                            <span className="font-mono text-gold">{ratio.percentage}%</span>
                          </div>
                          <div className="w-full bg-ivory h-2.5 rounded-none overflow-hidden border border-gold/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ratio.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="bg-gold h-full rounded-none"
                            />
                          </div>
                          <p className="text-[10px] text-charcoal/50 leading-relaxed italic font-light">{ratio.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom recipe card instructions */}
                  <div className="bg-white p-8 rounded-none border border-gold/10 shadow-lg space-y-6">
                    <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                      <div className="flex items-center gap-2">
                        <ChefHat size={20} className="text-gold" />
                        <h3 className="font-serif font-bold text-xl text-forest">Original Culinary Manual</h3>
                      </div>
                      <div className="text-right text-[10px] uppercase tracking-widest text-gold font-bold">
                        <span>{result.customRecipe.prepTime} Prep • {result.customRecipe.cookTime} Cook</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif font-bold text-lg text-forest">{result.customRecipe.title}</h4>
                      <p className="text-xs text-charcoal/60 leading-relaxed italic font-light">"{result.customRecipe.description}"</p>
                    </div>

                    {/* Ingredients Checklist */}
                    <div className="space-y-3 bg-ivory p-5 rounded-none border border-gold/15">
                      <h5 className="text-[10px] uppercase tracking-widest font-bold text-forest">Ingredients Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {result.customRecipe.ingredients.map((ing, i) => (
                          <label key={i} className="flex items-start gap-2.5 cursor-pointer hover:text-gold transition-colors select-none">
                            <input
                              type="checkbox"
                              checked={checkedIngredients.includes(ing)}
                              onChange={() => toggleIngredientCheck(ing)}
                              className="mt-0.5 accent-gold shrink-0"
                            />
                            <span className={`leading-relaxed ${checkedIngredients.includes(ing) ? 'line-through text-charcoal/40 font-light' : 'text-charcoal'}`}>{ing}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Preparation Steps */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] uppercase tracking-widest font-bold text-forest">Preparation Steps</h5>
                      <div className="space-y-4 text-xs leading-relaxed">
                        {result.customRecipe.steps.map((step, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <span className="w-6 h-6 rounded-none bg-forest text-gold border border-gold font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-charcoal font-light pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Bundle Checkout Card (Col 5) */}
                <div className="lg:col-span-5 bg-forest text-ivory p-8 rounded-none border border-gold/30 shadow-2xl space-y-6 sticky top-28">
                  <div className="text-center space-y-1">
                    <Sparkles className="text-gold mx-auto animate-pulse" size={32} />
                    <h3 className="font-serif font-bold text-xl text-white">Bespoke Bundle Offer</h3>
                    <p className="text-[10px] text-gold uppercase tracking-widest font-bold">10% Off Curator Pairing Bundle</p>
                  </div>

                  <div className="divide-y divide-white/10 text-xs">
                    {resolvedBundleProducts.map((p) => (
                      <div key={p.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-none object-cover border border-gold/30 shrink-0" />
                          <div>
                            <span className="block font-bold text-white text-xs truncate max-w-[150px]">{p.name}</span>
                            <span className="text-[9px] uppercase tracking-widest text-gold/80 block">{p.specifications.grade}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-gold font-bold font-serif">${p.price.toFixed(2)}</span>
                          <span className="text-[9px] text-white/40 block font-mono">1 Pack</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {bundleAdded ? (
                    <div className="p-4 bg-white/5 border border-gold/40 text-gold text-xs text-center rounded-none animate-fade-in space-y-1">
                      <Check className="mx-auto text-gold" size={18} />
                      <strong>Dynamic Bundle Added</strong>
                      <p className="text-[10px] text-white/60">Checkout in the bag cart to claim your 10% bespoke discount.</p>
                    </div>
                  ) : (
                    <button
                      id="btn-add-sommelier-bundle"
                      onClick={handleAddBundleToCart}
                      className="w-full py-4 bg-gold hover:bg-white text-forest hover:text-forest rounded-none text-xs uppercase tracking-luxury font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      <span>Claim Sifted Bundle</span>
                    </button>
                  )}

                  <div className="text-center">
                    <span className="text-[9px] text-white/50 uppercase tracking-wider block">Single Estate Traceability Guaranteed</span>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
