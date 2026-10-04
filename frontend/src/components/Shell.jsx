import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, History, Home, LogOut, Plus, UserRound } from "lucide-react";
import Logo from "./Logo";
import { useApp } from "../context/AppContext";

export default function Shell() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/analyze", label: "New Analysis", icon: Plus },
    { to: "/history", label: "History", icon: History },
    { to: "/about", label: "About", icon: UserRound },
  ];
  return <div className="app-shell">
    <header className="product-nav">
      <Logo dark />
      <nav aria-label="Workspace">{nav.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}><Icon size={15}/>{label}</NavLink>)}</nav>
      <div className="product-actions"><button className="circle-btn nav-circle" title="Notifications" aria-label="Notifications"><Bell size={16}/></button><div className="user-chip nav-user-chip"><span className="user-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</span><span>{user?.name?.split(" ")[0] || "Alex"}</span></div><button className="nav-logout" title="Sign out" aria-label="Sign out" onClick={()=>{logout();navigate("/")}}><LogOut size={15}/></button></div>
    </header>
    <div className="workspace">
      <div className="workspace-context"><span>{location.pathname === "/dashboard" ? "Overview" : location.pathname.replace("/", "").replaceAll("-", " ")}</span><span className="context-dot"></span><span>MindXray workspace</span></div>
      <Outlet />
    </div>
  </div>;
}
