'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser, signOut, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

interface AuthContextType {
  user: any;
  userAttributes: any;
  userGroups: string[];
  loading: boolean;
  checkUser: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isInGroup: (group: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userAttributes: null,
  userGroups: [],
  loading: true,
  checkUser: async () => {},
  signOutUser: async () => {},
  isInGroup: () => false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userAttributes, setUserAttributes] = useState<any>(null);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Fetch user attributes
      try {
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      } catch (err) {
        console.log('Could not fetch attributes:', err);
      }
      
      // Fetch user groups from session
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload?.['cognito:groups'] as string[] || [];
        setUserGroups(groups);
      } catch (err) {
        console.log('Could not fetch user groups:', err);
        setUserGroups([]);
      }
    } catch {
      setUser(null);
      setUserAttributes(null);
      setUserGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut();
      setUser(null);
      setUserAttributes(null);
      setUserGroups([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isInGroup = (group: string): boolean => {
    return userGroups.includes(group);
  };

  useEffect(() => {
    checkUser();

    // Listen for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          setUserAttributes(null);
          setUserGroups([]);
          break;
        case 'tokenRefresh':
          checkUser();
          break;
        case 'tokenRefresh_failure':
          setUser(null);
          setUserAttributes(null);
          setUserGroups([]);
          break;
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userAttributes, userGroups, loading, checkUser, signOutUser, isInGroup }}>
      {children}
    </AuthContext.Provider>
  );
}