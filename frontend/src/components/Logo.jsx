import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ dark = false }) {
  return <Link className={`logo ${dark ? 'dark' : ''}`} to="/">
    <span className="logo-icon"><BrainCircuit size={21}/></span>
    <span>Mind<span>Xray</span></span>
  </Link>;
}
