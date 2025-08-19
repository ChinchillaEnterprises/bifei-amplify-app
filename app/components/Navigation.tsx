'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userAttributes, userGroups, signOutUser, isInGroup } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/');
    router.refresh();
  };

  // Determine what name to display
  const getDisplayName = () => {
    if (userAttributes?.preferred_username) {
      return userAttributes.preferred_username;
    }
    if (userAttributes?.email) {
      return userAttributes.email.split('@')[0];
    }
    if (user?.signInDetails?.loginId) {
      return user.signInDetails.loginId.split('@')[0];
    }
    if (user?.username) {
      return user.username;
    }
    return 'User';
  };

  return (
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
            <Link href="/delivery" className="text-white hover:text-gold transition">Delivery</Link>
            <Link href="/reservation" className="text-white hover:text-gold transition">Reservation</Link>
            <Link href="/location" className="text-white hover:text-gold transition">Location</Link>
            
            {/* Role-based navigation */}
            {user && isInGroup('restaurantHost') && (
              <Link href="/admin/host" className="text-white hover:text-gold transition">Host Dashboard</Link>
            )}
            {user && isInGroup('maintenance') && (
              <Link href="/admin/maintenance" className="text-white hover:text-gold transition">Admin</Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gold text-sm font-semibold">
                  👤 Welcome, {getDisplayName()}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="bg-gold text-red-900 px-3 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signup" className="text-white hover:text-gold transition font-semibold">
                  Sign Up
                </Link>
                <Link href="/login" className="bg-gold text-red-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold">
                  Login
                </Link>
              </div>
            )}
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
            <Link href="/delivery" className="block px-3 py-2 text-white hover:text-gold">Delivery</Link>
            <Link href="/reservation" className="block px-3 py-2 text-white hover:text-gold">Reservation</Link>
            <Link href="/location" className="block px-3 py-2 text-white hover:text-gold">Location</Link>
            
            {/* Role-based navigation for mobile */}
            {user && isInGroup('restaurantHost') && (
              <Link href="/admin/host" className="block px-3 py-2 text-white hover:text-gold">Host Dashboard</Link>
            )}
            {user && isInGroup('maintenance') && (
              <Link href="/admin/maintenance" className="block px-3 py-2 text-white hover:text-gold">Admin</Link>
            )}
            
            {user ? (
              <>
                <div className="block px-3 py-2 text-gold text-sm font-semibold">
                  👤 Welcome, {getDisplayName()}
                </div>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-white hover:text-gold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-white hover:text-gold">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}