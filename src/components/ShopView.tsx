import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Eye, ShoppingCart, Heart, ShieldAlert, Sparkles, Scale, Check, ClipboardList, Info } from 'lucide-react';
import { Product, CartItem } from '../types';
import { products, categories } from '../data/products';

interface ShopViewProps {
  addToCart: (product: Product, quantity: number) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  setSelectedProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
}

export default function ShopView({
  addToCart,
  wishlist,
  toggleWishlist,
  setSelectedProduct,
  setCurrentTab,
  searchQuery,
}: ShopViewProps) {
  // Filters & State
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(150);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Comparison State
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(false);

  // Bulk Inquiry State
  const [showBulkForm, setShowBulkForm] = useState<boolean>(false);
  const [bulkData, setBulkData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    spicesInterested: [] as string[],
    volume: '50kg - 200kg',
    message: ''
  });
  const [bulkInquirySubmitted, setBulkInquirySubmitted] = useState<boolean>(false);

  // Listen to Global Category Filter Event from Home Screen
  useEffect(() => {
    const handleFilterCategory = (e: Event) => {
      const catId = (e as CustomEvent).detail;
      setSelectedCategory(catId);
    };
    window.addEventListener('filter-category', handleFilterCategory);
    return () => window.removeEventListener('filter-category', handleFilterCategory);
  }, []);

  // Update local search if header search query changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Filter & Sort Logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(localSearch.toLowerCase()) || 
                          prod.description.toLowerCase().includes(localSearch.toLowerCase()) ||
                          prod.scientificName.toLowerCase().includes(localSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesOrganic = !organicOnly || prod.specifications.organic;
    const matchesPrice = prod.price <= priceRange;

    return matchesSearch && matchesCategory && matchesOrganic && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default (no sort)
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isProductInWishlist = (product: Product) => {
    return wishlist.some(item => item.id === product.id);
  };

  // Compare handlers
  const handleAddToCompare = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (comparedProducts.some(p => p.id === product.id)) {
      setComparedProducts(comparedProducts.filter(p => p.id !== product.id));
    } else {
      if (comparedProducts.length >= 3) {
        alert("You can compare up to 3 premium products at a time.");
        return;
      }
      setComparedProducts([...comparedProducts, product]);
    }
  };

  // Bulk Inquiry submission
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkInquirySubmitted(true);
    setTimeout(() => {
      setBulkInquirySubmitted(false);
      setShowBulkForm(false);
      setBulkData({
        name: '',
        company: '',
        email: '',
        phone: '',
        spicesInterested: [],
        volume: '50kg - 200kg',
        message: ''
      });
    }, 4000);
  };

  const handleSpiceInterestToggle = (id: string) => {
    if (bulkData.spicesInterested.includes(id)) {
      setBulkData({
        ...bulkData,
        spicesInterested: bulkData.spicesInterested.filter(item => item !== id)
      });
    } else {
      setBulkData({
        ...bulkData,
        spicesInterested: [...bulkData.spicesInterested, id]
      });
    }
  };

  return (
    <div id="shop-view-container" className="font-sans min-h-screen bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Banner Section */}
        <div id="shop-banner" className="relative h-64 rounded-none overflow-hidden bg-forest flex items-center p-8 md:p-16 border border-gold/20 shadow-xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200")' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
          <div className="relative space-y-3 z-10 text-white max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">World-Class Spices</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-none">Boutique Collection</h1>
            <p className="text-xs md:text-sm text-ivory/75 font-light leading-relaxed">
              Harvested sequentially on single family estates. Hand-graded to Alba and Sovereign standards and hermetically packaged to lock in authentic mountain freshness.
            </p>
          </div>
        </div>

        {/* Global Controls Grid */}
        <div id="shop-controls" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sidebar Filters */}
          <div id="shop-sidebar" className="lg:col-span-3 space-y-8 bg-white p-6 rounded-none border border-gold/10 shadow-md sticky top-28">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <h2 className="font-serif font-bold text-lg text-forest flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gold" />
                <span>Refine Search</span>
              </h2>
              {(selectedCategory !== 'all' || localSearch !== '' || organicOnly || priceRange < 150) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setLocalSearch('');
                    setOrganicOnly(false);
                    setPriceRange(150);
                  }}
                  className="text-[10px] uppercase tracking-wider text-gold hover:text-forest font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-bold text-forest">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left text-xs px-3 py-2 rounded-none transition-colors ${selectedCategory === 'all' ? 'bg-forest text-gold font-semibold' : 'hover:bg-ivory text-charcoal'}`}
                >
                  All Cultivars
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-none transition-colors ${selectedCategory === cat.id ? 'bg-forest text-gold font-semibold' : 'hover:bg-ivory text-charcoal'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest font-bold text-forest">Max Price</h3>
                <span className="text-xs font-serif font-bold text-gold">${priceRange}</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-gold bg-ivory h-1 rounded"
              />
            </div>

            {/* Organic Switch */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs uppercase tracking-widest font-bold text-forest">Organic Certified</span>
              <button
                onClick={() => setOrganicOnly(!organicOnly)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${organicOnly ? 'bg-forest' : 'bg-charcoal/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-gold transition-transform ${organicOnly ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Bulk Order Card */}
            <div className="bg-forest/5 p-4 rounded-none border border-gold/25 space-y-3 text-center">
              <ClipboardList className="text-gold mx-auto" size={24} />
              <h4 className="text-xs uppercase tracking-wider font-bold text-forest">Wholesale & Export</h4>
              <p className="text-[10px] text-charcoal/70 leading-relaxed">
                Looking for container volumes or customized private labels? We supply international hotels and distributors directly.
              </p>
              <button
                id="btn-wholesale-inquiry"
                onClick={() => setShowBulkForm(true)}
                className="w-full py-2 bg-forest hover:bg-gold text-white hover:text-forest text-[10px] uppercase tracking-widest font-bold rounded-none transition-colors shadow-md border border-forest hover:border-gold"
              >
                Wholesale Inquiry
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Products Grid & Search */}
          <div id="shop-catalog" className="lg:col-span-9 space-y-6">
            
            {/* Search, Sort, Stats Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-none border border-gold/10 shadow-sm">
              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search single estates..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-ivory rounded-none text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Status and Sort */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto text-xs">
                <span className="text-charcoal/50 font-light">{filteredProducts.length} Premium Products Found</span>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-gold" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-ivory border border-gold/15 rounded px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-none border border-gold/10 shadow-sm space-y-3">
                <ShieldAlert className="text-gold mx-auto" size={48} />
                <h3 className="font-serif font-bold text-xl text-forest">No Spices Found</h3>
                <p className="text-xs text-charcoal/50 max-w-sm mx-auto leading-relaxed">
                  We could not find any single estates matching your criteria. Try adjusting your price ranges or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <motion.div
                    key={prod.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-none overflow-hidden shadow-md border border-gold/15 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Container */}
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => handleProductClick(prod)}>
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${prod.images[0]})` }}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                      
                      {/* Compare Checkbox */}
                      <button
                        id={`btn-compare-toggle-${prod.id}`}
                        onClick={(e) => handleAddToCompare(prod, e)}
                        className={`absolute top-4 right-4 p-2 rounded-none backdrop-blur-md border shadow-md transition-colors ${comparedProducts.some(p => p.id === prod.id) ? 'bg-gold border-gold text-forest' : 'bg-forest/80 border-gold/30 text-gold hover:bg-forest'}`}
                        title="Compare Product"
                      >
                        <Scale size={14} />
                      </button>

                      {/* Grade Badge */}
                      <span className="absolute bottom-4 left-4 bg-forest/90 text-gold text-[8px] font-bold uppercase tracking-luxury px-2.5 py-1 rounded-none shadow-md border border-gold/20">
                        {prod.specifications.grade}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-widest text-gold/80 font-bold">{prod.scientificName}</span>
                          <button
                            id={`btn-wishlist-grid-${prod.id}`}
                            onClick={() => toggleWishlist(prod)}
                            className="p-1 text-charcoal/20 hover:text-gold transition-colors"
                            aria-label="Wishlist"
                          >
                            <Heart size={14} className={isProductInWishlist(prod) ? 'fill-gold text-gold' : ''} />
                          </button>
                        </div>

                        <h3 
                          onClick={() => handleProductClick(prod)}
                          className="text-base font-serif font-bold text-forest mt-1 hover:text-gold cursor-pointer line-clamp-1"
                        >
                          {prod.name}
                        </h3>

                        <p className="text-[11px] text-charcoal/60 line-clamp-2 leading-relaxed font-light mt-1">
                          {prod.description}
                        </p>
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between pt-4 border-t border-gold/10 mt-3">
                        <div className="flex flex-col">
                          <span className="text-base font-serif font-bold text-forest">${prod.price.toFixed(2)}</span>
                          <span className="text-[8px] text-charcoal/40 uppercase tracking-widest font-mono">{prod.specifications.packageType.split('(')[1]?.replace(')', '') || 'Premium Pack'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-quickview-${prod.id}`}
                            onClick={() => setQuickViewProduct(prod)}
                            className="p-2 border border-gold/20 text-gold hover:bg-gold/10 rounded-none transition-colors"
                            title="Quick View"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            id={`btn-add-to-cart-${prod.id}`}
                            onClick={() => addToCart(prod, 1)}
                            className="flex items-center gap-1 bg-forest hover:bg-gold text-white hover:text-forest px-3.5 py-1.5 rounded-none text-[10px] uppercase tracking-luxury font-bold transition-all border border-forest hover:border-gold"
                          >
                            <ShoppingCart size={10} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* COMPARISON BAR (STIKCY DRAWER) */}
      <AnimatePresence>
        {comparedProducts.length > 0 && (
          <motion.div
            id="comparison-drawer"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full bg-forest text-ivory p-4 border-t border-gold/40 z-40 shadow-2xl font-sans"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Scale className="text-gold" size={20} />
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold">Product Comparison</span>
                  <p className="text-[10px] text-ivory/60">Comparing {comparedProducts.length} premium single estates</p>
                </div>
              </div>

              {/* Minis */}
              <div className="flex flex-wrap items-center gap-4">
                {comparedProducts.map(p => (
                  <div key={p.id} className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 pr-3 rounded-none">
                    <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-none object-cover" />
                    <span className="text-[10px] max-w-[100px] truncate">{p.name}</span>
                    <button onClick={(e) => handleAddToCompare(p, e)} className="text-gold/60 hover:text-white p-0.5">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Trigger details overlay */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setComparedProducts([])}
                  className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white"
                >
                  Clear
                </button>
                <button
                  id="btn-show-comparison"
                  onClick={() => setShowComparison(true)}
                  className="bg-gold text-forest hover:bg-white hover:text-forest px-5 py-2.5 rounded-none text-[10px] uppercase tracking-luxury font-bold transition-all shadow-md"
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPARISON DETAILS FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            id="comparison-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-ivory border border-gold/30 rounded-2xl p-8 max-w-5xl w-full text-charcoal space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-4">
                <div className="flex items-center gap-2 text-forest">
                  <Scale size={24} className="text-gold" />
                  <h2 className="font-serif font-bold text-2xl">Aromatic Specification Analysis</h2>
                </div>
                <button
                  id="btn-close-comparison"
                  onClick={() => setShowComparison(false)}
                  className="p-2 border border-gold/20 hover:border-gold hover:text-gold rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Comparisons table */}
              <div className="grid grid-cols-4 gap-6 items-stretch text-xs">
                {/* Headers */}
                <div className="flex flex-col justify-end border-r border-gold/15 pr-4 py-4 space-y-4 font-bold text-forest uppercase tracking-widest">
                  <div className="h-40 flex items-end">Spices</div>
                  <div className="py-2.5 border-b border-gold/10">Price</div>
                  <div className="py-2.5 border-b border-gold/10">Scientific Name</div>
                  <div className="py-2.5 border-b border-gold/10">Estate Origin</div>
                  <div className="py-2.5 border-b border-gold/10">Sovereign Grade</div>
                  <div className="py-2.5 border-b border-gold/10">Organic Certified</div>
                  <div className="py-2.5 border-b border-gold/10">Flavor: Warmth</div>
                  <div className="py-2.5 border-b border-gold/10">Flavor: Sweetness</div>
                  <div className="py-2.5 border-b border-gold/10">Flavor: Aroma Perfume</div>
                  <div className="py-2.5 border-b border-gold/10">Flavor: Oil Intensity</div>
                  <div className="py-4">Purchase</div>
                </div>

                {comparedProducts.map((p) => (
                  <div key={p.id} className="text-center flex flex-col space-y-4 py-4 border-r border-gold/5 last:border-r-0">
                    <div className="h-40 flex flex-col items-center justify-end space-y-2">
                      <img src={p.images[0]} alt={p.name} className="w-24 h-24 rounded-lg object-cover shadow border border-gold/10" />
                      <h4 className="font-serif font-bold text-forest line-clamp-2 h-10">{p.name}</h4>
                    </div>

                    <div className="py-2.5 border-b border-gold/10 font-bold text-gold text-sm font-serif">${p.price.toFixed(2)}</div>
                    <div className="py-2.5 border-b border-gold/10 italic text-charcoal/75">{p.scientificName}</div>
                    <div className="py-2.5 border-b border-gold/10">{p.specifications.origin}</div>
                    <div className="py-2.5 border-b border-gold/10 font-mono text-[10px]">{p.specifications.grade}</div>
                    <div className="py-2.5 border-b border-gold/10 font-bold">{p.specifications.organic ? '✔ YES' : '★ EXPORT STG'}</div>
                    
                    {/* Flavor ratios */}
                    <div className="py-2.5 border-b border-gold/10 font-medium text-forest">{p.flavorProfile.warmth}%</div>
                    <div className="py-2.5 border-b border-gold/10 font-medium text-forest">{p.flavorProfile.sweetness}%</div>
                    <div className="py-2.5 border-b border-gold/10 font-medium text-forest">{p.flavorProfile.aroma}%</div>
                    <div className="py-2.5 border-b border-gold/10 font-medium text-forest">{p.flavorProfile.intensity}%</div>

                    <div className="pt-4 flex justify-center">
                      <button
                        id={`btn-compare-add-to-cart-${p.id}`}
                        onClick={() => {
                          addToCart(p, 1);
                          setShowComparison(false);
                        }}
                        className="flex items-center justify-center gap-1 bg-forest hover:bg-gold text-white hover:text-forest px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all shadow border border-forest hover:border-gold"
                      >
                        <ShoppingCart size={11} />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Fill empty spots */}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center border-dashed border-2 border-gold/10 rounded-xl m-4 text-center text-charcoal/30">
                    <div className="space-y-1">
                      <Scale size={20} className="mx-auto" />
                      <span className="text-[10px] uppercase tracking-wider">Empty Spot</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK VIEW DIALOG */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            id="quickview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-ivory border border-gold/30 rounded-2xl p-6 md:p-8 max-w-3xl w-full text-charcoal relative max-h-[90vh] overflow-y-auto"
            >
              <button
                id="btn-close-quickview"
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 border border-gold/20 hover:border-gold hover:text-gold rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
                {/* Images */}
                <div className="aspect-square rounded-xl overflow-hidden border border-gold/10 shadow-inner relative">
                  <img src={quickViewProduct.images[0]} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold/80 font-bold">{quickViewProduct.scientificName}</span>
                    <h2 className="font-serif font-bold text-2xl text-forest">{quickViewProduct.name}</h2>
                    <span className="text-xl font-serif font-bold text-gold">${quickViewProduct.price.toFixed(2)}</span>
                  </div>

                  <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                    {quickViewProduct.description}
                  </p>

                  {/* Flavor Indicators */}
                  <div className="space-y-2 border-t border-b border-gold/10 py-3">
                    <span className="text-[10px] uppercase tracking-widest text-forest font-bold">Botanical Composition</span>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-charcoal/40">Warmth</span>
                        <div className="w-full bg-forest/10 h-1 rounded mt-1 overflow-hidden">
                          <div className="bg-gold h-full" style={{ width: `${quickViewProduct.flavorProfile.warmth}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-charcoal/40">Perfume Aroma</span>
                        <div className="w-full bg-forest/10 h-1 rounded mt-1 overflow-hidden">
                          <div className="bg-gold h-full" style={{ width: `${quickViewProduct.flavorProfile.aroma}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-charcoal/40">Sweetness</span>
                        <div className="w-full bg-forest/10 h-1 rounded mt-1 overflow-hidden">
                          <div className="bg-gold h-full" style={{ width: `${quickViewProduct.flavorProfile.sweetness}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-charcoal/40">Oil Intensity</span>
                        <div className="w-full bg-forest/10 h-1 rounded mt-1 overflow-hidden">
                          <div className="bg-gold h-full" style={{ width: `${quickViewProduct.flavorProfile.intensity}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick specs */}
                  <div className="text-[10px] space-y-1 bg-white p-3 rounded border border-gold/15">
                    <div className="flex justify-between"><strong>Origin:</strong> <span className="text-charcoal/70">{quickViewProduct.specifications.origin}</span></div>
                    <div className="flex justify-between"><strong>Grade:</strong> <span className="text-charcoal/70">{quickViewProduct.specifications.grade}</span></div>
                    <div className="flex justify-between"><strong>Volume:</strong> <span className="text-charcoal/70">{quickViewProduct.specifications.packageType}</span></div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      id="btn-quickview-add-to-cart"
                      onClick={() => {
                        addToCart(quickViewProduct, 1);
                        setQuickViewProduct(null);
                      }}
                      className="flex-grow flex items-center justify-center gap-2 bg-forest hover:bg-gold text-white hover:text-forest py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all border border-forest hover:border-gold"
                    >
                      <ShoppingCart size={14} />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      id="btn-quickview-details"
                      onClick={() => handleProductClick(quickViewProduct)}
                      className="px-5 py-3 border border-gold text-gold hover:bg-gold/10 rounded-full text-xs uppercase tracking-widest font-bold transition-all"
                    >
                      Full Details
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BULK/WHOLESALE INQUIRY MODAL */}
      <AnimatePresence>
        {showBulkForm && (
          <motion.div
            id="wholesale-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white border border-gold/30 rounded-2xl p-8 max-w-lg w-full text-charcoal relative max-h-[90vh] overflow-y-auto font-sans"
            >
              <button
                id="btn-close-wholesale"
                onClick={() => setShowBulkForm(false)}
                className="absolute top-4 right-4 p-2 border border-gold/10 hover:border-gold hover:text-gold rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="space-y-4 pt-4">
                <div className="text-center space-y-1">
                  <ClipboardList className="text-gold mx-auto" size={32} />
                  <h2 className="font-serif font-bold text-2xl text-forest">Wholesale B2B Inquiry</h2>
                  <p className="text-[11px] text-charcoal/50 uppercase tracking-wider font-light">Custom commercial prices & global export freight</p>
                </div>

                {bulkInquirySubmitted ? (
                  <div className="py-8 text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 bg-gold/10 border border-gold text-gold rounded-full flex items-center justify-center mx-auto">
                      <Check size={32} className="animate-bounce" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-forest">Inquiry Received</h3>
                    <p className="text-xs text-charcoal/60 leading-relaxed max-w-sm mx-auto">
                      Our commercial export concierge is preparing your custom quote. A dedicated accounts officer will email you at <strong>{bulkData.email}</strong> within 12 hours.
                    </p>
                    <p className="text-[10px] font-mono text-gold font-bold">Inquiry ID: CEYB2B-{Math.floor(Math.random() * 90000) + 10000}</p>
                  </div>
                ) : (
                  <form onSubmit={handleBulkSubmit} className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Full Name</label>
                        <input
                          type="text" required placeholder="Elena"
                          value={bulkData.name} onChange={(e) => setBulkData({...bulkData, name: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Corporate Email</label>
                        <input
                          type="email" required placeholder="elena@gourmet.co"
                          value={bulkData.email} onChange={(e) => setBulkData({...bulkData, email: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Company Name</label>
                        <input
                          type="text" required placeholder="Imperial Foods Ltd"
                          value={bulkData.company} onChange={(e) => setBulkData({...bulkData, company: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Estimated Volume</label>
                        <select
                          value={bulkData.volume} onChange={(e) => setBulkData({...bulkData, volume: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold text-xs"
                        >
                          <option>50kg - 200kg</option>
                          <option>200kg - 1 Tonne</option>
                          <option>1 Tonne - 5 Tonnes</option>
                          <option>FCL (Full Container Load)</option>
                        </select>
                      </div>
                    </div>

                    {/* Interest checklists */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-forest uppercase block">Spices of Interest</label>
                      <div className="grid grid-cols-2 gap-2 bg-ivory p-3 rounded border border-gold/10">
                        {products.map(p => (
                          <label key={p.id} className="flex items-center gap-2 cursor-pointer text-[11px]">
                            <input
                              type="checkbox"
                              checked={bulkData.spicesInterested.includes(p.id)}
                              onChange={() => handleSpiceInterestToggle(p.id)}
                              className="accent-gold"
                            />
                            <span className="truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-forest uppercase">Port / Packaging Requirements</label>
                      <textarea
                        rows={3}
                        placeholder="Please specify if you require organic certification tags, private branding containers, or custom shipping documentation."
                        value={bulkData.message} onChange={(e) => setBulkData({...bulkData, message: e.target.value})}
                        className="w-full p-2.5 bg-ivory rounded border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold text-xs"
                      />
                    </div>

                    <button
                      id="btn-submit-wholesale"
                      type="submit"
                      className="w-full py-3 bg-forest hover:bg-gold text-white hover:text-forest text-xs uppercase tracking-widest font-bold rounded transition-colors shadow border border-forest hover:border-gold"
                    >
                      Submit Export Proposal
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
