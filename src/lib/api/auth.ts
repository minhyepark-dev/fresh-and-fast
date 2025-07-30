// lib/supabase/auth.ts
import { supabase } from '@/lib/supabaseClient';

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function registerUserProfile(userId: string, name: string, email: string) {
  const { error } = await supabase.from('user_profiles').insert([
    {
      id: userId,
      name,
      email,
    },
  ]);
  return error;
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null;
  }
  return data.user;
};

export function onAuthChange(callback: (userId: string | null) => void) {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    const userId = session?.user?.id ?? null;
    callback(userId);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}
