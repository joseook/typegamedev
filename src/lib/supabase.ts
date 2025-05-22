import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Determinar a URL base do aplicativo para redirecionamentos
// Usar sempre a URL da Vercel em produção para evitar redirecionamentos para localhost
const getRedirectURL = () => {
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    return window.location.origin;
  }
  return 'https://typegamedev.vercel.app';
};

// Opções globais do cliente Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Helper para autenticação OAuth com URL de redirecionamento correta
export const signInWithGitHub = async () => {
  const redirectTo = getRedirectURL();
  return await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo }
  });
};