import { CircleDot, GitCompare, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

function Node({ tone, icon: Icon, label, items }) {
  return <div className={`xnode ${tone}`}><div className="xnode-title"><span><Icon size={13}/></span>{label}</div><div className="xnode-items">{items?.slice(0,2).map((item,i)=><div key={i}>{item}</div>)}</div></div>;
}

export default function XrayMap({ map, onAssumption }) {
  return <div className="xray-map-pro">
    <div className="connector connector-a"></div><div className="connector connector-b"></div><div className="connector connector-c"></div>
    <div className="xcenter"><span>YOUR DECISION</span><strong>{map.decision}</strong><small>Reasoning core</small></div>
    <div className="xnode-grid">
      <Node tone="fact" icon={CircleDot} label="FACTS" items={map.facts}/>
      <Node tone="reason" icon={Lightbulb} label="REASONS" items={map.reasons}/>
      <Node tone="assumption" icon={ShieldAlert} label="ASSUMPTIONS" items={map.assumption_labels} />
      <Node tone="blind" icon={Sparkles} label="BLIND SPOTS" items={map.blind_spot_labels}/>
      <Node tone="conflict" icon={GitCompare} label="CONFLICTS" items={map.conflict_labels}/>
    </div>
    {map.assumption_labels?.length > 0 && <button className="map-hint" onClick={onAssumption}>Click an assumption to stress-test it →</button>}
  </div>;
}
