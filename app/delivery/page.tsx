'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/navigation';
import './delivery.css';

interface CartItem {
  id: number;
  name: string;
  nameZh: string;
  price: number;
  category: string;
  description: string;
  emoji: string;
  quantity: number;
}

export default function Delivery() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  const [cartButtonAnimating, setCartButtonAnimating] = useState(false);

  const menuCategories = {
    all: 'All Items',
    appetizers: 'Appetizers',
    soups: 'Soups',
    poultry: 'Poultry',
    beef: 'Beef',
    pork: 'Pork',
    seafood: 'Seafood',
    vegetarian: 'Vegetarian',
    rice: 'Rice & Noodles',
    desserts: 'Desserts',
    beverages: 'Beverages'
  };

  const menuItems = [
    // Appetizers
    { id: 1, name: 'Spring Rolls', nameZh: '春卷', price: 6.99, category: 'appetizers', description: 'Crispy vegetable spring rolls served with sweet and sour sauce', emoji: '🥗' },
    { id: 2, name: 'Pot Stickers', nameZh: '锅贴', price: 8.99, category: 'appetizers', description: 'Pan-fried dumplings filled with pork and vegetables', emoji: '🥟' },
    { id: 3, name: 'Chicken Wings', nameZh: '鸡翅', price: 9.99, category: 'appetizers', description: 'Crispy wings with honey garlic sauce', emoji: '🍗' },
    
    // Soups
    { id: 4, name: 'Hot & Sour Soup', nameZh: '酸辣汤', price: 8.99, category: 'soups', description: 'Traditional spicy and tangy soup with tofu and vegetables', emoji: '🍲' },
    { id: 5, name: 'Wonton Soup', nameZh: '馄饨汤', price: 7.99, category: 'soups', description: 'Delicate pork wontons in clear broth', emoji: '🥣' },
    
    // Poultry
    { id: 6, name: 'Kung Pao Chicken', nameZh: '宫保鸡丁', price: 12.99, category: 'poultry', description: 'Spicy stir-fried chicken with peanuts and vegetables', emoji: '🍗' },
    { id: 7, name: 'General Tso\'s Chicken', nameZh: '左宗棠鸡', price: 13.99, category: 'poultry', description: 'Crispy chicken in sweet and spicy sauce', emoji: '🍖' },
    { id: 8, name: 'Lemon Chicken', nameZh: '柠檬鸡', price: 12.99, category: 'poultry', description: 'Crispy chicken with fresh lemon sauce', emoji: '🍋' },
    
    // Beef
    { id: 9, name: 'Mongolian Beef', nameZh: '蒙古牛肉', price: 15.99, category: 'beef', description: 'Tender beef with scallions and onions in savory sauce', emoji: '🥩' },
    { id: 10, name: 'Beef and Broccoli', nameZh: '芥兰牛肉', price: 14.99, category: 'beef', description: 'Stir-fried beef with fresh broccoli', emoji: '🥦' },
    
    // Pork
    { id: 11, name: 'Sweet & Sour Pork', nameZh: '糖醋里脊', price: 13.99, category: 'pork', description: 'Crispy pork with pineapple in sweet and sour sauce', emoji: '🥩' },
    { id: 12, name: 'Twice Cooked Pork', nameZh: '回锅肉', price: 14.99, category: 'pork', description: 'Sichuan style pork with cabbage and peppers', emoji: '🌶️' },
    
    // Seafood
    { id: 13, name: 'Honey Walnut Shrimp', nameZh: '核桃虾', price: 18.99, category: 'seafood', description: 'Crispy shrimp with candied walnuts', emoji: '🍤' },
    { id: 14, name: 'Fish in Black Bean Sauce', nameZh: '豆豉鱼', price: 19.99, category: 'seafood', description: 'Fresh fish with bell peppers in black bean sauce', emoji: '🐟' },
    
    // Vegetarian
    { id: 15, name: 'Mapo Tofu', nameZh: '麻婆豆腐', price: 10.99, category: 'vegetarian', description: 'Soft tofu in spicy Sichuan sauce', emoji: '🥘' },
    { id: 16, name: 'Buddha\'s Delight', nameZh: '罗汉斋', price: 9.99, category: 'vegetarian', description: 'Mixed vegetables and tofu stir-fry', emoji: '🥬' },
    
    // Rice & Noodles
    { id: 17, name: 'Shrimp Fried Rice', nameZh: '虾仁炒饭', price: 11.99, category: 'rice', description: 'Wok-fried rice with shrimp and vegetables', emoji: '🍚' },
    { id: 18, name: 'Lo Mein', nameZh: '捞面', price: 10.99, category: 'rice', description: 'Soft noodles with vegetables and choice of protein', emoji: '🍜' },
    { id: 19, name: 'Pad Thai', nameZh: '泰式炒面', price: 12.99, category: 'rice', description: 'Thai style rice noodles with peanuts', emoji: '🥜' },
    
    // Desserts
    { id: 20, name: 'Fried Ice Cream', nameZh: '炸冰淇淋', price: 6.99, category: 'desserts', description: 'Vanilla ice cream in crispy coating', emoji: '🍨' },
    { id: 21, name: 'Mango Pudding', nameZh: '芒果布丁', price: 5.99, category: 'desserts', description: 'Silky smooth mango pudding', emoji: '🥭' },
    
    // Beverages
    { id: 22, name: 'Hot Tea', nameZh: '热茶', price: 2.99, category: 'beverages', description: 'Jasmine, Oolong, or Green tea', emoji: '🍵' },
    { id: 23, name: 'Fresh Juice', nameZh: '鲜榨果汁', price: 4.99, category: 'beverages', description: 'Orange, Apple, or Mango juice', emoji: '🥤' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('goldenDragonCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('goldenDragonCart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('goldenDragonCart');
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // Trigger animation for this item
    setAnimatingItems(prev => new Set(prev).add(item.id));
    setCartButtonAnimating(true);
    
    // Remove animation after duration
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 600);
    
    setTimeout(() => {
      setCartButtonAnimating(false);
    }, 400);

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    // Open cart drawer when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="relative">
        <Navigation />
        
        {/* Cart Button Overlay */}
        <div className="absolute top-0 right-0 h-16 flex items-center pr-4 sm:pr-6 lg:pr-8 z-50">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className={`bg-gold text-red-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all font-semibold flex items-center space-x-2 ${
              cartButtonAnimating ? 'animate-bounce scale-110' : ''
            }`}
          >
            <span className={cartButtonAnimating ? 'animate-spin' : ''}>🛒</span>
            <span>Cart ({getTotalItems()})</span>
            <span>${getTotalPrice()}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Delivery</h1>
          <p className="text-xl mb-2">外卖订餐</p>
          <p className="text-lg opacity-90">Free delivery on orders over $30 • 30-45 minutes</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-gold">📍</span> Delivery within 5 miles
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-gold">🕐</span> Open until 11:00 PM
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Section */}
          <div className="flex-1">
            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h2 className="text-xl font-bold text-red-900 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(menuCategories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedCategory === key
                        ? 'bg-red-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <h3 className="text-lg font-bold text-red-900">{item.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{item.nameZh}</p>
                      <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-bold text-lg">${item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className={`w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-700 transition-all font-semibold relative overflow-hidden ${
                      animatingItems.has(item.id) ? 'animate-pulse scale-105' : ''
                    }`}
                  >
                    <span className={`inline-block ${
                      animatingItems.has(item.id) ? 'animate-bounce' : ''
                    }`}>
                      {animatingItems.has(item.id) ? '✅ Added!' : 'Add to Cart'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          {isCartOpen && (
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Your Order</h2>
                
                {cart.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="border-b pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">${item.price} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right mt-2">
                            <span className="font-semibold text-gold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-lg">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Delivery Fee:</span>
                        <span className="font-semibold">{parseFloat(getTotalPrice()) >= 30 ? 'FREE' : '$4.99'}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-red-900 pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-gold">
                          ${(parseFloat(getTotalPrice()) + (parseFloat(getTotalPrice()) >= 30 ? 0 : 4.99)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-gold text-red-900 py-3 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all mt-6 transform hover:scale-105"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Info Section */}
      <section className="bg-gray-50 py-12 px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-900 mb-8">Delivery Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-bold text-red-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">30-45 minutes average delivery time</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-red-900 mb-2">Track Your Order</h3>
              <p className="text-gray-600">Real-time updates on your delivery status</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-bold text-red-900 mb-2">Safe & Contactless</h3>
              <p className="text-gray-600">Contactless delivery options available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">© 2024 Golden Dragon Restaurant | 金龙餐厅</p>
          <p className="text-sm opacity-75">Order online for delivery or pickup</p>
        </div>
      </footer>
    </div>
  );
}