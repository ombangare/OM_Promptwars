import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, CheckCircle2, Eye, KeyRound, LockKeyhole, Sparkles } from 'lucide-react';
import GoogleButton from '../components/GoogleButton';
import BrainScene from '../components/BrainScene';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { user, signInWithPassword, signUpWithPassword } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate(location.state?.from || '/dashboard', { replace: true }); }, [user, location.state, navigate]);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setInfo('');
    try {
      if (mode === 'signup') {
        const data = await signUpWithPassword(email, password);
        if (!data.session) setInfo('Account created. Check your email if email confirmation is enabled, then sign in.');
        else navigate('/dashboard', { replace: true });
      } else {
        await signInWithPassword(email, password);
        navigate(location.state?.from || '/dashboard', { replace: true });
      }
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return <main className="auth-page"><div className="auth-visual"><div className="auth-brand"><Logo dark/></div><div className="auth-scene"><BrainScene/></div><div className="auth-copy"><span className="gold-pill"><Sparkles size={14}/> MINDXRAY</span><h1>Clarity begins when the obvious stops being enough.</h1><p>Bring your reasoning. We'll help you examine it.</p><div className="auth-mini-points"><span><CheckCircle2 size={14}/> Assumptions</span><span><Eye size={14}/> Blind spots</span><span><KeyRound size={14}/> Critical questions</span></div></div></div><div className="auth-panel"><Link className="back-link" to="/"><ArrowLeft size={16}/> Back to home</Link><div className="auth-card"><span className="auth-kicker">{mode === 'signup' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</span><BrainCircuit className="auth-icon"/><h2>{mode === 'signup' ? 'Create your MindXray account' : 'Sign in to MindXray'}</h2><p>{mode === 'signup' ? 'Keep your analyses securely linked to your account.' : 'Sign in to start exploring your reasoning with AI.'}</p><div className="google-auth-wrap"><GoogleButton/></div><div className="auth-divider"><span>Or use email</span></div><form onSubmit={submit} className="auth-form"><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required/></label><button className="auth-submit" disabled={loading}>{loading ? (mode === 'signup' ? 'Creating…' : 'Signing in…') : (mode === 'signup' ? 'Create account' : 'Sign In')}</button>{error&&<div className="error-text" role="alert">{error}</div>}{info&&<div className="success-text" role="status">{info}</div>}</form><button type="button" className="auth-switch" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setInfo('')}}>{mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}</button><div className="auth-foot"><LockKeyhole size={13}/> Authentication and session handling are powered by Supabase Auth.</div><div className="auth-rule">MindXray analyzes reasoning — not your final choice.</div></div></div></main>;
}
