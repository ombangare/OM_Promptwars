import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const finish = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) throw new Error('No authenticated session was returned.');
        if (active) navigate('/dashboard', { replace: true });
      } catch (e) {
        if (active) setError(e.message || 'Authentication could not be completed.');
      }
    };
    finish();
    return () => { active = false; };
  }, [navigate]);

  return <main className="auth-loading"><div className="auth-loading-card">
    {error ? <><strong>Google sign-in could not be completed.</strong><p>{error}</p><button className="btn gold" onClick={() => navigate('/login')}>Back to sign in</button></> : <><ShieldCheck size={28}/><strong>Securing your MindXray session…</strong><LoaderCircle className="spin" size={18}/></>}
  </div></main>;
}
