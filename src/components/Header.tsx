import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Sparkles, Menu, X, Search } from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  onSearch: (query: string) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  cart,
  wishlist,
  onSearch,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Boutique Shop' },
    { id: 'sommelier', label: 'AI Spice Sommelier', highlight: true },
    { id: 'recipes', label: 'Gourmet Recipes' },
    { id: 'about', label: 'Heritage & Story' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'blog', label: 'Editorial Blog' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setCurrentTab('shop');
    setSearchOpen(false);
  };

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-ivory/95 text-charcoal border-b border-gold/20 py-4 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <button
          id="btn-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <div
          id="brand-logo-container"
          onClick={() => setCurrentTab('home')}
          className="cursor-pointer flex flex-col items-center group"
        >
          <span className="text-2xl md:text-3xl font-serif tracking-luxury font-bold text-charcoal group-hover:text-gold transition-colors duration-300">
            CEYVANA
          </span>
          <span className="text-[9px] tracking-[0.4em] uppercase font-semibold text-gold -mt-0.5">
            PREMIUM CEYLON SPICES
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative text-[10px] uppercase tracking-luxury transition-colors duration-300 font-semibold py-2 ${
                currentTab === item.id
                  ? 'text-gold'
                  : 'text-charcoal/80 hover:text-gold'
              } ${
                item.highlight
                  ? 'flex items-center gap-1.5 px-3 py-1 rounded-none border border-gold bg-gold/10 text-gold hover:bg-gold/20'
                  : ''
              }`}
            >
              {item.highlight && <Sparkles size={11} className="animate-pulse" />}
              {item.label}
              {!item.highlight && currentTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold animate-slide-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Utility Icons */}
        <div id="header-utilities" className="flex items-center space-x-3 text-charcoal">
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-charcoal/5 rounded-none px-3 py-1.5 border border-gold/30">
                <input
                  type="text"
                  placeholder="Search spices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-charcoal focus:outline-none w-32 md:w-48 placeholder-charcoal/40"
                  autoFocus
                />
                <button type="submit" className="text-charcoal hover:text-gold">
                  <Search size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 text-charcoal/50 hover:text-charcoal"
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button
                id="btn-search-toggle"
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:text-gold transition-colors relative"
                aria-label="Search spices"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <button
            id="btn-wishlist-toggle"
            onClick={() => setCurrentTab('wishlist')}
            className="p-2 hover:text-gold transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-gold text-gold' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-forest text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            id="btn-cart-toggle"
            onClick={() => setCurrentTab('cart')}
            className="p-2 hover:text-gold transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalCartItems > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-forest text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden fixed inset-0 top-[70px] bg-forest/98 z-40 flex flex-col p-8 space-y-6 overflow-y-auto animate-fade-in">
          {navItems.map((item) => (
            <button
              id={`mobile-nav-item-${item.id}`}
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-lg uppercase tracking-widest text-left font-medium flex items-center justify-between py-2 border-b border-white/10 ${
                currentTab === item.id ? 'text-gold' : 'text-ivory/80'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.highlight && <Sparkles size={16} className="text-gold" />}
                {item.label}
              </span>
              <span className="text-gold/40">→</span>
            </button>
          ))}
          <div className="pt-8 text-center">
            <p className="text-xs text-gold/60 uppercase tracking-widest mb-2">WORLDWIDE EXPORTER</p>
            <p className="text-[10px] text-ivory/50">Guaranteed 100% Pure Ceylon Origin</p>
          </div>
        </div>
      )}
    </header>
  );
}
