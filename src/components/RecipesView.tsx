import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Clock, Compass, Search, Star, Check, Play, Pause, RotateCcw, Volume2, ShoppingCart, Info } from 'lucide-react';
import { Recipe, Product } from '../types';
import { recipes } from '../data/recipes';
import { products } from '../data/products';

interface RecipesViewProps {
  addToCart: (product: Product, quantity: number) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
}

export default function RecipesView({
  addToCart,
  setCurrentTab,
  setSelectedProduct,
}: RecipesViewProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  // TIMER STATE
  const [timerDuration, setTimerDuration] = useState(180); // Default 3 mins (180 secs)
  const [timerLeft, setTimerLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [timerCustomVal, setTimerCustomVal] = useState('3'); // text minutes input

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft((t) => t - 1);
      }, 1000);
    } else if (timerLeft === 0 && timerActive) {
      setTimerActive(false);
      // Native audio synthesize trigger to ring a gentle bell
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // high pure bell note
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.5);
      } catch (err) {
        console.warn("Audio Context blocked or unsupported:", err);
      }
      alert("⏲ Gourmet Timer Finished! Please attend to your Ceylon spice infusion.");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerLeft]);

  const handleCustomTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Number(timerCustomVal);
    if (mins > 0) {
      const secs = mins * 60;
      setTimerDuration(secs);
      setTimerLeft(secs);
      setTimerActive(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const categories = ['all', 'main-course', 'dessert', 'beverage'];

  const filteredRecipes = recipes.filter((rec) => {
    const matchesCat = activeCategory === 'all' || rec.tags.includes(activeCategory);
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpicePairingClick = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (p) {
      setSelectedProduct(p);
      setCurrentTab('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickAddSpice = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const p = products.find(prod => prod.id === productId);
    if (p) {
      addToCart(p, 1);
    }
  };

  const toggleIngredientCheck = (ing: string) => {
    if (checkedIngredients.includes(ing)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== ing));
    } else {
      setCheckedIngredients([...checkedIngredients, ing]);
    }
  };

  return (
    <div id="recipes-view-container" className="font-sans bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold flex items-center justify-center gap-1.5">
            <ChefHat size={14} />
            <span>Botanical Cuisine</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-forest">Curated Gourmet Cookbook</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
          <p className="text-xs md:text-sm text-charcoal/60 max-w-xl mx-auto leading-relaxed">
            Authentic, chef-crafted recipes designed specifically to highlight the organic, high-essential oil potency of CEYVANA single estate spices.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedRecipe ? (
            // LIST STATE
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-none border border-gold/15 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-none text-xs uppercase tracking-luxury font-semibold transition-colors ${activeCategory === cat ? 'bg-forest text-gold' : 'hover:bg-ivory text-charcoal'}`}
                    >
                      {cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="text"
                    placeholder="Search cookbook..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-ivory rounded-none text-xs focus:outline-none focus:ring-1 focus:ring-gold border border-gold/10"
                  />
                </div>
              </div>

              {/* Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecipe(rec);
                      setCheckedIngredients([]);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="group bg-white rounded-none overflow-hidden border border-gold/15 shadow-md hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={rec.image} alt={rec.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent opacity-60" />
                      <span className="absolute bottom-4 left-4 bg-forest text-gold text-[8px] font-bold uppercase tracking-luxury px-2.5 py-1 rounded-none border border-gold/20 shadow-md">
                        {rec.prepTime} Prep
                      </span>
                    </div>

                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gold uppercase tracking-luxury font-semibold">
                          <span>{rec.difficulty} Difficulty</span>
                          <span>•</span>
                          <span>{rec.servings || '4'} Servings</span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-forest mt-1.5 group-hover:text-gold transition-colors line-clamp-1">{rec.name}</h3>
                        <p className="text-xs text-charcoal/60 leading-relaxed font-light line-clamp-3 mt-1">{rec.description}</p>
                      </div>

                      <span className="text-[10px] text-gold uppercase tracking-luxury font-bold self-start group-hover:underline">View Formulation Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            // DETAIL STATE
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Back CTA */}
              <button
                id="btn-close-recipe"
                onClick={() => setSelectedRecipe(null)}
                className="group flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:text-forest font-bold"
              >
                <span>← Back to cookbook grid</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Culinary Guide (Col 7) */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Banner */}
                  <div className="aspect-[16/9] rounded-none overflow-hidden shadow-md border border-gold/15 relative">
                    <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h2 className="font-serif font-bold text-3xl text-forest">{selectedRecipe.name}</h2>
                    <div className="flex gap-4 text-xs text-charcoal/50 uppercase tracking-luxury font-semibold border-b border-gold/15 pb-4">
                      <span>Difficulty: {selectedRecipe.difficulty}</span>
                      <span>•</span>
                      <span>Time: {selectedRecipe.prepTime}</span>
                      <span>•</span>
                      <span>Yield: {selectedRecipe.servings || '4'}</span>
                    </div>
                    <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-light italic">
                      "{selectedRecipe.description}"
                    </p>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="bg-white p-6 rounded-none border border-gold/15 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-lg text-forest border-b border-gold/10 pb-2">Artisan Ingredients Checklist</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <label key={idx} className="flex items-start gap-2.5 cursor-pointer hover:text-gold select-none">
                          <input
                            type="checkbox"
                            checked={checkedIngredients.includes(ing)}
                            onChange={() => toggleIngredientCheck(ing)}
                            className="mt-0.5 accent-gold shrink-0"
                          />
                          <span className={checkedIngredients.includes(ing) ? 'line-through text-charcoal/30 font-light' : 'text-charcoal'}>
                            {ing}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cooking Steps */}
                  <div className="bg-white p-6 rounded-none border border-gold/15 shadow-sm space-y-6">
                    <h3 className="font-serif font-bold text-lg text-forest border-b border-gold/10 pb-2">Preparation Instructions</h3>
                    <div className="space-y-5 text-xs leading-relaxed">
                      {selectedRecipe.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <span className="w-6 h-6 rounded-none bg-forest text-gold border border-gold font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-charcoal font-light pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sticky Companion / Spice Pairing and Timer (Col 5) */}
                <div className="lg:col-span-5 space-y-8 sticky top-28">
                  
                  {/* Spice pairing checkout Card */}
                  <div className="bg-forest text-ivory p-6 rounded-none border border-gold/30 shadow-xl space-y-4">
                    <div className="text-center pb-2 border-b border-white/10">
                      <span className="text-[9px] uppercase tracking-luxury text-gold font-bold">Curator Sourcing Pairing</span>
                      <h4 className="font-serif font-bold text-lg text-white">Required Ceyvana Spices</h4>
                    </div>

                    <div className="space-y-4">
                      {selectedRecipe.pairedProducts.map((pId) => {
                        const matchedProduct = products.find(p => p.id === pId);
                        if (!matchedProduct) return null;
                        return (
                          <div
                            key={pId}
                            onClick={() => handleSpicePairingClick(pId)}
                            className="flex items-center justify-between gap-2 p-2.5 rounded-none bg-white/5 border border-white/5 hover:border-gold/30 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <img src={matchedProduct.images[0]} alt={matchedProduct.name} className="w-9 h-9 object-cover rounded-none" />
                              <div className="text-left">
                                <span className="block font-bold text-white text-xs truncate max-w-[150px]">{matchedProduct.name}</span>
                                <span className="text-[8px] text-gold font-mono uppercase tracking-luxury">{matchedProduct.specifications.grade}</span>
                              </div>
                            </div>

                            <button
                              id={`btn-recipe-add-spice-${matchedProduct.id}`}
                              onClick={(e) => handleQuickAddSpice(matchedProduct.id, e)}
                              className="bg-gold text-forest hover:bg-white px-3 py-1.5 rounded-none text-[9px] uppercase tracking-luxury font-bold flex items-center gap-1 transition-all"
                            >
                              <ShoppingCart size={9} />
                              <span>Add</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* HIGH-CRAFT EMBEDDED TIMER */}
                  <div className="bg-white p-6 rounded-none border border-gold/15 shadow-lg text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-forest">
                      <Clock size={18} className="text-gold animate-pulse" />
                      <h4 className="font-serif font-bold text-base">Culinary Infusion Timer</h4>
                    </div>

                    {/* Clock face */}
                    <div className="font-mono text-3xl font-bold text-forest tracking-wider bg-ivory py-4 rounded-none border border-gold/15">
                      {formatTimer(timerLeft)}
                    </div>

                    {/* Preset minute select */}
                    <div className="flex gap-2 justify-center">
                      {[1, 3, 5, 10].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => {
                            setTimerDuration(mins * 60);
                            setTimerLeft(mins * 60);
                            setTimerActive(false);
                          }}
                          className={`px-3 py-1 rounded-none font-mono text-[10px] border transition-colors ${timerDuration === mins * 60 ? 'bg-forest text-gold border-forest' : 'bg-ivory border-gold/15 text-charcoal hover:bg-gold/5'}`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>

                    {/* Custom minute input */}
                    <form onSubmit={handleCustomTimerSubmit} className="flex gap-2 justify-center items-center">
                      <input
                        type="number"
                        placeholder="Mins"
                        min="1"
                        max="60"
                        value={timerCustomVal}
                        onChange={(e) => setTimerCustomVal(e.target.value)}
                        className="bg-ivory border border-gold/15 rounded-none text-center text-xs w-14 py-1 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-forest hover:bg-gold text-white hover:text-forest text-[10px] uppercase tracking-luxury font-bold px-3 py-1.5 rounded-none transition-all border border-forest hover:border-gold"
                      >
                        Set Mins
                      </button>
                    </form>

                    {/* Play Controls */}
                    <div className="flex items-center justify-center gap-4 border-t border-gold/10 pt-3">
                      <button
                        onClick={() => setTimerActive(!timerActive)}
                        className="p-2.5 rounded-none bg-forest hover:bg-gold text-white hover:text-forest transition-all"
                        aria-label={timerActive ? 'Pause timer' : 'Start timer'}
                      >
                        {timerActive ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button
                        onClick={() => {
                          setTimerLeft(timerDuration);
                          setTimerActive(false);
                        }}
                        className="p-2.5 rounded-none bg-ivory border border-gold/20 text-forest hover:text-gold hover:border-gold transition-all"
                        aria-label="Reset timer"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-charcoal/40">
                      <Volume2 size={10} />
                      <span>Rings pure sine bell at expiry</span>
                    </div>

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
