import { Link } from 'react-router-dom';
import { ArrowRight, Check, Eye, KeyRound, Sparkles, Target } from 'lucide-react';
import BrainScene from '../components/BrainScene';
import GoogleButton from '../components/GoogleButton';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { user } = useApp();
  return <main className="landing">
    <header className="landing-nav">
      <Logo dark/>
      <nav><a href="#features">Features</a><a href="#how">How it works</a><Link to="/about">About</Link></nav>
      <div className="landing-actions">{user ? <Link className="nav-dark-btn" to="/dashboard">Open workspace <ArrowRight size={15}/></Link> : <Link className="nav-google" to="/login"><span>G</span> Sign in with Google</Link>}</div>
    </header>
    <section className="landing-hero">
      <div className="landing-copy">
        <div className="gold-pill"><Sparkles size={14}/> AI-POWERED DECISION CLARITY</div>
        <h1>See What Your<br/><span>Reasoning Misses.</span></h1>
        <p>MindXray helps you uncover hidden assumptions, blind spots, conflicts and missing evidence — so you can think more clearly without handing over your decision.</p>
        <div className="landing-cta">{user ? <Link className="btn gold" to="/analyze">Start Analyzing <ArrowRight size={18}/></Link> : <GoogleButton/>}<Link className="btn demo-dark" to="/about"><Eye size={18}/> Watch how it works</Link></div>
        <div className="landing-proof"><div><span className="proof-icon"><Target size={16}/></span><strong>Think deeper</strong><small>Make better decisions</small></div><div><span className="proof-icon"><KeyRound size={16}/></span><strong>Identify blind spots</strong><small>In your reasoning</small></div><div><span className="proof-icon"><Check size={16}/></span><strong>100% your decision</strong><small>We don't decide for you</small></div></div>
      </div>
      <BrainScene/>
    </section>
    <section className="landing-features" id="features"><div className="landing-feature-title"><span className="eyebrow">WHY MINDXRAY</span><h2>A reasoning lens, not an answer engine.</h2><p>The product is deliberately designed around the problem statement: expose what is missing, question what is assumed, and keep agency with the user.</p></div><div className="feature-row"><article><div className="round-icon blue"><Eye/></div><span>01</span><h3>Reasoning X-Ray</h3><p>Visualize the anatomy of a decision — facts, reasons, assumptions, blind spots and conflicts.</p></article><article><div className="round-icon gold"><Sparkles/></div><span>02</span><h3>Assumption Stress Test</h3><p>Pick an assumption and pressure-test it with evidence, counter-cases and verification steps.</p></article><article><div className="round-icon navy"><KeyRound/></div><span>03</span><h3>Critical Questions</h3><p>Surface questions that could materially change the quality of your reasoning.</p></article></div></section>
    <section className="rule-banner" id="how"><div><span className="eyebrow">THE MINDXRAY RULE</span><h2>We never tell you what to choose.</h2></div><p>We challenge the reasoning behind the choice so you can make your own call with fewer hidden assumptions.</p></section>
  </main>;
}
