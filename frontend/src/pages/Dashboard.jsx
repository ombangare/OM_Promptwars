import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Plus, ShieldAlert, Sparkles, Swords, LoaderCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useApp } from '../context/AppContext';

export default function Dashboard(){
  const { user, history, historyLoading, loadAnalysisItem } = useApp();
  const cards = history.slice(0,3);
  return <main className="workspace-page">
    <section className="welcome-card"><div className="welcome-icon"><Sparkles size={22}/></div><div><span className="eyebrow">YOUR REASONING WORKSPACE</span><h1>Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1><p>Ready to think a little deeper about your next decision?</p></div><Link className="btn gold" to="/analyze"><Plus size={18}/> New Decision Analysis</Link></section>
    <SectionHeading eyebrow="RECENT ANALYSES" title="Your latest reasoning snapshots." action={<Link className="view-all" to="/history">View all <ArrowRight size={15}/></Link>}/>
    {historyLoading ? <div className="empty-state"><LoaderCircle className="spin"/> Loading your analyses…</div> : cards.length ? <section className="recent-grid">{cards.map((item,i)=><article className="recent-card" key={item.analysis_id}><div className={`recent-symbol ${['blue','gold','pink'][i%3]}`}><ShieldAlert size={17}/></div><div className="recent-main"><div><h3>{item.title || 'Untitled analysis'}</h3><span>{new Date(item.created_at).toLocaleString()}</span></div><div className="recent-status"><b>{item.insights}</b> insights <span>Completed</span></div></div><Link aria-label={`Open ${item.title || 'analysis'}`} to="/results" onClick={()=>loadAnalysisItem(item.analysis_id)}><ArrowRight size={17}/></Link></article>)}</section> : <div className="empty-panel"><h3>No analyses yet.</h3><p>Your first reasoning X-Ray will appear here.</p><Link className="btn soft" to="/analyze">Create your first analysis <ArrowRight size={16}/></Link></div>}
    <SectionHeading eyebrow="HOW MINDXRAY HELPS" title="Four lenses on one decision." />
    <section className="dashboard-lenses"><article><span>01</span><div className="lens-icon blue"><ShieldAlert/></div><h3>Identify assumptions</h3><p>Uncover what you're taking for granted.</p></article><article><span>02</span><div className="lens-icon cyan"><Sparkles/></div><h3>Find blind spots</h3><p>Discover overlooked factors and second-order effects.</p></article><article><span>03</span><div className="lens-icon red"><Swords/></div><h3>Spot conflicts</h3><p>Identify where your priorities may compete.</p></article><article><span>04</span><div className="lens-icon gold"><Eye/></div><h3>Explore questions</h3><p>Get prompts worth investigating before you decide.</p></article></section>
    <section className="dashboard-bottom"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Put your next decision under the lens.</h2></div><Link className="btn dark" to="/analyze">Start a new analysis <ArrowRight size={18}/></Link></section>
  </main>
}
