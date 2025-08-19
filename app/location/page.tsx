'use client';

import Navigation from '../components/Navigation';
import Link from 'next/link';

export default function Location() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />

      {/* Location Header */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Us</h1>
          <p className="text-3xl mb-2 text-gold">餐厅位置</p>
          <p className="text-xl opacity-90">Visit Golden Dragon Restaurant</p>
        </div>
      </section>

      {/* Map and Information */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1639593849151!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>

            {/* Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Restaurant Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <h3 className="font-bold text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        123 Main Street<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🕐</span>
                    <div>
                      <h3 className="font-bold text-gray-900">Business Hours</h3>
                      <div className="text-gray-600">
                        <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                        <p>Friday - Saturday: 11:00 AM - 11:00 PM</p>
                        <p>Sunday: 12:00 PM - 10:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📞</span>
                    <div>
                      <h3 className="font-bold text-gray-900">Contact</h3>
                      <p className="text-gray-600">
                        Phone: (555) 123-4567<br />
                        Email: info@goldendragon.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🚗</span>
                    <div>
                      <h3 className="font-bold text-gray-900">Parking</h3>
                      <p className="text-gray-600">
                        Free parking available in the rear<br />
                        Valet service available Friday & Saturday evenings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">Getting Here</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🚇</span>
                    <p className="text-gray-600">Subway: Lines 4, 5, 6 to Union Square</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🚌</span>
                    <p className="text-gray-600">Bus: M14, M23 stop at Main & 5th</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🚕</span>
                    <p className="text-gray-600">Taxi/Uber: Drop-off at main entrance</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link 
                  href="/reservation" 
                  className="inline-block bg-gold text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105"
                >
                  Make a Reservation
                </Link>
              </div>
            </div>
          </div>

          {/* Special Events */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">Special Events & Catering</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🎉</span>
                <h3 className="font-bold text-gray-900 mb-2">Private Events</h3>
                <p className="text-gray-600">Host your special occasion in our private dining room</p>
              </div>
              <div className="text-center">
                <span className="text-4xl mb-3 block">🍱</span>
                <h3 className="font-bold text-gray-900 mb-2">Catering Services</h3>
                <p className="text-gray-600">Full catering menu available for all events</p>
              </div>
              <div className="text-center">
                <span className="text-4xl mb-3 block">🚚</span>
                <h3 className="font-bold text-gray-900 mb-2">Delivery</h3>
                <p className="text-gray-600">Free delivery within 5 miles for orders over $50</p>
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