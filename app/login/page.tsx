'use client';

import Navigation from '../components/Navigation';
import { Authenticator, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';
import { useEffect } from 'react';

// Custom theme matching Golden Dragon restaurant colors
const customTheme: Theme = {
  name: 'golden-dragon-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#fef3c7',
          20: '#fde68a',
          40: '#fbbf24',
          60: '#f59e0b',
          80: '#d97706',
          90: '#b45309',
          100: '#92400e',
        },
      },
      background: {
        primary: '#ffffff',
        secondary: '#fef3c7',
      },
    },
    components: {
      authenticator: {
        router: {
          borderColor: '#d97706',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
      button: {
        primary: {
          backgroundColor: '#991b1b',
          color: '#ffffff',
          borderColor: '#991b1b',
          _hover: {
            backgroundColor: '#7f1d1d',
            borderColor: '#7f1d1d',
          },
        },
        link: {
          color: '#991b1b',
          _hover: {
            color: '#7f1d1d',
          },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: '#d97706',
        },
      },
      tabs: {
        item: {
          _active: {
            color: '#991b1b',
            borderColor: '#991b1b',
          },
          _hover: {
            color: '#d97706',
          },
        },
      },
    },
  },
};

export default function Login() {
  const router = useRouter();
  const { checkUser } = useAuth();
  
  // Refresh auth state when user signs in
  useEffect(() => {
    const interval = setInterval(() => {
      checkUser();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [checkUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 py-12">
        <div className="max-w-4xl mx-auto text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-2">Welcome to Golden Dragon</h1>
          <p className="text-xl text-gold">金龙餐厅会员中心</p>
          <p className="mt-4 text-red-100">Join our family for exclusive offers and easy reservations</p>
        </div>
      </div>

      {/* Authentication Section */}
      <section className="py-12 px-4 -mt-8">
        <div className="max-w-lg mx-auto">
          <ThemeProvider theme={customTheme}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gold">
              {/* Decorative Header */}
              <div className="bg-gradient-to-r from-gold to-yellow-400 p-4 text-center">
                <span className="text-3xl">🥟</span>
                <h2 className="text-red-900 font-bold text-lg mt-2">Member Portal</h2>
              </div>
              
              <div className="p-6">
                <Authenticator
                  socialProviders={['google']}
                  formFields={{
                    signUp: {
                      preferred_username: {
                        label: 'Preferred Name',
                        placeholder: 'How should we address you?',
                        isRequired: false,
                        order: 1
                      },
                      phone_number: {
                        label: 'Phone Number',
                        placeholder: 'For reservation confirmations',
                        isRequired: false,
                        order: 2
                      }
                    }
                  }}
                  components={{
                    SignIn: {
                      Header() {
                        return (
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-red-900">Welcome Back!</h3>
                            <p className="text-gray-600 mt-2">Sign in to access your account</p>
                          </div>
                        );
                      },
                    },
                    SignUp: {
                      Header() {
                        return (
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-red-900">Create Account</h3>
                            <p className="text-gray-600 mt-2">Join Golden Dragon family today!</p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                              <p className="text-sm text-yellow-800">
                                <span className="font-semibold">🎁 New Member Bonus:</span> Get 10% off your first order!
                              </p>
                            </div>
                          </div>
                        );
                      },
                    },
                  }}
                >
                  {({ signOut, user }) => (
                    <div className="text-center">
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-800 to-red-600 rounded-full mb-4">
                          <span className="text-3xl text-white">👤</span>
                        </div>
                        <h1 className="text-2xl font-bold text-red-900 mb-2">
                          Welcome, {user?.signInDetails?.loginId?.split('@')[0] || 'User'}!
                        </h1>
                        <p className="text-gray-600">
                          You are now signed in to Golden Dragon
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Member Benefits */}
                        <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-6 border border-gold">
                          <h3 className="font-bold text-red-900 mb-3">Your Member Benefits</h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gold">✓</span>
                              <span className="text-gray-700">10% off first order</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gold">✓</span>
                              <span className="text-gray-700">Priority reservations</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gold">✓</span>
                              <span className="text-gray-700">Birthday specials</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gold">✓</span>
                              <span className="text-gray-700">Exclusive offers</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="grid gap-3">
                          <Link 
                            href="/reservation" 
                            className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-500 transition transform hover:scale-105 inline-block text-center shadow-lg"
                          >
                            🍽️ Make a Reservation
                          </Link>
                          
                          <Link 
                            href="/menu" 
                            className="w-full bg-gradient-to-r from-gold to-yellow-400 text-red-900 py-3 px-4 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-300 transition transform hover:scale-105 inline-block text-center shadow-lg"
                          >
                            📜 Browse Our Menu
                          </Link>
                          
                          <Link 
                            href="/delivery" 
                            className="w-full bg-white text-red-900 border-2 border-red-800 py-3 px-4 rounded-lg font-semibold hover:bg-red-50 transition transform hover:scale-105 inline-block text-center"
                          >
                            🚚 Order Delivery
                          </Link>
                        </div>
                        
                        {/* Account Info */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-gray-700 mb-3">Account Information</h3>
                          <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Email:</span>
                              <span>{user?.signInDetails?.loginId}</span>
                            </div>
                            {/* Additional user attributes can be displayed here */}
                            {false && (
                              <div className="flex justify-between">
                                <span className="font-medium">Phone:</span>
                                <span>N/A</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="font-medium">Member ID:</span>
                              <span className="text-xs">{user?.userId?.substring(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Sign Out */}
                        <div className="pt-4 border-t">
                          <button 
                            onClick={signOut}
                            className="text-red-600 hover:text-red-700 font-medium transition"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Authenticator>
              </div>

              {/* Decorative Footer */}
              <div className="bg-gradient-to-r from-red-900 to-red-700 p-4 text-center text-white text-sm">
                <p>🏮 Authentic Chinese Cuisine Since 1985 🏮</p>
              </div>
            </div>
          </ThemeProvider>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center space-x-8 text-gray-500">
            <div className="text-center">
              <span className="text-2xl">🔒</span>
              <p className="text-xs mt-1">Secure Login</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">🛡️</span>
              <p className="text-xs mt-1">Protected Data</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">✨</span>
              <p className="text-xs mt-1">Member Benefits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">© 2024 Golden Dragon Restaurant | 金龙餐厅</p>
          <p className="text-sm opacity-75">Serving authentic Chinese cuisine with pride</p>
        </div>
      </footer>
    </div>
  );
}