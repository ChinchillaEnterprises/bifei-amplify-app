'use client';

import { useState } from 'react';
import Link from 'next/link';

const menuCategories = {
  appetizers: {
    name: 'Appetizers',
    nameZh: '开胃菜',
    items: [
      { name: 'Spring Rolls', nameZh: '春卷', description: 'Crispy vegetable spring rolls', price: 6.99, spicy: 0 },
      { name: 'Pot Stickers', nameZh: '锅贴', description: 'Pan-fried pork dumplings', price: 8.99, spicy: 0 },
      { name: 'Crab Rangoon', nameZh: '蟹角', description: 'Crispy wonton with crab and cream cheese', price: 7.99, spicy: 0 },
      { name: 'Chicken Satay', nameZh: '沙爹鸡', description: 'Grilled chicken skewers with peanut sauce', price: 9.99, spicy: 1 },
    ]
  },
  soups: {
    name: 'Soups',
    nameZh: '汤类',
    items: [
      { name: 'Hot & Sour Soup', nameZh: '酸辣汤', description: 'Traditional spicy and tangy soup', price: 8.99, spicy: 2 },
      { name: 'Wonton Soup', nameZh: '云吞汤', description: 'Pork wontons in clear broth', price: 7.99, spicy: 0 },
      { name: 'Egg Drop Soup', nameZh: '蛋花汤', description: 'Silky egg ribbons in savory broth', price: 6.99, spicy: 0 },
      { name: 'Seafood Corn Soup', nameZh: '海鲜玉米汤', description: 'Rich soup with shrimp and crab', price: 9.99, spicy: 0 },
    ]
  },
  poultry: {
    name: 'Poultry',
    nameZh: '鸡肉类',
    items: [
      { name: 'Kung Pao Chicken', nameZh: '宫保鸡丁', description: 'Spicy chicken with peanuts and vegetables', price: 12.99, spicy: 3 },
      { name: 'General Tso\'s Chicken', nameZh: '左宗棠鸡', description: 'Crispy chicken in sweet and spicy sauce', price: 13.99, spicy: 2 },
      { name: 'Lemon Chicken', nameZh: '柠檬鸡', description: 'Crispy chicken with fresh lemon sauce', price: 12.99, spicy: 0 },
      { name: 'Cashew Chicken', nameZh: '腰果鸡丁', description: 'Stir-fried chicken with roasted cashews', price: 13.99, spicy: 0 },
    ]
  },
  beef: {
    name: 'Beef',
    nameZh: '牛肉类',
    items: [
      { name: 'Mongolian Beef', nameZh: '蒙古牛肉', description: 'Tender beef with scallions and onions', price: 15.99, spicy: 1 },
      { name: 'Beef with Broccoli', nameZh: '西兰花牛肉', description: 'Classic stir-fry with fresh broccoli', price: 14.99, spicy: 0 },
      { name: 'Orange Beef', nameZh: '橙汁牛肉', description: 'Crispy beef with orange peel sauce', price: 16.99, spicy: 1 },
      { name: 'Pepper Steak', nameZh: '青椒牛肉', description: 'Beef strips with bell peppers and onions', price: 15.99, spicy: 0 },
    ]
  },
  seafood: {
    name: 'Seafood',
    nameZh: '海鲜类',
    items: [
      { name: 'Honey Walnut Shrimp', nameZh: '核桃虾', description: 'Crispy shrimp with candied walnuts', price: 18.99, spicy: 0 },
      { name: 'Szechuan Fish', nameZh: '四川鱼', description: 'Spicy fish fillets in Szechuan sauce', price: 19.99, spicy: 4 },
      { name: 'Lobster Cantonese Style', nameZh: '广式龙虾', description: 'Whole lobster with ginger and scallions', price: 32.99, spicy: 0 },
      { name: 'Salt & Pepper Calamari', nameZh: '椒盐鱿鱼', description: 'Crispy squid with spicy seasoning', price: 16.99, spicy: 2 },
    ]
  },
  vegetarian: {
    name: 'Vegetarian',
    nameZh: '素食',
    items: [
      { name: 'Mapo Tofu', nameZh: '麻婆豆腐', description: 'Silky tofu in spicy Szechuan sauce', price: 10.99, spicy: 3 },
      { name: 'Buddha\'s Delight', nameZh: '罗汉斋', description: 'Mixed vegetables and tofu stir-fry', price: 9.99, spicy: 0 },
      { name: 'Eggplant in Garlic Sauce', nameZh: '鱼香茄子', description: 'Chinese eggplant in savory sauce', price: 10.99, spicy: 1 },
      { name: 'Green Bean Szechuan', nameZh: '干煸四季豆', description: 'Crispy green beans with Szechuan spices', price: 9.99, spicy: 2 },
    ]
  },
  rice: {
    name: 'Rice & Noodles',
    nameZh: '饭面类',
    items: [
      { name: 'Yang Chow Fried Rice', nameZh: '扬州炒饭', description: 'Classic fried rice with shrimp and char siu', price: 11.99, spicy: 0 },
      { name: 'Shrimp Fried Rice', nameZh: '虾仁炒饭', description: 'Wok-fried rice with fresh shrimp', price: 10.99, spicy: 0 },
      { name: 'Lo Mein', nameZh: '捞面', description: 'Soft noodles with vegetables and choice of protein', price: 10.99, spicy: 0 },
      { name: 'Pad Thai', nameZh: '泰式炒面', description: 'Rice noodles with tamarind sauce', price: 11.99, spicy: 1 },
    ]
  }
};

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getSpicyIndicator = (level: number) => {
    return '🌶️'.repeat(level);
  };

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
              <Link href="/menu" className="text-gold">Menu</Link>
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
              <Link href="/menu" className="block px-3 py-2 text-gold">Menu</Link>
              <Link href="/reservation" className="block px-3 py-2 text-white hover:text-gold">Reservation</Link>
              <Link href="/location" className="block px-3 py-2 text-white hover:text-gold">Location</Link>
              <Link href="/login" className="block px-3 py-2 text-white hover:text-gold">Login</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Menu Header */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-3xl mb-2 text-gold">菜单</p>
          <p className="text-xl opacity-90">Authentic Chinese Cuisine</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === 'all' 
                  ? 'bg-red-800 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Items
            </button>
            {Object.entries(menuCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === key 
                    ? 'bg-red-800 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {Object.entries(menuCategories).map(([categoryKey, category]) => {
            if (selectedCategory !== 'all' && selectedCategory !== categoryKey) {
              return null;
            }
            
            return (
              <div key={categoryKey} className="mb-12">
                <h2 className="text-3xl font-bold text-red-900 mb-2">
                  {category.name}
                </h2>
                <p className="text-xl text-gray-600 mb-6">{category.nameZh}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-red-900">{item.name}</h3>
                          <p className="text-gray-600">{item.nameZh}</p>
                        </div>
                        <span className="text-xl font-bold text-gold">${item.price}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{item.description}</p>
                      {item.spicy > 0 && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Spicy Level:</span>
                          <span>{getSpicyIndicator(item.spicy)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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