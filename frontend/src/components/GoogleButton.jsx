import { useState } from 'react';
import { Chrome } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GoogleButton({ compact = false }) {
  const { signInWithGoogle } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (e) {
      setError(e.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  return <div className="google-stack">
    <button type="button" className="google-preview" onClick={handleClick} disabled={loading} aria-label="Continue with Google">
      <span className="google-g"><Chrome size={18}/></span>
      {loading ? 'Connecting…' : 'Continue with Google'}
    </button>
    {!compact && <div className="preview-note">Secure authentication powered by Supabase Auth + Google.</div>}
    {error && <div className="error-text" role="alert">{error}</div>}
  </div>;
}
