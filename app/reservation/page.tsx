'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Reservation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Reservation submitted successfully! We will contact you soon to confirm.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        specialRequests: ''
      });
    }, 2000);
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 11; hour <= 21; hour++) {
    timeSlots.push(`${hour}:00`);
    if (hour < 21) timeSlots.push(`${hour}:30`);
  }

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

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
              <Link href="/reservation" className="text-gold">Reservation</Link>
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
              <Link href="/reservation" className="block px-3 py-2 text-gold">Reservation</Link>
              <Link href="/location" className="block px-3 py-2 text-white hover:text-gold">Location</Link>
              <Link href="/login" className="block px-3 py-2 text-white hover:text-gold">Login</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Reservation Header */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Make a Reservation</h1>
          <p className="text-3xl mb-2 text-gold">预订座位</p>
          <p className="text-xl opacity-90">Book your table at Golden Dragon</p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-red-900 mb-6">Reserve Your Table</h2>
                
                {submitMessage && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                        <option value="11+">Large Party (11+)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={today}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any dietary restrictions, special occasions, or seating preferences..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-800 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">Reservation Policy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Reservations are held for 15 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Large parties (8+) require a deposit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Cancellations must be made 2 hours in advance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Special dietary needs? Let us know!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">Contact Us</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📞</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p>(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p>reservations@goldendragon.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🕐</span>
                    <div>
                      <p className="font-semibold">Hours</p>
                      <p>Mon-Thu: 11am-10pm</p>
                      <p>Fri-Sun: 11am-11pm</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-100 rounded-lg p-6 text-center">
                <p className="text-red-900 font-semibold mb-2">Walk-ins Welcome!</p>
                <p className="text-gray-700">No reservation? We always save tables for walk-in guests.</p>
              </div>
            </div>
          </div>
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