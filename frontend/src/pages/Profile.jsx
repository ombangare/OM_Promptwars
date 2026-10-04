import { LogOut, ShieldCheck, UserRound, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SectionHeading from '../components/SectionHeading';

export default function Profile(){
  const {user,logout,history}=useApp(); const navigate=useNavigate();
  return <main className="workspace-page"><SectionHeading eyebrow="PROFILE" title="Your MindXray identity." text="Your account and analysis history are securely tied to your Supabase session."/>
    <section className="profile-card glass"><div className="profile-avatar">{user?.picture?<img src={user.picture} alt=""/>:user?.name?.[0]?.toUpperCase()}</div><div><span className="eyebrow">SIGNED IN</span><h2>{user?.name}</h2><p>{user?.email}</p></div><div className="profile-badges"><span><ShieldCheck size={15}/> Supabase Auth</span><span><UserRound size={15}/> Google / Email identity</span><span><BarChart3 size={15}/> {history.length} analyses</span></div><button className="btn dark" onClick={async()=>{await logout();navigate('/')}}><LogOut size={16}/> Sign out</button></section>
  </main>
}
