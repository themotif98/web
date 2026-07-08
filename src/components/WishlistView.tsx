import { motion } from 'motion/react';
import { Heart, ShoppingCart, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product, quantity: number) => void;
  setSelectedProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export default function WishlistView({
  wishlist,
  toggleWishlist,
  addToCart,
  setSelectedProduct,
  setCurrentTab,
}: WishlistViewProps) {
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="wishlist-view" className="font-sans min-h-screen bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-luxury text-gold font-semibold flex items-center justify-center gap-1.5">
            <Heart size={14} className="fill-gold text-gold" />
            <span>Saved Cultivars</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-forest">Sovereign Wishlist</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto" />
          <p className="text-xs md:text-sm text-charcoal/60 max-w-xl mx-auto leading-relaxed">
            Your private vault of single estate harvests, and custom-cured spice formulations.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-none border border-gold/15 shadow-sm space-y-4 max-w-md mx-auto">
            <Heart className="text-gold/40 mx-auto" size={48} />
            <h2 className="font-serif font-bold text-xl text-forest">Wishlist is Empty</h2>
            <p className="text-xs text-charcoal/50 leading-relaxed max-w-xs mx-auto">
              Save your favorite single estate spices while browsing our boutique collections.
            </p>
            <button
              onClick={() => setCurrentTab('shop')}
              className="bg-forest hover:bg-gold text-white hover:text-forest px-8 py-3.5 rounded-none text-xs uppercase tracking-luxury font-bold transition-all border border-forest hover:border-gold shadow cursor-pointer"
            >
              Discover Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((prod) => (
              <div
                key={prod.id}
                className="group bg-white rounded-none overflow-hidden shadow-md border border-gold/15 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Container */}
                <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => handleProductClick(prod)}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${prod.images[0]})` }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20" />
                  
                  {/* Remove Button */}
                  <button
                    id={`btn-wishlist-remove-${prod.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-none bg-forest text-gold border border-gold/30 shadow-md hover:bg-gold hover:text-forest transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={14} />
                  </button>

                  <span className="absolute bottom-4 left-4 bg-forest/90 text-gold text-[8px] font-bold uppercase tracking-luxury px-2.5 py-1 rounded-none shadow-md border border-gold/20">
                    {prod.specifications.grade}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-luxury text-gold/80 font-bold">{prod.scientificName}</span>
                    <h3 
                      onClick={() => handleProductClick(prod)}
                      className="text-base font-serif font-bold text-forest mt-1 hover:text-gold cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-charcoal/55 line-clamp-2 leading-relaxed font-light mt-1">
                      {prod.description}
                    </p>
                  </div>

                  {/* Pricing and quick add */}
                  <div className="flex items-center justify-between pt-4 border-t border-gold/10 mt-3">
                    <span className="text-base font-serif font-bold text-forest">${prod.price.toFixed(2)}</span>
                    <button
                      id={`btn-wishlist-add-${prod.id}`}
                      onClick={() => {
                        addToCart(prod, 1);
                        toggleWishlist(prod); // remove from wishlist on quick transfer
                      }}
                      className="flex items-center gap-1 bg-forest hover:bg-gold text-white hover:text-forest px-4 py-2 rounded-none text-[10px] uppercase tracking-luxury font-bold transition-all border border-forest hover:border-gold cursor-pointer"
                    >
                      <ShoppingCart size={11} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
