'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Navigation */}
      <nav className="bg-red-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gold">🥟</span>
                <span className="text-xl font-bold text-white">Golden Dragon</span>
                <span className="text-sm text-gold ml-2">金龙餐厅</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-gold transition">Home</Link>
              <Link href="/menu" className="text-white hover:text-gold transition">Menu</Link>
              <Link href="/reservation" className="text-white hover:text-gold transition">Reservation</Link>
              <Link href="/location" className="text-white hover:text-gold transition">Location</Link>
              <Link href="/login" className="bg-gold text-red-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold">
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gold focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-red-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-white hover:text-gold">Home</Link>
              <Link href="/menu" className="block px-3 py-2 text-white hover:text-gold">Menu</Link>
              <Link href="/reservation" className="block px-3 py-2 text-white hover:text-gold">Reservation</Link>
              <Link href="/location" className="block px-3 py-2 text-white hover:text-gold">Location</Link>
              <Link href="/login" className="block px-3 py-2 text-white hover:text-gold">Login</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-700/90"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Welcome to Golden Dragon
          </h1>
          <p className="text-3xl md:text-4xl mb-2 text-gold font-chinese">
            欢迎光临金龙餐厅
          </p>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Authentic Chinese Cuisine Since 1985
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="bg-gold text-red-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105">
              View Menu
            </Link>
            <Link href="/reservation" className="bg-white text-red-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105">
              Make Reservation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-red-900 mb-12">
            Why Choose Golden Dragon
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Master Chefs</h3>
              <p className="text-gray-600">Our chefs bring over 30 years of experience from Beijing and Shanghai</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🥢</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Authentic Recipes</h3>
              <p className="text-gray-600">Traditional family recipes passed down through generations</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">Locally sourced vegetables and premium imported spices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-red-900 mb-12">
            Popular Dishes
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Kung Pao Chicken', nameZh: '宫保鸡丁', price: '$12.99', emoji: '🍗' },
              { name: 'Mapo Tofu', nameZh: '麻婆豆腐', price: '$10.99', emoji: '🥘' },
              { name: 'Beijing Duck', nameZh: '北京烤鸭', price: '$28.99', emoji: '🦆' },
              { name: 'Dim Sum Platter', nameZh: '点心拼盘', price: '$15.99', emoji: '🥟' },
              { name: 'Sweet & Sour Pork', nameZh: '糖醋里脊', price: '$13.99', emoji: '🥩' },
              { name: 'Shrimp Fried Rice', nameZh: '虾仁炒饭', price: '$11.99', emoji: '🍤' },
              { name: 'Hot & Sour Soup', nameZh: '酸辣汤', price: '$8.99', emoji: '🍲' },
              { name: 'Spring Rolls', nameZh: '春卷', price: '$6.99', emoji: '🥗' },
            ].map((dish, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105">
                <div className="text-4xl mb-3 text-center">{dish.emoji}</div>
                <h3 className="font-bold text-red-900 text-center">{dish.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-2">{dish.nameZh}</p>
                <p className="text-gold font-bold text-center text-lg">{dish.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/menu" className="inline-block bg-red-800 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-red-900 mb-8">Visit Us Today</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-red-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Main Street<br />New York, NY 10001</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-3">🕐</div>
              <h3 className="font-bold text-red-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Thu: 11am-10pm<br />Fri-Sun: 11am-11pm</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold text-red-900 mb-2">Contact</h3>
              <p className="text-gray-600">(555) 123-4567<br />info@goldendragon.com</p>
            </div>
          </div>
          <Link href="/reservation" className="inline-block bg-gold text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105">
            Reserve Your Table
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">© 2024 Golden Dragon Restaurant | 金龙餐厅</p>
          <p className="text-sm opacity-75">Serving authentic Chinese cuisine with pride</p>
        </div>
      </footer>

    </div>
  );
}
