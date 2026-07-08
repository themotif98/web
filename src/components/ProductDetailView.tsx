import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, Heart, MapPin, BadgeCheck, ShieldAlert, Check, RefreshCw, Send, HelpCircle, ArrowLeft } from 'lucide-react';
import { Product, CartItem, Review } from '../types';
import { products } from '../data/products';

interface ProductDetailViewProps {
  product: Product;
  addToCart: (product: Product, quantity: number) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedProduct: (product: Product) => void;
}

export default function ProductDetailView({
  product,
  addToCart,
  wishlist,
  toggleWishlist,
  setCurrentTab,
  setSelectedProduct,
}: ProductDetailViewProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  // Dynamic reviews local state
  const [localReviews, setLocalReviews] = useState<Review[]>([
    { id: '1', userName: 'Lady Victoria Wellesley', rating: 5, date: 'June 20, 2026', comment: 'The aroma when opening this brass container is absolute heaven. Paper thin cinnamon layers of supreme quality.', isVerified: true },
    { id: '2', userName: 'Chef Marcus Wareing', rating: 5, date: 'May 14, 2026', comment: 'Incredible oil density. Crucial in curating sweet-savory reductions.', isVerified: true },
    { id: '3', userName: 'Alethea Vance', rating: 4, date: 'April 02, 2026', comment: 'A highly delicate cinnamon. Completely clean flavor profile without any woody bitterness.', isVerified: false }
  ]);

  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Scroll handler for sticky add-to-cart
  useEffect(() => {
    const handleScroll = () => {
      setIsStickyVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isProductInWishlist = wishlist.some(item => item.id === product.id);

  // Sourcing Related Products based on Category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const addedReview: Review = {
      id: String(localReviews.length + 1),
      userName: newReview.name,
      rating: newReview.rating,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      comment: newReview.comment,
      isVerified: false
    };

    setLocalReviews([addedReview, ...localReviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const handleRelatedProductClick = (p: Product) => {
    setSelectedProduct(p);
    setActiveImage(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="product-detail-view" className="font-sans min-h-screen bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Breadcrumbs / Back button */}
        <div className="flex items-center justify-between">
          <button
            id="btn-back-to-shop"
            onClick={() => {
              setCurrentTab('shop');
              window.scrollTo(0,0);
            }}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-forest font-bold"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Boutique</span>
          </button>
          <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-mono">ID: {product.id}</span>
        </div>

        {/* Core Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Image Gallery Column (LG: Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Image with zoom container */}
            <div className="aspect-square rounded-none overflow-hidden border border-gold/15 bg-white relative shadow-md group">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.specifications.organic && (
                <span className="absolute top-4 left-4 bg-forest/90 text-gold text-[8px] font-bold uppercase tracking-luxury px-2.5 py-1.5 rounded-none border border-gold/30 backdrop-blur-sm">
                  100% Organic certified
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-none overflow-hidden border-2 bg-white ${activeImage === idx ? 'border-gold' : 'border-gold/10 opacity-60 hover:opacity-100'} transition-all`}
                >
                  <img src={img} alt={`${product.name} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Purchasing & Details Column (LG: Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">{product.scientificName}</span>
              <h1 className="font-serif font-bold text-3xl md:text-4xl text-forest">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gold text-sm font-semibold">
                  <Star size={14} className="fill-gold" />
                  <span className="text-charcoal">{product.rating}</span>
                  <span className="text-charcoal/40 font-light">({localReviews.length} Verified Reviews)</span>
                </div>
                <div className="w-[1px] h-4 bg-gold/20" />
                <span className="text-xs uppercase tracking-widest text-forest font-bold">{product.specifications.origin}</span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-forest text-ivory p-6 rounded-none border border-gold/30 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-luxury text-gold/80 font-mono">Bespoke Sovereign Pricing</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-white">${product.price.toFixed(2)}</span>
                  <span className="text-[10px] text-ivory/60">USD</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`block text-[10px] font-bold uppercase tracking-luxury px-2.5 py-1 rounded-none ${product.stock > 10 ? 'bg-gold/10 text-gold border border-gold/30' : 'bg-red-500/20 text-red-300'}`}>
                  {product.stock > 10 ? '✔ IN STOCK' : `ONLY ${product.stock} REMAINING`}
                </span>
                <span className="text-[9px] text-ivory/40 block mt-1">Ready for custom export freight</span>
              </div>
            </div>

            {/* Interactive Buy Control */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-gold/30 bg-white rounded-none px-4 py-2 shadow-sm">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="text-forest hover:text-gold font-bold text-sm px-2"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="bg-transparent border-none text-center w-12 text-sm text-forest focus:outline-none font-bold"
                />
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="text-forest hover:text-gold font-bold text-sm px-2"
                >
                  +
                </button>
              </div>

              <button
                id="btn-add-detail-to-cart"
                onClick={() => addToCart(product, quantity)}
                className="flex-grow flex items-center justify-center gap-2 bg-forest hover:bg-gold text-white hover:text-forest py-4 rounded-none text-xs uppercase tracking-luxury font-bold transition-all shadow-xl shadow-forest/10 border border-forest hover:border-gold"
              >
                <ShoppingCart size={14} />
                <span>Add Collection to Cart</span>
              </button>

              <button
                id="btn-detail-wishlist"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-none border shadow-sm transition-colors ${isStickyVisible ? 'bg-white' : ''} ${isProductInWishlist ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-charcoal/40 hover:text-gold'}`}
                aria-label="Toggle Wishlist"
              >
                <Heart size={18} className={isProductInWishlist ? 'fill-gold' : ''} />
              </button>
            </div>

            {/* Description Tab Segment */}
            <div className="space-y-4 pt-4 border-t border-gold/15">
              <h3 className="font-serif font-bold text-lg text-forest">Botanical Profile & Lore</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                {product.description}
              </p>
              <div className="bg-forest/5 p-4 rounded-none border border-gold/10 italic text-xs text-forest/90 leading-relaxed font-light">
                "{product.story}"
              </div>
            </div>

          </div>

        </div>

        {/* Flavor Composition and Spec Comparison (Bento Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          {/* Flavor Profile Sliders */}
          <div className="bg-white p-8 rounded-none border border-gold/10 shadow-sm space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-forest">Scientifically Measured Flavor Profiles</h3>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-forest uppercase text-[10px]">
                  <span>Warmth Intensity</span>
                  <span>{product.flavorProfile.warmth}%</span>
                </div>
                <div className="w-full bg-ivory h-2 mt-1 overflow-hidden border border-gold/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${product.flavorProfile.warmth}%` }} transition={{ duration: 1 }} className="bg-gold h-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-forest uppercase text-[10px]">
                  <span>Sweetness Notes</span>
                  <span>{product.flavorProfile.sweetness}%</span>
                </div>
                <div className="w-full bg-ivory h-2 mt-1 overflow-hidden border border-gold/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${product.flavorProfile.sweetness}%` }} transition={{ duration: 1 }} className="bg-gold h-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-forest uppercase text-[10px]">
                  <span>Aromatic Volatility Perfume</span>
                  <span>{product.flavorProfile.aroma}%</span>
                </div>
                <div className="w-full bg-ivory h-2 mt-1 overflow-hidden border border-gold/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${product.flavorProfile.aroma}%` }} transition={{ duration: 1 }} className="bg-gold h-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-forest uppercase text-[10px]">
                  <span>Essential Oil Concentration (Piperine/Cinnamaldehyde)</span>
                  <span>{product.flavorProfile.intensity}%</span>
                </div>
                <div className="w-full bg-ivory h-2 mt-1 overflow-hidden border border-gold/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${product.flavorProfile.intensity}%` }} transition={{ duration: 1 }} className="bg-gold h-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Specifications Table */}
          <div className="bg-white p-8 rounded-none border border-gold/10 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-forest">Sourcing Specifications</h3>
            <div className="divide-y divide-gold/10 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-charcoal/40 font-light">Estate Origin</span>
                <span className="font-bold text-forest">{product.specifications.origin}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-charcoal/40 font-light">Sovereign Grade</span>
                <span className="font-bold font-mono text-gold text-[11px]">{product.specifications.grade}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-charcoal/40 font-light">Maximum Moisture</span>
                <span className="font-bold text-forest">{product.specifications.moisture}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-charcoal/40 font-light">USDA Organic Certified</span>
                <span className="font-bold text-forest">{product.specifications.organic ? 'Certified Pure Organic' : 'Forest Wild Sourced'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-charcoal/40 font-light">Bespoke Pack Style</span>
                <span className="font-bold text-forest">{product.specifications.packageType}</span>
              </div>
            </div>
          </div>

        </section>

        {/* Healing Benefits & Cooking Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Healing benefits */}
          <div className="bg-forest p-8 rounded-none text-white space-y-4">
            <h3 className="font-serif font-bold text-lg text-gold flex items-center gap-2">
              <BadgeCheck size={20} />
              <span>Bio-Chemical Healing Benefits</span>
            </h3>
            <ul className="space-y-2 text-xs text-ivory/80 font-light leading-relaxed">
              {product.healthBenefits.map((b, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-gold mt-1 shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Culinary Pairings */}
          <div className="bg-earth p-8 rounded-none text-white space-y-4">
            <h3 className="font-serif font-bold text-lg text-gold flex items-center gap-2">
              <RefreshCw size={20} />
              <span>Sommelier Masterclass Culinary Uses</span>
            </h3>
            <ul className="space-y-2 text-xs text-ivory/80 font-light leading-relaxed">
              {product.cookingUses.map((b, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-gold mt-1 shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CUSTOMER REVIEWS MODULE (INTERACTIVE) */}
        <section id="reviews-module" className="bg-white p-8 md:p-12 rounded-none border border-gold/10 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gold/10 pb-6 gap-4">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-2xl text-forest">Authentic Patron Reviews</h3>
              <p className="text-xs text-charcoal/50">Verified dispatches from professional kitchens and home gourmets</p>
            </div>
            {/* Total score box */}
            <div className="flex items-center gap-4 bg-ivory px-4 py-2.5 rounded-none border border-gold/15 shadow-sm">
              <span className="text-3xl font-serif font-bold text-forest">{product.rating}</span>
              <div>
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className="fill-gold" />
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-luxury text-charcoal/50">Overall Rating</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews list (Col 7) */}
            <div className="lg:col-span-7 space-y-6 divide-y divide-gold/10">
              {localReviews.map((rev) => (
                <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-forest">{rev.userName}</span>
                    <span className="text-charcoal/40 font-light">{rev.date}</span>
                  </div>
                  
                  {/* Rating Stars and Verified Icon */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex text-gold">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={11} className="fill-gold" />
                      ))}
                    </div>
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-luxury text-green-700 bg-green-500/10 px-2 py-0.5 rounded-none font-bold">
                        <Check size={10} />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-charcoal/70 leading-relaxed font-light italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Write a Review Form (Col 5) */}
            <div className="lg:col-span-5 bg-ivory p-6 rounded-none border border-gold/15 space-y-4">
              <h4 className="font-serif font-bold text-lg text-forest">Dispatch Your Review</h4>
              <p className="text-[10px] text-charcoal/50 uppercase tracking-luxury leading-relaxed">Share your botanical cooking notes with the Ceyvana Circle.</p>
              
              {reviewSubmitted ? (
                <div className="bg-white/50 border border-gold/30 p-4 rounded-none text-center space-y-2 animate-fade-in">
                  <Check className="text-gold mx-auto" size={24} />
                  <span className="block font-bold text-forest text-sm">Review Submitted</span>
                  <p className="text-[10px] text-charcoal/60">Thank you for your valuable feedback. Your review will be published upon curator verification.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  
                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase block">Your Name / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Georgiana Moore"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gold/15 rounded-none focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase block">Culinary Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 text-gold hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star size={18} className={newReview.rating >= star ? 'fill-gold' : 'text-gold/30'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase block">Your Cooking Notes / Comment</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details on spice aroma, texture, flavor profile, or recipes you crafted."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gold/15 rounded-none focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <button
                    id="btn-submit-review"
                    type="submit"
                    className="w-full py-3 bg-forest hover:bg-gold text-white hover:text-forest text-[11px] uppercase tracking-luxury font-bold rounded-none transition-colors shadow border border-forest hover:border-gold flex items-center justify-center gap-1.5"
                  >
                    <Send size={11} />
                    <span>Post Review</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section id="related-products" className="space-y-8">
            <h3 className="font-serif font-bold text-2xl text-forest text-center">Complementary Cultivar Collections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleRelatedProductClick(p)}
                  className="group bg-white rounded-none overflow-hidden shadow-md border border-gold/15 hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-4 space-y-3"
                >
                  <div className="aspect-square rounded-none overflow-hidden relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gold">{p.scientificName}</span>
                    <h4 className="font-serif font-bold text-forest group-hover:text-gold transition-colors line-clamp-1">{p.name}</h4>
                    <span className="text-xs font-serif font-bold text-gold">${p.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* STICKY ADD TO CART FLOATER */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            id="sticky-purchase-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full bg-forest text-ivory p-3.5 border-t border-gold/40 z-40 shadow-2xl font-sans"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-none object-cover border border-gold/30 shrink-0" />
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase tracking-luxury text-gold/80 block">{product.scientificName}</span>
                  <span className="text-xs font-bold line-clamp-1">{product.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-serif font-bold text-gold">${product.price.toFixed(2)}</span>
                <button
                  id="btn-sticky-add-to-cart"
                  onClick={() => addToCart(product, quantity)}
                  className="flex items-center gap-1.5 bg-gold hover:bg-white text-forest px-6 py-2.5 rounded-none text-[10px] uppercase tracking-luxury font-bold transition-all shadow-md"
                >
                  <ShoppingCart size={12} />
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
