import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Heart, ShoppingCart, ShieldCheck, Leaf, Compass, Globe, Award, Sparkles, Check, ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import { Product, Category, CartItem } from '../types';
import { categories, products } from '../data/products';
import { recipes } from '../data/recipes';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
}

export default function HomeView({
  setCurrentTab,
  setSelectedProduct,
  addToCart,
  wishlist,
  toggleWishlist,
}: HomeViewProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Best Sellers (first 4 products)
  const bestSellers = products.slice(0, 4);

  const whyChooseUs = [
    { title: '100% Pure Ceylon Origin', desc: 'Grown and packed in Sri Lanka, completely free from blend-dilution or cassia impurities.', icon: Leaf },
    { title: 'Hand Harvested', desc: 'Meticulously selected pod-by-pod or hand-peeled by legacy artisans maintaining historic crafts.', icon: Compass },
    { title: 'Sustainable Farming', desc: 'Cultivated in biodiverse spice forests that preserve rainforest canopies and native soil structures.', icon: ShieldCheck },
    { title: 'Export Sovereign Quality', desc: 'Tested to exceed international premium food standards with high essential oil densities.', icon: Award },
    { title: 'Lab Tested & Traceable', desc: 'Every harvest batch is clinically analyzed for purity, heavy metals, and essential compounds.', icon: ShieldCheck },
    { title: 'Hermetically Packed', desc: 'Sealed immediately at origin in custom glass, ceramics, or golden tins to freeze fresh volatile oils.', icon: Clock },
    { title: 'Worldwide Shipping', desc: 'Secured global express lanes ensuring pristine arrival to kitchens in over 50 countries.', icon: Globe }
  ];

  const processSteps = [
    { name: 'Harvest', desc: 'Hand-picked during optimal celestial cycles at peak ripeness.' },
    { name: 'Sorting', desc: 'Artisans hand-grade every pod, discarding uneven sizes.' },
    { name: 'Quality Inspection', desc: 'Clinical testing to verify moisture and compound densities.' },
    { name: 'Packaging', desc: 'Sealed in UV-protective amber glass or gold tins.' },
    { name: 'Global Delivery', desc: 'Express transport ensuring perfect lock-in of aroma.' }
  ];

  const testimonials = [
    {
      name: 'Chef Jean-Luc Gauthier',
      role: 'Michelin Starred Chef, Paris',
      quote: 'The Alba Grade Cinnamon from Ceyvana is a complete revelation. Its thin, brittle quills reveal a delicate sweet woody complexity that I have never experienced with standard spices. It is indispensable in my kitchen.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Gourmet Pastry Creator, London',
      quote: 'Golden milk prepared with Ceyvana’s Ella Turmeric and Black Pepper has become my daily sanctuary. You can immediately see the rich curcumin quality by its intense, vibrant saffron-orange color.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Master Sommelier Yuki Tanaka',
      role: 'Beverage Director, Tokyo',
      quote: 'We infuse Ceyvana’s Green Cardamom into our signature botanical cocktails. The eucalyptus and mint citrus perfume is exceptionally clean, long-lasting, and highly concentrated.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    }
  ];

  const instagramImages = [
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400'
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some(item => item.id === product.id);
  };

  return (
    <div id="home-view-container" className="font-sans space-y-24 bg-ivory pb-20">
      
      {/* 1. Featured Categories */}
      <section id="categories-section" className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Bespoke Curation</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">Cultivar Collections</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => {
                // We will navigate to shop with filter
                setCurrentTab('shop');
                // Trigger a global custom event or set direct logic in parent
                const event = new CustomEvent('filter-category', { detail: cat.id });
                window.dispatchEvent(event);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="group relative h-72 rounded-none overflow-hidden shadow-md cursor-pointer border border-gold/20"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent group-hover:via-forest/60 transition-all duration-300" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-ivory">
                <h3 className="text-lg font-serif font-semibold tracking-wide text-white group-hover:text-gold transition-colors duration-300">{cat.name}</h3>
                <p className="text-[10px] text-ivory/70 line-clamp-2 mt-1 h-0 opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-500 leading-relaxed">
                  {cat.description}
                </p>
                <span className="text-[10px] text-gold uppercase tracking-wider mt-2 group-hover:underline">Explore Collection →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Brand Story Editorial (Bento style grid) */}
      <section id="editorial-story-section" className="bg-forest py-24 text-ivory relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(199,164,75,0.15),transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Ancient Heritage</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">Authentically Sri Lankan, Cultivated for the World</h2>
            <div className="w-16 h-[1px] bg-gold" />
            <p className="text-sm text-ivory/80 leading-relaxed font-light">
              For thousands of years, the tropical island of Sri Lanka (formerly known as Serendib and Ceylon) has produced the absolute jewel of spices. Its equatorial sun, rich volcanic terrains, and unique humid microclimates foster crops with an unparalleled density of essential botanical oils.
            </p>
            <p className="text-sm text-ivory/80 leading-relaxed font-light">
              CEYVANA was born to revive this majestic legacy. We work directly with smallholder farming communities across Kandy, Matale, and the Knuckles cloud forests. By combining generations-old organic practices with modern laboratory testing, we bring sovereign export-grade quality directly from our canopy forest gardens to your table.
            </p>
            <div className="pt-4 flex items-center gap-6">
              <div>
                <span className="block text-3xl font-serif font-bold text-gold">500+</span>
                <span className="text-[9px] uppercase tracking-widest text-ivory/60">Independent Farmers Supported</span>
              </div>
              <div className="w-[1px] h-10 bg-white/20" />
              <div>
                <span className="block text-3xl font-serif font-bold text-gold">100%</span>
                <span className="text-[9px] uppercase tracking-widest text-ivory/60">Pure Origin Guaranteed</span>
              </div>
            </div>
            <button
              id="story-learn-more"
              onClick={() => setCurrentTab('about')}
              className="mt-4 inline-flex items-center gap-2 border-b border-gold pb-1 text-xs uppercase tracking-widest text-gold hover:text-white hover:border-white transition-colors"
            >
              Discover Our Sourcing Journey
            </button>
          </div>

          {/* Bento Images Grid */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4">
            <div className="col-span-7 rounded-none overflow-hidden shadow-2xl shadow-black/40 h-80 relative border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800")' }} />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="col-span-5 rounded-none overflow-hidden shadow-2xl shadow-black/40 h-56 mt-12 relative border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600")' }} />
            </div>
            <div className="col-span-5 -mt-20 rounded-none overflow-hidden shadow-2xl shadow-black/40 h-56 relative border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600")' }} />
            </div>
            <div className="col-span-7 -mt-8 rounded-none overflow-hidden shadow-2xl shadow-black/40 h-64 relative border border-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800")' }} />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Best Sellers (Luxury Product Cards) */}
      <section id="bestsellers-section" className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold font-medium">Boutique Favorites</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">The Royal Best Sellers</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
          <p className="text-sm text-charcoal/60 max-w-lg mx-auto leading-relaxed">
            Highly-coveted, sovereign-grade single estate spices favored by professional chefs and luxury food connoisseurs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((prod) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group bg-white rounded-none overflow-hidden shadow-lg border border-gold/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Card Image Container */}
              <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => handleProductClick(prod)}>
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${prod.images[0]})` }}
                />
                
                {/* Micro overlays */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Absolute Tags */}
                {prod.specifications.organic && (
                  <span className="absolute top-4 left-4 bg-forest/90 text-gold text-[8px] font-bold uppercase tracking-luxury px-2.5 py-1 rounded-none backdrop-blur-sm shadow-md border border-gold/20">
                    100% Organic
                  </span>
                )}
                
                {/* Eye Quick View Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="flex items-center gap-1.5 bg-forest/90 text-ivory text-[10px] font-semibold uppercase tracking-luxury px-4 py-2.5 rounded-none backdrop-blur-md shadow-lg border border-gold/40">
                    <Eye size={12} className="text-gold" />
                    <span>View Secrets</span>
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-gold/80 font-bold">{prod.scientificName}</span>
                    <button
                      id={`btn-wishlist-${prod.id}`}
                      onClick={() => toggleWishlist(prod)}
                      className="p-1 hover:text-gold transition-colors text-charcoal/30"
                      aria-label="Wishlist"
                    >
                      <Heart size={16} className={isProductInWishlist(prod) ? 'fill-gold text-gold' : ''} />
                    </button>
                  </div>

                  <h3 
                    onClick={() => handleProductClick(prod)}
                    className="text-base font-serif font-bold text-forest mt-1 hover:text-gold cursor-pointer transition-colors duration-300 line-clamp-1"
                  >
                    {prod.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-gold text-xs mt-1">
                    <Star size={12} className="fill-gold" />
                    <span className="font-semibold text-charcoal">{prod.rating}</span>
                    <span className="text-charcoal/40">({prod.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gold/10 mt-3">
                  <span className="text-lg font-serif font-bold text-forest">${prod.price.toFixed(2)}</span>
                  <button
                    id={`btn-quick-add-${prod.id}`}
                    onClick={() => addToCart(prod, 1)}
                    className="flex items-center gap-1.5 bg-forest hover:bg-gold text-white hover:text-forest px-4 py-2 rounded-none text-[10px] uppercase tracking-luxury font-bold transition-all duration-300 shadow-md border border-forest hover:border-gold"
                  >
                    <ShoppingCart size={11} />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Ceyvana */}
      <section id="why-choose-section" className="bg-gradient-to-b from-white to-ivory py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">The Standard</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">Sovereign Cultivation Standards</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-none bg-white border border-gold/10 shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-none bg-gold/10 flex items-center justify-center text-gold">
                  <item.icon size={22} />
                </div>
                <h3 className="text-base font-serif font-bold text-forest">{item.title}</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Farm to Table Process */}
      <section id="timeline-section" className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Traceability</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">Our Farm to Table Process</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
        </div>

        {/* Timeline Visualizer */}
        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 pt-6">
          {/* Horizontal Line for Large Screens */}
          <div className="hidden lg:block absolute top-12 left-1/10 right-1/10 h-[1px] bg-gradient-to-r from-gold/20 via-gold to-gold/20 z-0" />
          
          {processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative text-center flex flex-col items-center z-10 group"
            >
              {/* Step square */}
              <div className="w-16 h-16 rounded-none bg-forest text-gold border-2 border-gold font-serif font-bold text-xl flex items-center justify-center mb-4 shadow-xl transition-transform duration-300 group-hover:scale-110">
                {idx + 1}
              </div>
              <h3 className="text-lg font-serif font-semibold text-forest mb-2 group-hover:text-gold transition-colors">{step.name}</h3>
              <p className="text-xs text-charcoal/60 max-w-xs leading-relaxed font-light">{step.desc}</p>
              {idx < processSteps.length - 1 && (
                <div className="block lg:hidden w-[1px] h-8 bg-gold my-4" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Gourmet Recipe Feature */}
      <section id="featured-recipes-section" className="bg-forest py-24 text-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Culinary Arts</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Gourmet Culinary Inspiration</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto" />
            <p className="text-sm text-ivory/60 max-w-md mx-auto leading-relaxed">
              Unlock the spectacular, chemical-free healing and flavoring power of genuine Ceylon ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recipes.map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group bg-white/5 border border-white/10 rounded-none overflow-hidden hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${rec.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent opacity-60" />
                </div>
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-wider">
                      <span>{rec.prepTime} Prep</span>
                      <span>•</span>
                      <span>{rec.difficulty}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold mt-2 text-white group-hover:text-gold transition-colors line-clamp-1">{rec.name}</h3>
                    <p className="text-xs text-ivory/60 leading-relaxed line-clamp-3 mt-1 font-light">{rec.description}</p>
                  </div>
                  <button
                    id={`btn-view-recipe-${rec.id}`}
                    onClick={() => {
                      setCurrentTab('recipes');
                      window.scrollTo(0,0);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white uppercase tracking-widest font-bold self-start mt-4 border-b border-gold/40 hover:border-white transition-all pb-0.5"
                  >
                    <span>View Preparation</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials Carousel */}
      <section id="testimonials-section" className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">The Circle</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">Dispatches from Fine Kitchens</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto relative bg-white border border-gold/10 p-8 md:p-16 rounded-none shadow-lg">
          <div className="absolute top-4 left-6 text-7xl font-serif text-gold/10 pointer-events-none select-none">“</div>
          
          <div className="space-y-6 text-center">
            <p className="text-base md:text-xl font-serif italic text-forest leading-relaxed font-light">
              "{testimonials[activeTestimonial].quote}"
            </p>
            
            <div className="flex flex-col items-center space-y-2">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].name}
                className="w-14 h-14 rounded-none border border-gold object-cover shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-forest">{testimonials[activeTestimonial].name}</h4>
                <p className="text-[10px] text-gold uppercase tracking-widest font-medium">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              id="btn-prev-testimonial"
              onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="p-2 border border-gold/20 hover:border-gold hover:text-gold rounded-none text-forest transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex space-x-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-none transition-colors ${i === activeTestimonial ? 'bg-gold' : 'bg-gold/20'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              id="btn-next-testimonial"
              onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="p-2 border border-gold/20 hover:border-gold hover:text-gold rounded-none text-forest transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Global Shipping World Map */}
      <section id="global-shipping-section" className="bg-forest py-24 text-ivory relative overflow-hidden border-y border-gold/20">
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: 'radial-gradient(#C7A44B 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Worldwide Dispatch</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Prinstine Global Delivery</h2>
            <div className="w-16 h-[1px] bg-gold" />
            <p className="text-sm text-ivory/70 leading-relaxed font-light">
              To ensure the delicate volatile spice oils are not degraded during transit, we pack hermetically at the source and utilize temperature-conscious express cargo lines. 
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="text-gold" size={16} />
                <span className="text-xs">Europe & UK Express: 3 - 5 Days</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" size={16} />
                <span className="text-xs">North America Express: 4 - 6 Days</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" size={16} />
                <span className="text-xs">Asia & Gulf Cargo: 2 - 4 Days</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" size={16} />
                <span className="text-xs">Australia & NZ Cargo: 4 - 6 Days</span>
              </div>
            </div>
            <p className="text-[10px] text-gold/60 uppercase tracking-widest font-semibold pt-2">★ COMPLIMENTARY EXPRESS DELIVERY FOR ORDERS OVER $150</p>
          </div>

          {/* Interactive Styled SVG Map */}
          <div className="lg:col-span-8 flex justify-center">
            <svg viewBox="0 0 1000 500" className="w-full max-w-4xl text-gold" style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))' }} aria-label="CEYVANA global shipping map">
              {/* World Map Graticule Lines */}
              <path d="M 50 250 L 950 250" stroke="rgba(251, 248, 243, 0.05)" strokeDasharray="5,5" />
              <path d="M 500 50 L 500 450" stroke="rgba(251, 248, 243, 0.05)" strokeDasharray="5,5" />
              
              {/* Stylized Continents */}
              {/* North America */}
              <path d="M 100 150 Q 180 120 280 140 Q 240 240 180 260 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(199, 164, 75, 0.1)" strokeWidth="1" />
              {/* South America */}
              <path d="M 230 290 Q 280 340 270 440 Q 220 380 200 320 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(199, 164, 75, 0.1)" strokeWidth="1" />
              {/* Africa */}
              <path d="M 450 230 Q 530 220 540 330 Q 510 390 480 410 Q 440 320 450 230" fill="rgba(255,255,255,0.05)" stroke="rgba(199, 164, 75, 0.1)" strokeWidth="1" />
              {/* Eurasia */}
              <path d="M 450 120 Q 550 80 750 100 Q 850 160 880 260 Q 750 280 650 220 Q 550 180 450 120" fill="rgba(255,255,255,0.05)" stroke="rgba(199, 164, 75, 0.1)" strokeWidth="1" />
              {/* Australia */}
              <path d="M 780 340 Q 880 350 850 410 Q 750 390 780 340" fill="rgba(255,255,255,0.05)" stroke="rgba(199, 164, 75, 0.1)" strokeWidth="1" />

              {/* Sri Lanka / Origin Node */}
              <circle cx="640" cy="245" r="8" fill="#C7A44B" className="animate-ping" />
              <circle cx="640" cy="245" r="5" fill="#FAF8F3" />
              <text x="640" y="232" fill="#C7A44B" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">ORIGIN: CEYLON</text>

              {/* Destination Hubs & Lanes */}
              {/* London */}
              <path d="M 640 245 Q 560 140 480 130" fill="none" stroke="#C7A44B" strokeWidth="1.5" strokeDasharray="4,4" className="animate-[dash_5s_linear_infinite]" />
              <circle cx="480" cy="130" r="3" fill="#FAF8F3" />
              <text x="480" y="120" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle">London (4d)</text>

              {/* New York */}
              <path d="M 640 245 Q 400 130 250 150" fill="none" stroke="#C7A44B" strokeWidth="1.5" strokeDasharray="4,4" />
              <circle cx="250" cy="150" r="3" fill="#FAF8F3" />
              <text x="250" y="140" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle">New York (5d)</text>

              {/* Tokyo */}
              <path d="M 640 245 Q 730 200 810 160" fill="none" stroke="#C7A44B" strokeWidth="1.5" strokeDasharray="4,4" />
              <circle cx="810" cy="160" r="3" fill="#FAF8F3" />
              <text x="810" y="150" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle">Tokyo (3d)</text>

              {/* Sydney */}
              <path d="M 640 245 Q 740 320 810 370" fill="none" stroke="#C7A44B" strokeWidth="1.5" strokeDasharray="4,4" />
              <circle cx="810" cy="370" r="3" fill="#FAF8F3" />
              <text x="810" y="382" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle">Sydney (4d)</text>

              {/* Dubai */}
              <path d="M 640 245 Q 580 210 530 190" fill="none" stroke="#C7A44B" strokeWidth="1.5" strokeDasharray="4,4" />
              <circle cx="530" cy="190" r="3" fill="#FAF8F3" />
              <text x="530" y="180" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle">Dubai (2d)</text>
            </svg>
          </div>

        </div>
      </section>

      {/* 9. Instagram Gallery Bento */}
      <section id="instagram-section" className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Lifestyle</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-forest">Scented Lifestyles</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
          <p className="text-sm text-charcoal/60 max-w-sm mx-auto leading-relaxed">
            Follow our journey on social corridors to explore behind-the-scenes plantation tales.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramImages.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-none overflow-hidden group shadow-sm border border-gold/5">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${img})` }} />
              <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/60 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 tracking-wider font-semibold font-serif">@CEYVANA.CO</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
