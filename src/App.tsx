import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import AISommelierView from './components/AISommelierView';
import AboutView from './components/AboutView';
import SustainabilityView from './components/SustainabilityView';
import RecipesView from './components/RecipesView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import CartView from './components/CartView';
import WishlistView from './components/WishlistView';
import { Product, CartItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart Local Storage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ceyvana_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist Local Storage Persistence
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ceyvana_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('ceyvana_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    localStorage.setItem('ceyvana_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('shop');
  };

  return (
    <div id="ceyvana-app-root" className="min-h-screen bg-ivory text-charcoal flex flex-col justify-between selection:bg-gold selection:text-forest">
      
      {/* Permanent Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cart={cart}
        wishlist={wishlist}
        onSearch={handleSearch}
      />

      {/* Main Content Sections Routing */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <div className="animate-fade-in">
            <Hero setCurrentTab={setCurrentTab} />
            <HomeView
              setCurrentTab={setCurrentTab}
              setSelectedProduct={setSelectedProduct}
              cart={cart}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          </div>
        )}

        {currentTab === 'shop' && (
          <div className="animate-fade-in">
            <ShopView
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              setSelectedProduct={setSelectedProduct}
              setCurrentTab={setCurrentTab}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {currentTab === 'product-detail' && selectedProduct && (
          <div className="animate-fade-in">
            <ProductDetailView
              product={selectedProduct}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              setCurrentTab={setCurrentTab}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        )}

        {currentTab === 'sommelier' && (
          <div className="animate-fade-in">
            <AISommelierView
              addToCart={addToCart}
              cart={cart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          </div>
        )}

        {currentTab === 'recipes' && (
          <div className="animate-fade-in">
            <RecipesView
              addToCart={addToCart}
              setCurrentTab={setCurrentTab}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        )}

        {currentTab === 'about' && (
          <div className="animate-fade-in">
            <AboutView />
          </div>
        )}

        {currentTab === 'sustainability' && (
          <div className="animate-fade-in">
            <SustainabilityView />
          </div>
        )}

        {currentTab === 'blog' && (
          <div className="animate-fade-in">
            <BlogView />
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="animate-fade-in">
            <ContactView />
          </div>
        )}

        {currentTab === 'cart' && (
          <div className="animate-fade-in">
            <CartView
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
              setCurrentTab={setCurrentTab}
            />
          </div>
        )}

        {currentTab === 'wishlist' && (
          <div className="animate-fade-in">
            <WishlistView
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
              setCurrentTab={setCurrentTab}
            />
          </div>
        )}
      </main>

      {/* Permanent Footer */}
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}
