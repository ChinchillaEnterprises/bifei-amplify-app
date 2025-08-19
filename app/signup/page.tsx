'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setIsConfirming(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode,
      });
      
      if (isSignUpComplete) {
        // Sign in automatically after confirmation
        await signIn({
          username: email,
          password,
        });
        
        // Show success message based on email
        if (email === 'haobifei@gmail.com') {
          alert('Success! You have been assigned as a Restaurant Host.');
        } else if (email === 'admin@goldendragon.com') {
          alert('Success! You have been assigned as a Maintenance Admin.');
        } else {
          alert('Success! You have been registered as a Customer.');
        }
        
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to confirm sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-red-900 mb-6 text-center">
              {isConfirming ? 'Confirm Your Account' : 'Create Account'}
            </h2>

            {/* Test User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Test Users:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Restaurant Host:</strong> haobifei@gmail.com / haobifei</li>
                <li>• <strong>Maintenance:</strong> admin@goldendragon.com / Admin123!</li>
                <li>• <strong>Customer:</strong> Any other email</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!isConfirming ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Re-enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-800 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirm} className="space-y-4">
                <p className="text-gray-600 mb-4">
                  We've sent a confirmation code to {email}. Please enter it below.
                </p>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmation Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Enter 6-digit code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-800 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Confirming...' : 'Confirm Account'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <a href="/login" className="text-red-600 hover:text-red-700">
                Already have an account? Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}