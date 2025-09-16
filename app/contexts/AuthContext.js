"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Fetch credits when user changes
        if (session?.user) {
          try {
            const response = await fetch('/api/session', { cache: 'no-store' });
            const data = await response.json();
            if (typeof data?.balance === 'number') {
              setCredits(data.balance);
            }
          } catch (error) {
            console.error('Failed to fetch credits:', error);
          }
        } else {
          setCredits(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshCredits = async () => {
    try {
      const response = await fetch('/api/session', { cache: 'no-store' });
      const data = await response.json();
      if (typeof data?.balance === 'number') {
        setCredits(data.balance);
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  const value = {
    user,
    loading,
    credits,
    signOut,
    refreshCredits,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};