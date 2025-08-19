'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { client } from '../utils/amplify-client';
import { useAuth } from '../providers/AuthProvider';

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<Array<{id: number; name: string; nameZh?: string; price: number; quantity: number}>>([]);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    instructions: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('goldenDragonCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // If no cart, redirect to delivery page
      router.push('/delivery');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      const newCart = cart.filter(item => item.id !== itemId);
      setCart(newCart);
      localStorage.setItem('goldenDragonCart', JSON.stringify(newCart));
    } else {
      const newCart = cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(newCart);
      localStorage.setItem('goldenDragonCart', JSON.stringify(newCart));
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getDeliveryFee = () => {
    return getSubtotal() >= 30 ? 0 : 4.99;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order in DynamoDB
      const { data: order } = await client.models.Order.create({
        customerName: orderForm.name,
        phone: orderForm.phone,
        email: orderForm.email,
        deliveryAddress: `${orderForm.address}, ${orderForm.city} ${orderForm.zipCode}`,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        deliveryFee: getDeliveryFee(),
        total: getTotal(),
        specialInstructions: orderForm.instructions || null,
        userId: user?.userId || 'guest'
      });

      if (order) {
        setOrderComplete(true);
        localStorage.removeItem('goldenDragonCart');
        
        // After 3 seconds, redirect to home
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sorry, there was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-bounce mb-6">
              <span className="text-8xl">✅</span>
            </div>
            <h1 className="text-4xl font-bold text-red-900 mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-700 mb-2">Thank you for your order!</p>
            <p className="text-lg text-gray-600">Your food will arrive in 30-45 minutes</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />

      {/* Checkout Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <p className="text-gold mt-2">Complete your order</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Delivery Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={orderForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={orderForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={orderForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={orderForm.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={orderForm.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={orderForm.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Payment Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={orderForm.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      value={orderForm.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      placeholder="MM/YY"
                      value={orderForm.expiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      placeholder="123"
                      value={orderForm.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Special Instructions</h2>
                <textarea
                  name="instructions"
                  rows={3}
                  value={orderForm.instructions}
                  onChange={handleInputChange}
                  placeholder="Any special requests or delivery instructions..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className={`w-full py-4 rounded-lg font-bold text-white transition ${
                  isProcessing || cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-800 hover:bg-red-700 transform hover:scale-105'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Payment...
                  </span>
                ) : (
                  `Place Order - $${getTotal().toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-red-900 mb-4">Order Summary</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-start border-b pb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.nameZh}</p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-medium">${getTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        {getDeliveryFee() === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${getDeliveryFee().toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {getDeliveryFee() > 0 && (
                      <p className="text-xs text-gray-500">Free delivery on orders over $30</p>
                    )}
                    <div className="flex justify-between text-xl font-bold text-red-900 pt-4 border-t">
                      <span>Total</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Back to Menu */}
                  <Link
                    href="/delivery"
                    className="block text-center mt-6 text-red-600 hover:text-red-700 font-medium"
                  >
                    ← Back to Menu
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}