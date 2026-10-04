import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Shell from './components/Shell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import Results from './pages/Results';
import StressTest from './pages/StressTest';
import History from './pages/History';
import About from './pages/About';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return <AppProvider><Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/auth/callback" element={<AuthCallback/>}/>
    <Route path="/about" element={<About/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<Shell/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/analyze" element={<NewAnalysis/>}/>
        <Route path="/results" element={<Results/>}/>
        <Route path="/stress-test" element={<StressTest/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Route>
    </Route>
    <Route path="*" element={<NotFound/>}/>
  </Routes></AppProvider>;
}
