import { NavLink } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const link = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              QualityCheck <span className="text-blue-600">Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
            <NavLink to="/new-inspection" className={link}>New Inspection</NavLink>
            <NavLink to="/client-view" className={link}>Client Portal</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
