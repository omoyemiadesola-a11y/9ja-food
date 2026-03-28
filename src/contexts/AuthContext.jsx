import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ADMIN_EMAIL, supabase } from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localAdmin, setLocalAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    const isLocalAdmin = localAdmin && !user;
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL || localAdmin;

    return {
      session,
      user,
      isAdmin,
      isLocalAdmin,
      loading,
      async signUp(email, password, fullName) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        return data;
      },
      async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        localStorage.removeItem('isAdmin');
        setLocalAdmin(false);
      },
      enableLocalAdmin() {
        localStorage.setItem('isAdmin', 'true');
        setLocalAdmin(true);
      },
      clearLocalAdmin() {
        localStorage.removeItem('isAdmin');
        setLocalAdmin(false);
      },
    };
  }, [loading, localAdmin, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}
