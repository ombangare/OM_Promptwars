import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Eye, Search, Trash2, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SectionHeading from '../components/SectionHeading';

export default function History(){
  const {history,historyLoading,loadAnalysisItem,deleteHistoryItem}=useApp();
  const [query,setQuery]=useState('');
  const [deleting,setDeleting]=useState('');
  const filtered=useMemo(()=>history.filter(x=>(x.title||'').toLowerCase().includes(query.toLowerCase())),[history,query]);
  const del=async(item)=>{if(!confirm(`Delete “${item.title || 'this analysis'}”?`))return;setDeleting(item.decision_id);try{await deleteHistoryItem(item.decision_id)}finally{setDeleting('')}};
  return <main className="workspace-page"><SectionHeading eyebrow="HISTORY" title="Your reasoning archive." text="Revisit what you thought, what you may have missed, and what you chose to investigate."/>
    <div className="history-toolbar"><div className="history-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search analyses..." aria-label="Search analyses"/></div><div className="history-filter"><CalendarDays size={16}/> All time</div></div>
    {historyLoading ? <div className="empty-state"><LoaderCircle className="spin"/> Loading history…</div> : filtered.length ? <section className="history-list">{filtered.map((item)=><article className="history-row" key={item.analysis_id}><div className="history-thumb"><Eye/></div><div className="history-info"><h3>{item.title||'Untitled analysis'}</h3><span>{new Date(item.created_at).toLocaleString()}</span></div><div className="history-metrics"><b>{item.insights}</b><span>insights</span></div><span className="history-status">Completed</span><Link to="/results" onClick={()=>loadAnalysisItem(item.analysis_id)} className="history-open" aria-label={`Open ${item.title || 'analysis'}`}><ArrowRight size={18}/></Link><button className="history-delete" onClick={()=>del(item)} disabled={deleting===item.decision_id} aria-label={`Delete ${item.title || 'analysis'}`}>{deleting===item.decision_id?<LoaderCircle className="spin" size={17}/>:<Trash2 size={17}/>}</button></article>)}</section> : <div className="empty-panel"><h3>No matching analyses.</h3><p>Try another search or create a new reasoning X-Ray.</p></div>}
    <div className="history-note"><span>Tip</span> Your most useful next step is often to stress-test the assumption you felt most confident about.</div>
  </main>
}
