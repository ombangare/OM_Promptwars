import { ArrowUpRight, ShieldAlert, Sparkles, Swords, TriangleAlert } from 'lucide-react';

const map = { assumption:{icon:ShieldAlert,label:'ASSUMPTION',className:'assumption'}, blind:{icon:Sparkles,label:'BLIND SPOT',className:'blind'}, conflict:{icon:Swords,label:'CONFLICT',className:'conflict'}, evidence:{icon:TriangleAlert,label:'EVIDENCE GAP',className:'evidence'} };

export default function InsightCard({ type, title, description, footer, onClick }) {
  const item = map[type] || map.blind; const Icon = item.icon;
  return <button className={`insight-card ${item.className}`} onClick={onClick} type="button">
    <div className="insight-meta"><span className="insight-icon"><Icon size={16}/></span><span>{item.label}</span><ArrowUpRight size={15} className="insight-arrow"/></div>
    <h3>{title}</h3><p>{description}</p>{footer && <small>{footer}</small>}
  </button>;
}
