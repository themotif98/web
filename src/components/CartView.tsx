import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, ShieldCheck, Heart, ArrowRight, Check, Sparkles, 
  CreditCard, Gift, HelpCircle, Download, Landmark, Wallet, Percent, 
  Calendar, Truck, User, Info, RefreshCw, XCircle, AlertTriangle, Printer, Lock 
} from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartViewProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrentTab: (tab: string) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', rate: 0.78, label: 'GBP (£)' },
  { code: 'AUD', symbol: 'A$', rate: 1.50, label: 'AUD (A$)' },
  { code: 'CAD', symbol: 'C$', rate: 1.36, label: 'CAD (C$)' },
  { code: 'SGD', symbol: 'S$', rate: 1.34, label: 'SGD (S$)' },
  { code: 'JPY', symbol: '¥', rate: 155.0, label: 'JPY (¥)' },
  { code: 'LKR', symbol: 'Rs', rate: 300.0, label: 'LKR (Rs)' },
];

const TAX_RATES: { [key: string]: number } = {
  'United States': 0.08,
  'United Kingdom': 0.15,
  'Germany': 0.19,
  'France': 0.20,
  'Canada': 0.12,
  'Australia': 0.10,
  'Singapore': 0.09,
  'Japan': 0.10,
  'Sri Lanka': 0.10,
  'Default': 0.12,
};

export default function CartView({
  cart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCurrentTab,
}: CartViewProps) {
  // Global Currency State
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('ceyvana_currency') || 'USD';
  });

  // Save selected currency to local storage
  useEffect(() => {
    localStorage.setItem('ceyvana_currency', currency);
  }, [currency]);

  // Current currency configuration
  const currentCurrencyConfig = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  // Helper to format price dynamically based on currency
  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * currentCurrencyConfig.rate;
    if (currentCurrencyConfig.code === 'JPY' || currentCurrencyConfig.code === 'LKR') {
      return `${currentCurrencyConfig.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrencyConfig.symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Checkout Mode: Guest Checkout vs Member/Account
  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'account'>('guest');
  const [isAccountRegistered, setIsAccountRegistered] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Voucher Coupon & Gift Card states
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardValue, setGiftCardValue] = useState(0); // in USD
  const [giftCardError, setGiftCardError] = useState('');
  const [giftCardSuccess, setGiftCardSuccess] = useState('');

  // Gift wrapping choice
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Shipping choices
  const [shippingType, setShippingType] = useState<'standard' | 'express'>('express');

  // Checkout state steps
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'billing' | 'receipt'>('cart');

  // Billing address and credit card states
  const [billingData, setBillingData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    phone: '',
    companyName: '',
    taxId: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    savePaymentMethod: false,
    orderNotes: '',
  });

  // Payment Method Category: card, wallet, bnpl, b2b
  const [paymentType, setPaymentType] = useState<'card' | 'wallet' | 'bnpl' | 'b2b'>('card');
  const [selectedWallet, setSelectedWallet] = useState<'apple' | 'google' | 'paypal' | 'shop'>('apple');
  const [selectedBnpl, setSelectedBnpl] = useState<'klarna' | 'afterpay' | 'affirm'>('klarna');

  // Interactive Payment simulation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isVerifying3D, setIsVerifying3D] = useState(false);
  const [smsVerificationCode, setSmsVerificationCode] = useState('');
  const [smsError, setSmsError] = useState('');

  // Generated receipt states
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [trackingStep, setTrackingStep] = useState<number>(1); // Tracking simulator state
  const [estimatedDeliveryStr, setEstimatedDeliveryStr] = useState('');

  // Refund / Cancellation States
  const [refundStatus, setRefundStatus] = useState<'none' | 'processing' | 'refunded'>('none');
  const [refundReason, setRefundReason] = useState('Estate Sourcing Adjustment');
  const [cancellationStatus, setCancellationStatus] = useState<'none' | 'processing' | 'cancelled'>('none');
  const [cancellationReason, setCancellationReason] = useState('Changed My Mind');
  const [creditNoteId, setCreditNoteId] = useState('');

  // Subtotal in USD
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Apply Coupon Logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.toUpperCase().trim();
    
    if (code === 'CEYVANACIRCLE') {
      setDiscountPercent(10);
      setCouponSuccess('10% Circle Patron Voucher Applied!');
    } else if (code === 'WELCOME15') {
      setDiscountPercent(15);
      setCouponSuccess('15% First-time Welcome Voucher Applied!');
    } else if (code === 'ROYALSPICE') {
      setDiscountPercent(20);
      setCouponSuccess('20% Royal Estate Sourcing Discount Applied!');
    } else if (code === '') {
      setCouponError('Please enter a voucher code.');
    } else {
      setCouponError('Invalid voucher. Try WELCOME15, CEYVANACIRCLE, or ROYALSPICE.');
    }
  };

  // Apply Gift Card Logic
  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    setGiftCardError('');
    setGiftCardSuccess('');
    const code = giftCardCode.toUpperCase().trim();

    if (code === 'GIFTCARD50') {
      setGiftCardValue(50.00); // $50 flat
      setGiftCardSuccess('Sovereign Gift Card Applied ($50 USD value converted)!');
    } else if (code === '') {
      setGiftCardError('Please enter a gift card code.');
    } else {
      setGiftCardError('Invalid gift card number. Try GIFTCARD50 for $50 value.');
    }
  };

  // Simulate Member Login
  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setBillingData(prev => ({
        ...prev,
        fullName: 'Viscount Wellesley',
        email: loginEmail,
        address: 'Wellesley Hall, 14 Sovereign Lane',
        city: 'Kandy',
        zip: '20000',
        country: 'Sri Lanka',
        phone: '+94 81 223 4567',
        companyName: 'Wellesley Botanical Imports LLC',
        taxId: 'LK-VAT-992348A',
      }));
    }
  };

  // Simulated Account Creation
  const handleRegisterAccount = () => {
    if (billingData.email && accountPassword) {
      setIsAccountRegistered(true);
      setIsLoggedIn(true);
    }
  };

  // Dynamic calculations in USD
  const giftCost = isGiftWrapped ? 15.00 : 0.00;
  const couponDiscountCost = subtotal * (discountPercent / 100);
  const totalDiscountVal = couponDiscountCost + giftCardValue;
  const taxableAmount = Math.max(0, subtotal - totalDiscountVal);
  
  // Tax rate depends on billing country
  const selectedCountry = billingData.country || 'United States';
  const taxRate = TAX_RATES[selectedCountry] !== undefined ? TAX_RATES[selectedCountry] : TAX_RATES['Default'];
  const taxCost = taxableAmount * taxRate;

  // Shipping cost: complimentary if express over $150 USD, standard is free
  const shippingCost = shippingType === 'express' ? (subtotal > 150 ? 0.00 : 15.00) : 0.00;

  // Grand total in USD
  const grandTotalUSD = Math.max(0, subtotal - totalDiscountVal + giftCost + shippingCost + taxCost);

  // Dynamic Delivery Date calculations based on local time
  useEffect(() => {
    const today = new Date();
    const standardMin = new Date();
    standardMin.setDate(today.getDate() + 7);
    const standardMax = new Date();
    standardMax.setDate(today.getDate() + 12);

    const expressMin = new Date();
    expressMin.setDate(today.getDate() + 3);
    const expressMax = new Date();
    expressMax.setDate(today.getDate() + 5);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    if (shippingType === 'express') {
      setEstimatedDeliveryStr(`${expressMin.toLocaleDateString('en-US', options)} - ${expressMax.toLocaleDateString('en-US', options)} (DHL Priority Air Freight)`);
    } else {
      setEstimatedDeliveryStr(`${standardMin.toLocaleDateString('en-US', options)} - ${standardMax.toLocaleDateString('en-US', options)} (Global Cargo Freight)`);
    }
  }, [shippingType]);

  // Handle Form Submission / Initiate Checkout
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentType === 'card') {
      // Visa, Mastercard, American Express, Discover, UnionPay validation simulated
      setProcessingMessage('Handshaking with PCI DSS secure servers & performing SSL key tokenization...');
      setTimeout(() => {
        setProcessingMessage('Analyzing transaction with automated fraud prevention matrix...');
        setTimeout(() => {
          setIsProcessing(false);
          setIsVerifying3D(true); // Open the 3D Secure simulator modal!
        }, 1500);
      }, 1500);
    } else if (paymentType === 'wallet') {
      // Wallet payment (Apple Pay, Google Pay, PayPal, Shop Pay)
      setProcessingMessage(`Connecting securely to ${selectedWallet.toUpperCase()} PAY portal...`);
      setTimeout(() => {
        setProcessingMessage('Awaiting tokenized biometric confirmation from client...');
        setTimeout(() => {
          setIsProcessing(false);
          // Auto approve wallet
          finalizeOrder();
        }, 1500);
      }, 1500);
    } else if (paymentType === 'bnpl') {
      // Klarna, Afterpay, Affirm
      setProcessingMessage(`Redirecting to ${selectedBnpl.toUpperCase()} secure billing ledger...`);
      setTimeout(() => {
        setProcessingMessage('Generating micro-credit installment amortization table...');
        setTimeout(() => {
          setIsProcessing(false);
          finalizeOrder();
        }, 1500);
      }, 1500);
    } else {
      // Wise or Bank Transfer
      setProcessingMessage('Validating SWIFT/BIC routing credentials and corporate invoice request...');
      setTimeout(() => {
        setIsProcessing(false);
        finalizeOrder();
      }, 1800);
    }
  };

  // Submit 3D Secure passcode
  const handleVerify3DSecure = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsError('');
    if (smsVerificationCode === '1234' || smsVerificationCode === '') {
      setIsVerifying3D(false);
      finalizeOrder();
    } else {
      setSmsError('Invalid verification code. Enter "1234" or click Quick Approve.');
    }
  };

  // Finalize Order success
  const finalizeOrder = () => {
    const generatedId = `CEY-${Math.floor(Math.random() * 900000) + 100000}-${new Date().getFullYear()}`;
    const generatedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    setOrderId(generatedId);
    setOrderDate(generatedDate);
    setTrackingStep(1); // Reset tracking simulator to "Order Received"
    setRefundStatus('none');
    setCancellationStatus('none');
    setCheckoutStep('receipt');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Return Home & clean state
  const handleFinish = () => {
    clearCart();
    setCurrentTab('home');
    window.scrollTo(0, 0);
  };

  // Trigger browser print
  const handlePrintInvoice = () => {
    window.print();
  };

  // Generate and Trigger dynamic TXT Invoice download file
  const handleDownloadInvoice = () => {
    const formattedSubtotal = formatPrice(subtotal);
    const formattedTax = formatPrice(taxCost);
    const formattedShipping = formatPrice(shippingCost);
    const formattedDiscount = formatPrice(totalDiscountVal);
    const formattedTotal = formatPrice(grandTotalUSD);
    const matchedCurConfig = currentCurrencyConfig;

    const invoiceContent = `=====================================================
                    CEYVANA BOTANICALS
        Sovereign Spice Estates of Ceylon Flagship HQ
=====================================================
INVOICE RECEIPT REFERENCE: ${orderId}
DATE OF AUTHORIZATION: ${orderDate}
PAYMENT MECHANISM: ${paymentType.toUpperCase()} (${paymentType === 'card' ? 'PCI Credit Card' : paymentType === 'wallet' ? selectedWallet : paymentType === 'bnpl' ? selectedBnpl : 'Bank Wire'})
CURRENCY DESIGNATION: ${matchedCurConfig.code} (${matchedCurConfig.symbol})
-----------------------------------------------------
CONSIGNEE SHIPMENT COORDINATES:
Name:    ${billingData.fullName || 'Guest Custodian'}
Email:   ${billingData.email || 'customer@ceyvana.com'}
Phone:   ${billingData.phone || 'N/A'}
Address: ${billingData.address || 'Colombo Port Authority HQ'}
City:    ${billingData.city || 'Colombo'}
Country: ${billingData.country || 'Sri Lanka'}
Zip:     ${billingData.zip || '00100'}
${billingData.companyName ? `Company: ${billingData.companyName}` : ''}
${billingData.taxId ? `Tax ID:  ${billingData.taxId}` : ''}
-----------------------------------------------------
PURCHASED BOTANICAL LINES:
${cart.map((item, idx) => `${idx + 1}. ${item.product.name} [${item.product.specifications.grade}] (Qty: ${item.quantity}) - ${formatPrice(item.product.price * item.quantity)}`).join('\n')}
${isGiftWrapped ? `* Moratuwa Woodcraft Artisan Gifting Chest - ${formatPrice(15.00)}` : ''}
-----------------------------------------------------
FINANCIAL BREAKDOWN:
Items Subtotal:        ${formattedSubtotal}
Promo & Gift Discount: -${formattedDiscount}
Dynamic VAT/Import tax: ${formattedTax} (Based on ${billingData.country})
Carrier Logistics:     ${formattedShipping} (${shippingType === 'express' ? 'DHL priority Express' : 'Standard Ocean Cargo'})
-----------------------------------------------------
GRAND CONSOLIDATED TOTAL: ${formattedTotal}
-----------------------------------------------------
ESTIMATED DELIVERY PORT DATE: ${estimatedDeliveryStr}
TRACKING REFERENCE: CEY-DHL-${orderId.split('-')[1]}
=====================================================
SSL SECURE TRANSACTION GUARANTEED. 3D SECURED STACK.
Ceyvana Botanicals Colombo, Sri Lanka.
=====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ceyvana-invoice-${orderId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate Carriage / Tracking Status Update
  const advanceTrackingStep = () => {
    if (trackingStep < 5) {
      setTrackingStep(prev => prev + 1);
    } else {
      setTrackingStep(1); // Loop back
    }
  };

  // Refund simulation
  const handleInitiateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    setRefundStatus('processing');
    setTimeout(() => {
      setRefundStatus('refunded');
      setCreditNoteId(`CEY-CRN-${Math.floor(Math.random() * 90000) + 10000}-${new Date().getFullYear()}`);
    }, 1500);
  };

  // Cancellation simulation
  const handleInitiateCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    setCancellationStatus('processing');
    setTimeout(() => {
      setCancellationStatus('cancelled');
      setCreditNoteId(`CEY-CCN-${Math.floor(Math.random() * 90000) + 10000}-${new Date().getFullYear()}`);
      setTrackingStep(5); // Mark as complete/cancelled in simulator
    }, 1500);
  };

  return (
    <div id="cart-view-container" className="font-sans min-h-screen bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top bar with Currency Converter Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gold/15 pb-6">
          <div className="space-y-1">
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-forest">Sovereign Checkout & Bag</h1>
            <p className="text-xs text-charcoal/50 leading-relaxed">
              Verify your single-estate botanical lines, set secure shipping speeds, and configure global currency settlements.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-2.5 border border-gold/15 shadow-sm rounded-none">
            <span className="text-[10px] uppercase tracking-luxury font-bold text-forest flex items-center gap-1">
              Settlement Currency:
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-ivory border border-gold/10 font-mono text-xs text-forest font-bold p-1 focus:outline-none"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>{curr.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center space-x-6 text-xs uppercase tracking-luxury font-bold text-charcoal/40 max-w-lg mx-auto border-b border-gold/10 pb-4">
          <span className={checkoutStep === 'cart' ? 'text-forest' : 'text-charcoal/40'}>01. Shopping Bag</span>
          <span className="text-gold/30">→</span>
          <span className={checkoutStep === 'billing' ? 'text-forest' : 'text-charcoal/40'}>02. Secure Checkout</span>
          <span className="text-gold/30">→</span>
          <span className={checkoutStep === 'receipt' ? 'text-forest' : 'text-charcoal/40'}>03. Royal Receipt</span>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: CART OVERVIEW */}
          {checkoutStep === 'cart' && (
            <motion.div
              key="cart-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-none border border-gold/15 shadow-sm space-y-4 max-w-md mx-auto">
                  <ShoppingBag className="text-gold mx-auto" size={48} />
                  <h2 className="font-serif font-bold text-xl text-forest">Your Bag is Empty</h2>
                  <p className="text-xs text-charcoal/50 leading-relaxed max-w-xs mx-auto">
                    You have not added any single estate spice lines to your collection yet.
                  </p>
                  <button
                    onClick={() => setCurrentTab('shop')}
                    className="bg-forest hover:bg-gold text-white hover:text-forest px-8 py-3.5 rounded-none text-xs uppercase tracking-luxury font-bold transition-all border border-forest hover:border-gold shadow cursor-pointer"
                  >
                    Explore Boutique
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Cart Table (Col 8) */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Items table */}
                    <div className="bg-white rounded-none border border-gold/15 shadow-md p-6 space-y-6">
                      <h2 className="font-serif font-bold text-xl text-forest border-b border-gold/10 pb-3">Shopping Bag Items</h2>
                      
                      <div className="divide-y divide-gold/10 text-xs leading-relaxed">
                        {cart.map((item) => (
                          <div key={item.product.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0">
                            
                            {/* Product Info thumbnail */}
                            <div className="flex items-center gap-4">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-none border border-gold/10" />
                              <div className="text-left space-y-0.5">
                                <span className="text-[9px] uppercase tracking-luxury text-gold">{item.product.scientificName}</span>
                                <h3 className="font-serif font-bold text-forest text-sm">{item.product.name}</h3>
                                <span className="block text-[10px] text-charcoal/40 uppercase tracking-luxury font-mono">{item.product.specifications.grade}</span>
                              </div>
                            </div>

                            {/* Quantity & subtotal controls */}
                            <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                              
                              {/* Quantity selectors */}
                              <div className="flex items-center border border-gold/20 rounded-none bg-ivory px-3 py-1">
                                <button
                                  onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="text-forest hover:text-gold px-1 font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs text-forest font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="text-forest hover:text-gold px-1 font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <span className="block font-serif font-bold text-forest text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                                <span className="text-[9px] text-charcoal/40 font-light">{formatPrice(item.product.price)} each</span>
                              </div>

                              {/* Remove */}
                              <button
                                id={`btn-cart-remove-${item.product.id}`}
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-2 text-charcoal/30 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>

                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upgrades panel: gift wrapping */}
                    <div className="bg-white rounded-none border border-gold/15 shadow-sm p-6 space-y-4">
                      <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                        <Gift className="text-gold" size={18} />
                        <h3 className="font-serif font-bold text-lg text-forest">Bespoke Gifting Upgrades</h3>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs leading-relaxed">
                        <div className="space-y-0.5 max-w-md">
                          <strong className="text-forest uppercase text-[10px]">Woodcraft Heirloom Spice Chest Wrap (+ {formatPrice(15.00)})</strong>
                          <p className="text-charcoal/50 font-light">
                            Each spice is wrapped inside an upcycled Ceylon tea-wood chest hand-carved by local artisans, lined with natural silk and direct harvest tags.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsGiftWrapped(!isGiftWrapped)}
                          className={`px-5 py-2.5 text-[10px] uppercase tracking-luxury font-bold rounded-none transition-colors cursor-pointer ${isGiftWrapped ? 'bg-gold text-forest font-bold' : 'border border-gold text-gold hover:bg-gold/10'}`}
                        >
                          {isGiftWrapped ? '✔ Added wrap' : 'Add custom wrap'}
                        </button>
                      </div>

                      {isGiftWrapped && (
                        <div className="space-y-1.5 pt-2 animate-fade-in text-xs">
                          <label className="font-bold text-forest uppercase block">Gift Card Message (Included)</label>
                          <textarea
                            rows={2}
                            placeholder="Type your warm culinary greetings..."
                            value={giftNote}
                            onChange={(e) => setGiftNote(e.target.value)}
                            className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                          />
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Summary Sidebar (Col 4) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Voucher Coupon code */}
                    <div className="bg-white p-5 rounded-none border border-gold/15 shadow-sm space-y-4 text-xs">
                      <div>
                        <h4 className="font-serif font-bold text-base text-forest uppercase text-[11px] tracking-luxury flex items-center gap-1">
                          <Percent size={12} className="text-gold" />
                          <span>Promotion Vouchers</span>
                        </h4>
                        <form onSubmit={handleApplyCoupon} className="flex border-b border-gold/15 pb-2 mt-2">
                          <input
                            type="text"
                            placeholder="Voucher (e.g. WELCOME15, ROYALSPICE)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="bg-transparent border-none text-xs text-charcoal focus:outline-none w-full placeholder-charcoal/30 font-mono uppercase"
                          />
                          <button type="submit" className="text-gold hover:text-forest transition-colors font-bold uppercase tracking-luxury text-[10px] shrink-0">
                            Apply
                          </button>
                        </form>
                        {couponError && <p className="text-red-600 text-[10px] mt-1">{couponError}</p>}
                        {couponSuccess && <p className="text-green-700 text-[10px] font-bold mt-1">{couponSuccess}</p>}
                      </div>

                      {/* Gift Cards */}
                      <div className="border-t border-gold/5 pt-3">
                        <h4 className="font-serif font-bold text-base text-forest uppercase text-[11px] tracking-luxury flex items-center gap-1">
                          <Gift size={12} className="text-gold" />
                          <span>Gift Card Balance</span>
                        </h4>
                        <form onSubmit={handleApplyGiftCard} className="flex border-b border-gold/15 pb-2 mt-2">
                          <input
                            type="text"
                            placeholder="Gift Card (e.g. GIFTCARD50)"
                            value={giftCardCode}
                            onChange={(e) => setGiftCardCode(e.target.value)}
                            className="bg-transparent border-none text-xs text-charcoal focus:outline-none w-full placeholder-charcoal/30 font-mono uppercase"
                          />
                          <button type="submit" className="text-gold hover:text-forest transition-colors font-bold uppercase tracking-luxury text-[10px] shrink-0">
                            Redeem
                          </button>
                        </form>
                        {giftCardError && <p className="text-red-600 text-[10px] mt-1">{giftCardError}</p>}
                        {giftCardSuccess && <p className="text-green-700 text-[10px] font-bold mt-1">{giftCardSuccess}</p>}
                      </div>
                    </div>

                    {/* Summary card */}
                    <div className="bg-white p-6 rounded-none border border-gold/15 shadow-md space-y-4 text-xs leading-relaxed">
                      <h4 className="font-serif font-bold text-lg text-forest border-b border-gold/10 pb-2">Bag Summary</h4>
                      
                      <div className="space-y-2.5 text-charcoal/70">
                        <div className="flex justify-between">
                          <span>Items Subtotal</span>
                          <span className="font-bold text-forest">{formatPrice(subtotal)}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-green-700 font-bold">
                            <span>Voucher Discount ({discountPercent}%)</span>
                            <span>-{formatPrice(couponDiscountCost)}</span>
                          </div>
                        )}
                        {giftCardValue > 0 && (
                          <div className="flex justify-between text-green-700 font-bold">
                            <span>Gift Card Balance Applied</span>
                            <span>-{formatPrice(giftCardValue)}</span>
                          </div>
                        )}
                        {isGiftWrapped && (
                          <div className="flex justify-between">
                            <span>Moratuwa Woodcraft Wrap</span>
                            <span>+{formatPrice(15.00)}</span>
                          </div>
                        )}
                        
                        {/* Shipping */}
                        <div className="border-t border-gold/5 pt-2 space-y-2">
                          <span className="font-bold text-forest block uppercase text-[10px] tracking-luxury flex items-center gap-1">
                            <Truck size={12} className="text-gold" />
                            <span>Logistics Level</span>
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 cursor-pointer bg-ivory p-2 rounded-none border border-gold/15">
                              <input
                                type="radio"
                                checked={shippingType === 'standard'}
                                onChange={() => setShippingType('standard')}
                                className="accent-gold"
                              />
                              <div className="text-[10px] leading-tight">
                                <span className="font-bold text-forest block">Standard Cargo</span>
                                <span className="text-charcoal/40 font-light">Free (7-12 days)</span>
                              </div>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer bg-ivory p-2 rounded-none border border-gold/15">
                              <input
                                type="radio"
                                checked={shippingType === 'express'}
                                onChange={() => setShippingType('express')}
                                className="accent-gold"
                              />
                              <div className="text-[10px] leading-tight">
                                <span className="font-bold text-forest block">Express Freight</span>
                                <span className="text-charcoal/40 font-light">{subtotal > 150 ? 'Complimentary' : `${formatPrice(15.00)} (3-5 days)`}</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-between border-t border-gold/5 pt-2">
                          <span className="flex items-center gap-1">
                            Duties & Taxes (Dynamic)
                            <HelpCircle size={10} className="text-gold" title="Recalculated dynamically depending on destination country select." />
                          </span>
                          <span>{formatPrice(taxCost)}</span>
                        </div>

                        <div className="text-[10px] bg-ivory p-2 border border-gold/10 text-charcoal/60 leading-normal flex items-center gap-1">
                          <Calendar size={12} className="text-gold shrink-0" />
                          <span>Estimated delivery: <strong>{estimatedDeliveryStr}</strong></span>
                        </div>

                      </div>

                      {/* Total cost */}
                      <div className="flex justify-between border-t border-gold/15 pt-3 text-sm">
                        <span className="font-serif font-bold text-forest text-base uppercase">Total Balance</span>
                        <span className="font-serif font-bold text-gold text-lg">{formatPrice(grandTotalUSD)}</span>
                      </div>

                      <button
                        id="btn-goto-checkout"
                        onClick={() => setCheckoutStep('billing')}
                        className="w-full py-4 bg-forest hover:bg-gold text-white hover:text-forest text-xs uppercase tracking-luxury font-bold rounded-none transition-all shadow shadow-forest/10 flex items-center justify-center gap-1.5 border border-forest hover:border-gold cursor-pointer"
                      >
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight size={12} />
                      </button>

                    </div>

                    {/* Trust indicators & Badges */}
                    <div className="bg-white p-5 border border-gold/15 space-y-3.5 text-[11px] text-charcoal/70">
                      <h4 className="font-serif font-bold text-forest uppercase tracking-luxury text-center border-b border-gold/10 pb-1.5">Trusted Sovereign Checkout</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <Lock className="text-gold shrink-0" size={14} />
                          <div>
                            <strong className="block text-[10px] uppercase text-forest">SSL Secure Terminal</strong>
                            <span className="text-charcoal/40 text-[9px]">256-Bit military transport encryption keys</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="text-gold shrink-0" size={14} />
                          <div>
                            <strong className="block text-[10px] uppercase text-forest">PCI DSS Compliant</strong>
                            <span className="text-charcoal/40 text-[9px]">Tokenized vaults protect client records</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sparkles className="text-gold shrink-0" size={14} />
                          <div>
                            <strong className="block text-[10px] uppercase text-forest">Direct Estate Sourcing</strong>
                            <span className="text-charcoal/40 text-[9px]">Empowering Sri Lankan agro-cooperatives</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="text-gold shrink-0" size={14} />
                          <div>
                            <strong className="block text-[10px] uppercase text-forest">30-Day Guarantee</strong>
                            <span className="text-charcoal/40 text-[9px]">Money-back return on seal intact lines</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: SECURE CHECKOUT BILLING */}
          {checkoutStep === 'billing' && (
            <motion.div
              key="billing-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Checkout Left Column */}
              <div className="lg:col-span-8 bg-white p-8 rounded-none border border-gold/15 shadow-lg space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/10 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-forest flex items-center gap-1.5">
                      <Lock size={18} className="text-gold animate-pulse" />
                      <span>Sovereign Transaction Vault</span>
                    </h3>
                    <p className="text-[10px] text-charcoal/40 mt-0.5">Secure PCI-compliant multi-option terminal</p>
                  </div>
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs uppercase tracking-luxury text-gold hover:text-forest font-bold cursor-pointer"
                  >
                    ← Edit Bag & Currencies
                  </button>
                </div>

                {/* Checkout Mode Toggle - Guest vs Customer Account Checkout */}
                <div className="bg-ivory p-4 border border-gold/15 space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                    <span className="text-[10px] uppercase tracking-luxury font-bold text-forest flex items-center gap-1">
                      <User size={12} className="text-gold" />
                      <span>Checkout Method Preference</span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setCheckoutMode('guest'); setIsLoggedIn(false); }}
                        className={`px-3 py-1 text-[9px] uppercase tracking-luxury font-bold border transition-colors ${checkoutMode === 'guest' && !isLoggedIn ? 'bg-forest text-gold border-forest' : 'bg-white border-gold/15 text-charcoal hover:bg-gold/5'}`}
                      >
                        Guest Checkout
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutMode('account')}
                        className={`px-3 py-1 text-[9px] uppercase tracking-luxury font-bold border transition-colors ${checkoutMode === 'account' || isLoggedIn ? 'bg-forest text-gold border-forest' : 'bg-white border-gold/15 text-charcoal hover:bg-gold/5'}`}
                      >
                        Patron Account
                      </button>
                    </div>
                  </div>

                  {checkoutMode === 'account' && !isLoggedIn && (
                    <form onSubmit={handleSimulatedLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end animate-fade-in text-xs">
                      <div>
                        <label className="font-bold text-forest uppercase text-[9px] block mb-1">Patron Registered Email</label>
                        <input
                          type="email"
                          required
                          placeholder="victoria@royal.co"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full p-2 bg-white border border-gold/15 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-forest uppercase text-[9px] block mb-1">Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full p-2 bg-white border border-gold/15 text-xs focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="py-2.5 bg-forest hover:bg-gold text-white hover:text-forest text-[10px] uppercase tracking-luxury font-bold transition-all border border-forest hover:border-gold cursor-pointer"
                      >
                        Authorize & Autofill
                      </button>
                    </form>
                  )}

                  {isLoggedIn && (
                    <div className="bg-green-50 p-3 border border-green-200 text-[11px] text-green-800 flex items-center justify-between">
                      <span>✔ Authenticated: Welcome back, <strong>Viscount Wellesley</strong>. Delivery details autofilled.</span>
                      <button
                        type="button"
                        onClick={() => { setIsLoggedIn(false); setCheckoutMode('guest'); }}
                        className="text-[9px] underline uppercase font-bold text-green-900"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleInitiatePayment} className="space-y-6 text-xs text-charcoal leading-relaxed">
                  
                  {/* Delivery Info */}
                  <div className="space-y-3.5">
                    <h4 className="font-bold text-forest uppercase border-b border-gold/15 pb-1 block text-[10px] tracking-luxury">01. Consignee Delivery Address</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Consignee Full Name</label>
                        <input
                          type="text" required placeholder="Viscount Wellesley"
                          value={billingData.fullName} onChange={(e) => setBillingData({...billingData, fullName: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Contact Email</label>
                        <input
                          type="email" required placeholder="victoria@royal.co"
                          value={billingData.email} onChange={(e) => setBillingData({...billingData, email: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Street Address</label>
                        <input
                          type="text" required placeholder="Apt 4B, 10 Downing Street"
                          value={billingData.address} onChange={(e) => setBillingData({...billingData, address: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Phone (For Carrier Logistics)</label>
                        <input
                          type="text" placeholder="+1 (555) 019-2834"
                          value={billingData.phone} onChange={(e) => setBillingData({...billingData, phone: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">City</label>
                        <input
                          type="text" required placeholder="London"
                          value={billingData.city} onChange={(e) => setBillingData({...billingData, city: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Zip / Postcode</label>
                        <input
                          type="text" required placeholder="SW1A 2AA"
                          value={billingData.zip} onChange={(e) => setBillingData({...billingData, zip: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-forest uppercase">Country (Affects Dynamic VAT)</label>
                        <select
                          value={billingData.country}
                          onChange={(e) => setBillingData({...billingData, country: e.target.value})}
                          className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none font-medium"
                        >
                          <option value="United States">United States (8% Tax)</option>
                          <option value="United Kingdom">United Kingdom (15% VAT)</option>
                          <option value="Germany">Germany (19% VAT)</option>
                          <option value="France">France (20% VAT)</option>
                          <option value="Canada">Canada (12% Tax)</option>
                          <option value="Australia">Australia (10% GST)</option>
                          <option value="Singapore">Singapore (9% GST)</option>
                          <option value="Japan">Japan (10% Consumption Tax)</option>
                          <option value="Sri Lanka">Sri Lanka (10% VAT)</option>
                        </select>
                      </div>
                    </div>

                    {/* Guest registration prompt */}
                    {checkoutMode === 'guest' && !isLoggedIn && (
                      <div className="bg-ivory p-3.5 border border-gold/10 space-y-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAccountRegistered}
                            onChange={(e) => setIsAccountRegistered(e.target.checked)}
                            className="accent-gold"
                          />
                          <span className="font-bold text-forest uppercase text-[10px]">Create Ceyvana Patron Account during guest checkout</span>
                        </label>
                        {isAccountRegistered && (
                          <div className="grid grid-cols-2 gap-3 pt-1 animate-fade-in">
                            <input
                              type="password"
                              placeholder="Choose Secret Password"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              className="p-2 bg-white border border-gold/15 focus:outline-none text-xs"
                            />
                            <button
                              type="button"
                              onClick={handleRegisterAccount}
                              className="bg-forest text-gold text-[9px] uppercase font-bold px-4 hover:bg-gold hover:text-forest transition-colors cursor-pointer"
                            >
                              Register Credentials
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Wholesale/B2B options */}
                    <div className="bg-ivory p-3 border border-gold/10 rounded-none space-y-2.5">
                      <span className="text-[10px] uppercase font-bold text-forest block tracking-luxury border-b border-gold/5 pb-1">
                        Corporate Wholesale / Bulk Invoice Details (Optional)
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-forest/70 uppercase text-[9px]">Organization/Co-op Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Royal Botanical Imports Ltd"
                            value={billingData.companyName}
                            onChange={(e) => setBillingData({...billingData, companyName: e.target.value})}
                            className="w-full p-2 bg-white border border-gold/10 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-forest/70 uppercase text-[9px]">Corporate Tax / VAT Registration ID</label>
                          <input
                            type="text"
                            placeholder="e.g. EU-VAT-1234567"
                            value={billingData.taxId}
                            onChange={(e) => setBillingData({...billingData, taxId: e.target.value})}
                            className="w-full p-2 bg-white border border-gold/10 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Special Delivery Order Notes */}
                    <div className="space-y-1">
                      <label className="font-bold text-forest uppercase">Special Carriage Instructions / Order Notes</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Please instruct the customs broker that this represents culinary-grade whole spices..."
                        value={billingData.orderNotes}
                        onChange={(e) => setBillingData({...billingData, orderNotes: e.target.value})}
                        className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector Grid */}
                  <div className="space-y-4 pt-4 border-t border-gold/10">
                    <div>
                      <h4 className="font-bold text-forest uppercase block text-[10px] tracking-luxury">02. Select Trusted Settlement Gateway</h4>
                      <p className="text-[10px] text-charcoal/40">Select your preferred payment processor</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType('card')}
                        className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${paymentType === 'card' ? 'bg-forest border-gold text-gold shadow-md' : 'bg-ivory border-gold/15 text-charcoal hover:border-gold/40'}`}
                      >
                        <CreditCard size={18} />
                        <span className="font-bold uppercase text-[9px] tracking-wider">Credit / Debit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('wallet')}
                        className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${paymentType === 'wallet' ? 'bg-forest border-gold text-gold shadow-md' : 'bg-ivory border-gold/15 text-charcoal hover:border-gold/40'}`}
                      >
                        <Wallet size={18} />
                        <span className="font-bold uppercase text-[9px] tracking-wider">Digital Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('bnpl')}
                        className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${paymentType === 'bnpl' ? 'bg-forest border-gold text-gold shadow-md' : 'bg-ivory border-gold/15 text-charcoal hover:border-gold/40'}`}
                      >
                        <Percent size={18} />
                        <span className="font-bold uppercase text-[9px] tracking-wider">Buy Now Pay Later</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('b2b')}
                        className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${paymentType === 'b2b' ? 'bg-forest border-gold text-gold shadow-md' : 'bg-ivory border-gold/15 text-charcoal hover:border-gold/40'}`}
                      >
                        <Landmark size={18} />
                        <span className="font-bold uppercase text-[9px] tracking-wider">Wise & Bank Wire</span>
                      </button>
                    </div>

                    {/* Subform based on payment gateway */}
                    <div className="bg-ivory p-5 border border-gold/15 min-h-[140px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        
                        {/* CARD SUBFORM */}
                        {paymentType === 'card' && (
                          <motion.div
                            key="card-subform"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 text-xs"
                          >
                            <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                              <span className="font-bold text-forest uppercase text-[9px] tracking-luxury">PCI DSS Certified Multi-Card Portal</span>
                              <div className="flex gap-1 text-[8px] font-bold font-mono text-charcoal/40 uppercase">
                                <span className="bg-white border border-gold/15 px-1 py-0.5">Visa</span>
                                <span className="bg-white border border-gold/15 px-1 py-0.5">MC</span>
                                <span className="bg-white border border-gold/15 px-1 py-0.5">Amex</span>
                                <span className="bg-white border border-gold/15 px-1 py-0.5">Disc</span>
                                <span className="bg-white border border-gold/15 px-1 py-0.5">UnionPay</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-bold text-forest uppercase text-[9px]">Cardholder Name</label>
                                <input
                                  type="text" required placeholder="Victoria Wellesley"
                                  value={billingData.cardName} onChange={(e) => setBillingData({...billingData, cardName: e.target.value})}
                                  className="w-full p-2 bg-white border border-gold/15 focus:outline-none text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-forest uppercase text-[9px]">Card Number</label>
                                <input
                                  type="text" required placeholder="4000 1234 5678 9010" maxLength={19}
                                  value={billingData.cardNumber} onChange={(e) => setBillingData({...billingData, cardNumber: e.target.value})}
                                  className="w-full p-2 bg-white border border-gold/15 focus:outline-none text-xs font-mono"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-bold text-forest uppercase text-[9px]">Expiration Date</label>
                                <input
                                  type="text" required placeholder="MM/YY" maxLength={5}
                                  value={billingData.cardExpiry} onChange={(e) => setBillingData({...billingData, cardExpiry: e.target.value})}
                                  className="w-full p-2 bg-white border border-gold/15 focus:outline-none text-xs font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-forest uppercase text-[9px]">CVV / Security Code</label>
                                <input
                                  type="password" required placeholder="***" maxLength={4}
                                  value={billingData.cardCvv} onChange={(e) => setBillingData({...billingData, cardCvv: e.target.value})}
                                  className="w-full p-2 bg-white border border-gold/15 focus:outline-none text-xs font-mono"
                                />
                              </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-2">
                              <input
                                type="checkbox"
                                checked={billingData.savePaymentMethod}
                                onChange={(e) => setBillingData({...billingData, savePaymentMethod: e.target.checked})}
                                className="accent-gold"
                              />
                              <span className="font-bold text-forest uppercase text-[9px]">Save payment method securely for future sovereign purchases</span>
                            </label>
                          </motion.div>
                        )}

                        {/* DIGITAL WALLETS SUBFORM */}
                        {paymentType === 'wallet' && (
                          <motion.div
                            key="wallet-subform"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 text-center"
                          >
                            <span className="font-bold text-forest uppercase text-[9px] tracking-luxury block mb-2 text-left border-b border-gold/10 pb-2">Digital Wallet Selection</span>
                            
                            <div className="flex flex-wrap justify-center gap-4 py-2">
                              {['apple', 'google', 'paypal', 'shop'].map((wallet) => (
                                <button
                                  key={wallet}
                                  type="button"
                                  onClick={() => setSelectedWallet(wallet as any)}
                                  className={`px-4 py-2.5 border uppercase font-mono font-bold text-xs rounded-none transition-all flex items-center gap-1.5 cursor-pointer ${selectedWallet === wallet ? 'bg-forest text-gold border-gold font-bold shadow-md' : 'bg-white border-gold/10 text-charcoal hover:border-gold/30'}`}
                                >
                                  <Wallet size={12} />
                                  <span>{wallet === 'apple' ? 'Apple Pay' : wallet === 'google' ? 'Google Pay' : wallet === 'paypal' ? 'PayPal' : 'Shop Pay'}</span>
                                </button>
                              ))}
                            </div>
                            
                            <p className="text-charcoal/50 text-[10px] italic">
                              * Authorize instantly via single-touch biometric handshake or securely redirected tokenized API verification.
                            </p>
                          </motion.div>
                        )}

                        {/* BUY NOW PAY LATER SUBFORM */}
                        {paymentType === 'bnpl' && (
                          <motion.div
                            key="bnpl-subform"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 text-xs"
                          >
                            <span className="font-bold text-forest uppercase text-[9px] tracking-luxury block border-b border-gold/10 pb-2">Buy Now, Pay Later Partners (Interest-Free)</span>
                            
                            <div className="flex justify-center gap-4 py-2">
                              {['klarna', 'afterpay', 'affirm'].map((bnpl) => (
                                <button
                                  key={bnpl}
                                  type="button"
                                  onClick={() => setSelectedBnpl(bnpl as any)}
                                  className={`px-4 py-2 border uppercase font-mono font-bold text-[10px] rounded-none transition-all cursor-pointer ${selectedBnpl === bnpl ? 'bg-forest text-gold border-gold font-bold shadow' : 'bg-white border-gold/10 text-charcoal hover:border-gold/30'}`}
                                >
                                  {bnpl.toUpperCase()}
                                </button>
                              ))}
                            </div>

                            <div className="bg-white p-3 border border-gold/10 text-center text-forest text-[11px] leading-relaxed font-light">
                              Choose <strong>{selectedBnpl.toUpperCase()}</strong> to divide your consolidated estate settlement of <strong>{formatPrice(grandTotalUSD)}</strong> into:
                              <div className="font-mono text-sm font-bold text-gold mt-1">
                                4 monthly interest-free installments of {formatPrice(grandTotalUSD / 4)}
                              </div>
                              <span className="text-[9px] text-charcoal/40 font-light mt-0.5 block">No interest, no added duties, backed by partner guarantees.</span>
                            </div>
                          </motion.div>
                        )}

                        {/* B2B / REGIONAL DIRECT WIRE SUBFORM */}
                        {paymentType === 'b2b' && (
                          <motion.div
                            key="b2b-subform"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 text-xs leading-relaxed"
                          >
                            <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                              <span className="font-bold text-forest uppercase text-[9px] tracking-luxury">Corporate Wholesale Wise & Direct SWIFT Wire</span>
                              <span className="bg-forest text-gold text-[8px] uppercase tracking-luxury font-bold px-1.5 py-0.5">B2B Verified</span>
                            </div>

                            <p className="text-charcoal/60 font-light text-[10px]">
                              Wholesale accounts or bulk orders over 50kg qualify for net-30 bank drafts. Submit coordinates below to receive direct Wise routing instructions.
                            </p>

                            <div className="grid grid-cols-2 gap-4 bg-white p-3 border border-gold/10 font-mono text-[10px] text-charcoal/70">
                              <div>
                                <strong className="text-forest block font-serif uppercase text-[9px] mb-0.5">Wise Clearing Depot</strong>
                                <span>Email: wise-settlement@ceyvana.com</span>
                                <span className="block">IBAN: LK99CEYV0081234567890</span>
                              </div>
                              <div>
                                <strong className="text-forest block font-serif uppercase text-[9px] mb-0.5">Sovereign Colombo Bank</strong>
                                <span>BIC/SWIFT Code: CEYVLKLX</span>
                                <span className="block">Routing: 081234901</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Charge block */}
                  <div className="p-4 bg-forest text-gold rounded-none border border-gold/30 flex items-center justify-between font-serif font-bold">
                    <span className="uppercase text-xs tracking-luxury">Direct Settlement Charge Authorization</span>
                    <span className="text-xl">{formatPrice(grandTotalUSD)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-charcoal/50">
                    <ShieldCheck className="text-green-700 shrink-0" size={14} />
                    <span>Your transaction is guarded under TLS 1.3 SSL, fully PCI-DSS certified, tokenized by Stripe network vaults. No real currency will be debited.</span>
                  </div>

                  <button
                    id="btn-place-order"
                    type="submit"
                    className="w-full py-4 bg-forest hover:bg-gold text-white hover:text-forest text-xs uppercase tracking-luxury font-bold rounded-none transition-all shadow border border-forest hover:border-gold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={12} className="animate-pulse" />
                    <span>Authorize & Settle Sovereign Order</span>
                  </button>
                </form>
              </div>

              {/* Checkout Right Column - Sidebar Summary */}
              <div className="lg:col-span-4 bg-white p-6 border border-gold/15 space-y-6 text-xs">
                <h4 className="font-serif font-bold text-lg text-forest border-b border-gold/10 pb-2">Order Line Items</h4>
                
                <div className="divide-y divide-gold/10 max-h-[220px] overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between text-[11px]">
                      <div className="max-w-[150px] truncate">
                        <span className="font-serif font-bold text-forest block">{item.product.name}</span>
                        <span className="text-charcoal/40 text-[9px] uppercase font-mono">{item.product.specifications.grade} (x{item.quantity})</span>
                      </div>
                      <span className="font-bold text-forest">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {isGiftWrapped && (
                  <div className="flex justify-between border-t border-gold/5 pt-2.5 text-[11px]">
                    <span className="text-charcoal/60">Moratuwa Wooden Chest wrap</span>
                    <span className="font-bold text-forest">{formatPrice(15.00)}</span>
                  </div>
                )}

                <div className="border-t border-gold/15 pt-4 space-y-2.5 text-charcoal/60">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Voucher Discount ({discountPercent}%)</span>
                      <span>-{formatPrice(couponDiscountCost)}</span>
                    </div>
                  )}
                  {giftCardValue > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Gift Card applied</span>
                      <span>-{formatPrice(giftCardValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Carrier Logistics ({shippingType === 'express' ? 'Express Freight' : 'Standard Ocean'})</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dynamic Taxes & Duties ({Math.round(taxRate * 100)}% dynamic {billingData.country})</span>
                    <span>{formatPrice(taxCost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gold/10 pt-3 text-sm font-serif font-bold text-forest">
                    <span>Total Amount</span>
                    <span className="text-gold font-bold text-base">{formatPrice(grandTotalUSD)}</span>
                  </div>
                </div>

                {/* Secure Trust Logo Block */}
                <div className="bg-ivory p-4 border border-gold/10 text-center space-y-2 leading-relaxed">
                  <ShieldCheck size={20} className="text-gold mx-auto" />
                  <strong className="block text-[10px] uppercase text-forest font-serif">PCI DSS Certified Safe Checkout</strong>
                  <p className="text-[9px] text-charcoal/50">
                    Ceyvana is audited annually to comply with PCI DSS compliance standards. Payment instruments are strictly tokenized at Gateway levels without storing private card elements.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* STEP 3: ROYAL RECEIPT */}
          {checkoutStep === 'receipt' && (
            <motion.div
              key="receipt-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white border border-gold/30 rounded-none p-8 shadow-2xl space-y-8 relative overflow-hidden">
                {/* Background watermark */}
                <div className="absolute top-4 right-4 text-9xl font-serif text-gold/5 pointer-events-none select-none font-bold">CEY</div>

                {/* Success Banner */}
                <div className="text-center space-y-4 pt-4 border-b border-gold/15 pb-6">
                  <div className="w-16 h-16 bg-gold/10 border-2 border-gold text-gold rounded-none flex items-center justify-center mx-auto shadow-lg shadow-gold/10">
                    <Check size={32} className="animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-luxury text-gold font-bold">Consolidated Settlement Authorized</span>
                    <h2 className="font-serif font-bold text-2xl md:text-3xl text-forest">Sovereign Receipt</h2>
                    <p className="text-[10px] font-mono text-gold font-bold">Order ID: {orderId}</p>
                    <p className="text-[9px] text-charcoal/40 font-mono mt-0.5">Payment via {paymentType.toUpperCase()} ({paymentType === 'card' ? 'Visa/MC Secured' : paymentType === 'wallet' ? selectedWallet : paymentType === 'bnpl' ? selectedBnpl : 'SWIFT Bank Wire'})</p>
                  </div>
                </div>

                {/* Carriage / Delivery Timeline Tracking Simulator */}
                <div className="bg-ivory p-6 border border-gold/15 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/10 pb-2">
                    <span className="text-[10px] uppercase tracking-luxury font-bold text-forest flex items-center gap-1">
                      <Truck size={14} className="text-gold" />
                      <span>Live Carriage Logistics Status</span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={advanceTrackingStep}
                        className="bg-forest text-gold border border-gold/20 hover:bg-gold hover:text-forest text-[9px] uppercase tracking-luxury font-bold px-3 py-1 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Click to simulate real-time carrier package tracking stage progression!"
                      >
                        <RefreshCw size={10} className="animate-spin" />
                        <span>Advance Delivery Stage</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Timeline tracker */}
                  <div className="relative pt-4 pb-2">
                    <div className="absolute top-[32px] left-3 right-3 h-[2px] bg-gold/20 -z-0" />
                    <div className="grid grid-cols-5 gap-1 text-center relative z-10 text-[9px] font-bold">
                      
                      <div className={`space-y-2 ${trackingStep >= 1 ? 'text-forest' : 'text-charcoal/30'}`}>
                        <div className={`w-6 h-6 mx-auto flex items-center justify-center border-2 ${trackingStep >= 1 ? 'bg-forest text-gold border-gold' : 'bg-white text-charcoal/30 border-gold/10'}`}>1</div>
                        <div>Estate Sourcing</div>
                        <span className="block text-[8px] font-normal text-charcoal/40">Colombo HQ</span>
                      </div>

                      <div className={`space-y-2 ${trackingStep >= 2 ? 'text-forest' : 'text-charcoal/30'}`}>
                        <div className={`w-6 h-6 mx-auto flex items-center justify-center border-2 ${trackingStep >= 2 ? 'bg-forest text-gold border-gold' : 'bg-white text-charcoal/30 border-gold/10'}`}>2</div>
                        <div>Chest Crafting</div>
                        <span className="block text-[8px] font-normal text-charcoal/40">Moratuwa Atelier</span>
                      </div>

                      <div className={`space-y-2 ${trackingStep >= 3 ? 'text-forest' : 'text-charcoal/30'}`}>
                        <div className={`w-6 h-6 mx-auto flex items-center justify-center border-2 ${trackingStep >= 3 ? 'bg-forest text-gold border-gold' : 'bg-white text-charcoal/30 border-gold/10'}`}>3</div>
                        <div>Customs Export</div>
                        <span className="block text-[8px] font-normal text-charcoal/40">Colombo Port</span>
                      </div>

                      <div className={`space-y-2 ${trackingStep >= 4 ? 'text-forest' : 'text-charcoal/30'}`}>
                        <div className={`w-6 h-6 mx-auto flex items-center justify-center border-2 ${trackingStep >= 4 ? 'bg-forest text-gold border-gold' : 'bg-white text-charcoal/30 border-gold/10'}`}>4</div>
                        <div>Air Transit</div>
                        <span className="block text-[8px] font-normal text-charcoal/40">DHL Cargo</span>
                      </div>

                      <div className={`space-y-2 ${trackingStep >= 5 ? 'text-forest' : 'text-charcoal/30'}`}>
                        <div className={`w-6 h-6 mx-auto flex items-center justify-center border-2 ${trackingStep >= 5 ? 'bg-forest text-gold border-gold' : 'bg-white text-charcoal/30 border-gold/10'}`}>5</div>
                        <div>Hand Delivery</div>
                        <span className="block text-[8px] font-normal text-charcoal/40">Consignee Hub</span>
                      </div>

                    </div>
                  </div>

                  <div className="bg-white p-3 border border-gold/10 text-[10px] text-charcoal/70 leading-normal flex items-center gap-1.5 font-light">
                    <Info size={12} className="text-gold shrink-0" />
                    <span>
                      Current Location: <strong>
                        {trackingStep === 1 ? 'Colombo Estate Flagship Hub (Sorting Sacks)' : 
                         trackingStep === 2 ? 'Moratuwa Forest Woodworking Co-op (Polishing Timber Boxes)' :
                         trackingStep === 3 ? 'Colombo Harbour Custom Inspection Gate (Clearing Phytosanitary certificates)' :
                         trackingStep === 4 ? 'In-flight Air Cargo (DHL priority routing)' :
                         'Delivered to Consignee Portal'}
                      </strong>. Dynamic ETA Date: {estimatedDeliveryStr}.
                    </span>
                  </div>
                </div>

                {/* Shipping & Billing Breakdown summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-2 bg-ivory p-4 border border-gold/10">
                    <h4 className="font-serif font-bold text-forest uppercase tracking-luxury text-[10px]">Consignee Coordinates</h4>
                    <div className="space-y-1 text-charcoal/70 font-light">
                      <p><strong>Name:</strong> {billingData.fullName || 'Guest Patron'}</p>
                      <p><strong>Email:</strong> {billingData.email || 'customer@ceyvana.com'}</p>
                      <p><strong>Phone:</strong> {billingData.phone || 'Not provided'}</p>
                      <p><strong>Destination:</strong> {billingData.address}, {billingData.city}, {billingData.zip}, {billingData.country}</p>
                      {billingData.companyName && <p><strong>Company:</strong> {billingData.companyName} (VAT: {billingData.taxId || 'N/A'})</p>}
                    </div>
                  </div>

                  <div className="space-y-2 bg-ivory p-4 border border-gold/10">
                    <h4 className="font-serif font-bold text-forest uppercase tracking-luxury text-[10px]">Duties & Settlement Breakdown</h4>
                    <div className="space-y-1 text-charcoal/70 font-light">
                      <p><strong>Invoice Settlement Date:</strong> {orderDate}</p>
                      <p><strong>Carrier Freight Speed:</strong> {shippingType === 'express' ? 'DHL priority Express Air' : 'Standard ocean cargo route'}</p>
                      <p><strong>SSL Key Handshake:</strong> SECURE AES-256 Tokenized</p>
                      <p><strong>Sovereign Tracking Number:</strong> <span className="font-mono text-gold font-bold">CEY-DHL-{orderId.split('-')[1]}</span></p>
                    </div>
                  </div>
                </div>

                {/* List of items purchased */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-forest uppercase tracking-luxury text-[10px] block border-b border-gold/5 pb-1">Purchased Collections List</h4>
                  <div className="divide-y divide-gold/10 bg-ivory p-4 border border-gold/10 leading-relaxed font-light">
                    {cart.map(item => (
                      <div key={item.product.id} className="py-2.5 flex justify-between first:pt-0 last:pb-0">
                        <span className="text-charcoal truncate max-w-[280px]">
                          {item.product.name} <strong className="font-mono text-[10px] text-gold">(x{item.quantity})</strong>
                          <span className="block text-[8px] text-charcoal/40 uppercase font-mono">{item.product.specifications.grade}</span>
                        </span>
                        <span className="font-bold text-forest">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                    {isGiftWrapped && (
                      <div className="py-2.5 flex justify-between">
                        <span className="text-charcoal">Moratuwa Woodcraft Wrap (Rosewood Lining)</span>
                        <span className="font-bold text-forest">{formatPrice(15.00)}</span>
                      </div>
                    )}
                    {discountPercent > 0 && (
                      <div className="py-2.5 flex justify-between text-green-700 font-bold">
                        <span>Voucher Discount ({discountPercent}%)</span>
                        <span>-{formatPrice(couponDiscountCost)}</span>
                      </div>
                    )}
                    {giftCardValue > 0 && (
                      <div className="py-2.5 flex justify-between text-green-700 font-bold">
                        <span>Gift Card Applied Balance</span>
                        <span>-{formatPrice(giftCardValue)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary Total */}
                <div className="flex justify-between items-center border-t border-gold/15 pt-4 text-sm font-serif font-bold">
                  <span className="text-forest uppercase text-xs tracking-luxury">Consolidated Sourcing Settlement Total</span>
                  <span className="text-gold text-xl font-bold">{formatPrice(grandTotalUSD)}</span>
                </div>

                {/* PDF/Text Invoice Generator Download Button & Printer Controls */}
                <div className="bg-ivory p-4 border border-gold/15 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <strong className="text-forest uppercase text-[10px] block">Generate Official Export Clearance Invoice</strong>
                    <p className="text-charcoal/40 text-[9px]">Sourced with single-estate traceability protocols</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handlePrintInvoice}
                      className="bg-white hover:bg-gold/10 text-forest hover:text-forest text-[10px] uppercase tracking-luxury font-bold px-4 py-2 border border-gold/20 flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
                    >
                      <Printer size={12} />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      onClick={handleDownloadInvoice}
                      className="bg-forest hover:bg-gold text-white hover:text-forest text-[10px] uppercase tracking-luxury font-bold px-4 py-2 border border-forest hover:border-gold flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-forest/5 border border-gold/15 text-[10px] text-forest leading-relaxed font-light text-center">
                  A high-resolution digitized invoice, accompanied by dynamic Single-Estate Traceability certificates, Moratuwa woodcraft certificate of custody, and clinical assays has been dispatched to <strong>{billingData.email || 'your email'}</strong>.
                </div>
              </div>

              {/* Advanced Refund and Cancellation Manager Panel */}
              <div className="bg-white border border-gold/15 p-6 space-y-6 text-xs">
                <div>
                  <h3 className="font-serif font-bold text-base text-forest uppercase tracking-luxury border-b border-gold/10 pb-2 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-gold" />
                    <span>Refund & Cancellation Office</span>
                  </h3>
                  <p className="text-[10px] text-charcoal/40 mt-1">Manage return protocols and invoice reversals securely</p>
                </div>

                {refundStatus === 'none' && cancellationStatus === 'none' && (
                  <div className="space-y-4">
                    <div className="bg-ivory p-3.5 border border-gold/10 space-y-3">
                      <strong className="block text-[10px] uppercase text-forest">01. Request Direct Carriage Cancellation</strong>
                      <p className="text-[10px] text-charcoal/50 leading-normal">
                        If your cargo is not yet processed by the Colombo harbour customs agent, you can request immediate order cancellation.
                      </p>
                      
                      <form onSubmit={handleInitiateCancellation} className="space-y-2">
                        <select
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          className="w-full p-2 bg-white border border-gold/15 text-[10px] focus:outline-none"
                        >
                          <option value="Changed My Mind">Changed My Mind / Accidental Submit</option>
                          <option value="Customs Clearing Constraint">Customs Clearing Constraint</option>
                          <option value="B2B Wholesale Term Adjustment">B2B Wholesale Term Adjustment</option>
                          <option value="Incorrect Settlement Currency">Incorrect Settlement Currency Selection</option>
                        </select>
                        <button
                          type="submit"
                          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-[9px] uppercase tracking-luxury font-bold transition-colors cursor-pointer"
                        >
                          Submit Cancellation Request
                        </button>
                      </form>
                    </div>

                    <div className="bg-ivory p-3.5 border border-gold/10 space-y-3">
                      <strong className="block text-[10px] uppercase text-forest">02. Sourcing Returns & Refunds Protocol</strong>
                      <p className="text-[10px] text-charcoal/50 leading-normal">
                        We back each single-estate crop with an absolute 30-day money-back guarantee. Initiate a return request here.
                      </p>

                      <form onSubmit={handleInitiateRefund} className="space-y-2">
                        <select
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          className="w-full p-2 bg-white border border-gold/15 text-[10px] focus:outline-none"
                        >
                          <option value="Estate Sourcing Adjustment">Aromatic profile did not match sommelier forecast</option>
                          <option value="Duties Clearance Issue">Duties Clearance / Import Levy issue</option>
                          <option value="Moratuwa Wood Chest Damaged">Moratuwa Gifting Chest damaged in transit</option>
                          <option value="B2B Invoice Net Terms Adjustment">B2B Invoice terms adjustment request</option>
                        </select>
                        <button
                          type="submit"
                          className="w-full py-2 bg-forest hover:bg-gold text-white hover:text-forest text-[9px] uppercase tracking-luxury font-bold border border-forest hover:border-gold transition-colors cursor-pointer"
                        >
                          Initiate Sourcing Return
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Refund Processing state */}
                {refundStatus === 'processing' && (
                  <div className="p-4 bg-gold/5 border border-gold text-center space-y-2 animate-pulse">
                    <RefreshCw className="animate-spin text-gold mx-auto" size={18} />
                    <strong className="block text-forest uppercase text-[10px]">Processing Sourcing Return Reversal...</strong>
                    <span className="text-[9px] text-charcoal/40">Handshaking securely with original settlement gateway</span>
                  </div>
                )}

                {/* Refund Completed state */}
                {refundStatus === 'refunded' && (
                  <div className="p-4 bg-green-50 border border-green-300 text-center space-y-2.5 animate-fade-in">
                    <Check className="text-green-600 mx-auto" size={18} />
                    <strong className="block text-green-800 uppercase text-[10px]">Return Verified & Credit Dispensed</strong>
                    <p className="text-[10px] text-green-700 font-light leading-normal">
                      A settlement reversal for <strong>{formatPrice(grandTotalUSD)}</strong> was successfully authorized and credited.
                    </p>
                    <div className="p-2 bg-white border border-green-200 text-left font-mono text-[9px] text-green-800">
                      <strong>Credit Note ID:</strong> {creditNoteId}
                      <span className="block mt-0.5">Status: Settlement Reclaimed</span>
                    </div>
                  </div>
                )}

                {/* Cancellation Processing state */}
                {cancellationStatus === 'processing' && (
                  <div className="p-4 bg-red-50 border border-red-300 text-center space-y-2 animate-pulse">
                    <RefreshCw className="animate-spin text-red-600 mx-auto" size={18} />
                    <strong className="block text-red-800 uppercase text-[10px]">Reversing Cargo Invoice...</strong>
                    <span className="text-[9px] text-charcoal/40">Reclaiming clearance certificates at Colombo customs...</span>
                  </div>
                )}

                {/* Cancellation Completed state */}
                {cancellationStatus === 'cancelled' && (
                  <div className="p-4 bg-red-50 border border-red-300 text-center space-y-2.5 animate-fade-in">
                    <XCircle className="text-red-600 mx-auto" size={18} />
                    <strong className="block text-red-800 uppercase text-[10px]">Sovereign Cargo Revoked</strong>
                    <p className="text-[10px] text-red-700 font-light leading-normal">
                      The carriage was successfully cancelled at Colombo docks. Subtotals reversed with zero duties due.
                    </p>
                    <div className="p-2 bg-white border border-red-200 text-left font-mono text-[9px] text-red-800">
                      <strong>Cancellation Cert:</strong> {creditNoteId}
                      <span className="block mt-0.5">Status: Revoked & Reimbursed</span>
                    </div>
                  </div>
                )}

              </div>

              <div className="max-w-md mx-auto">
                <button
                  id="btn-receipt-complete"
                  onClick={handleFinish}
                  className="w-full py-4 bg-forest hover:bg-gold text-white hover:text-forest text-xs uppercase tracking-luxury font-bold rounded-none transition-all shadow border border-forest hover:border-gold cursor-pointer text-center block"
                >
                  Return to Colombo Flagship HQ
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* SECURE PAYMENT SUBMISSION OVERLAY DIALOG */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gold/30 p-8 max-w-sm w-full text-center space-y-4 rounded-none shadow-2xl"
            >
              <RefreshCw className="animate-spin text-gold mx-auto" size={28} />
              <h3 className="font-serif font-bold text-lg text-forest">Sovereign Encryption Secure Link</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                {processingMessage}
              </p>
              <span className="text-[9px] uppercase tracking-luxury text-gold font-mono block">PCI DSS Standard Protected</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D SECURE SMS SIMULATOR MODAL */}
      <AnimatePresence>
        {isVerifying3D && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gold/30 p-8 max-w-md w-full space-y-6 rounded-none shadow-2xl text-xs text-charcoal"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-2">
                <span className="font-serif font-bold text-forest text-base flex items-center gap-1.5">
                  <Lock size={14} className="text-gold" />
                  <span>3D Secure 2.0 Royal Verification</span>
                </span>
                <span className="text-[8px] bg-forest text-gold px-1.5 py-0.5 uppercase tracking-luxury font-bold">Safe Stack</span>
              </div>

              <div className="space-y-2 leading-relaxed">
                <p>
                  Your card issuer requires two-factor confirmation for sovereign estate clearance settlements.
                </p>
                <div className="bg-ivory p-3 border border-gold/10 space-y-1 text-charcoal/70">
                  <p><strong>Merchant Designation:</strong> Ceyvana Single-Estate Botanicals</p>
                  <p><strong>Consolidated Total:</strong> {formatPrice(grandTotalUSD)}</p>
                  <p><strong>Device Authorized IP:</strong> 104.28.14.99 (Sri Lankan Transit Hub)</p>
                </div>
                <p className="text-[10px] text-charcoal/50">
                  A passcode has been dispatched to your mobile telephone number ending in <strong>*4567</strong>.
                </p>
              </div>

              <form onSubmit={handleVerify3DSecure} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-forest uppercase block text-[10px]">Verify Security Code</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Code (Type 1234 or leave empty for auto-pass)"
                    value={smsVerificationCode}
                    onChange={(e) => setSmsVerificationCode(e.target.value)}
                    className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 text-center text-sm font-mono tracking-widest focus:outline-none"
                  />
                  {smsError && <p className="text-red-600 text-[10px] mt-1 text-center font-bold">{smsError}</p>}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setSmsVerificationCode('1234'); setSmsError(''); }}
                    className="flex-1 py-2 bg-ivory hover:bg-gold/10 text-forest text-[10px] uppercase font-bold border border-gold/20 cursor-pointer"
                  >
                    Quick Approve
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-forest hover:bg-gold text-white hover:text-forest text-[10px] uppercase tracking-luxury font-bold border border-forest hover:border-gold transition-colors cursor-pointer"
                  >
                    Submit Verification
                  </button>
                </div>
              </form>

              <div className="text-center text-[9px] text-charcoal/40 pt-2 border-t border-gold/5 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-green-700" />
                <span>Verified by Visa • Mastercard Identity Check • Amex SafeKey</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
