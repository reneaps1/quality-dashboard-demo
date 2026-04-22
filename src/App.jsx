import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InspectionProvider } from './context/InspectionContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import InspectionForm from './pages/InspectionForm';
import ClientView from './pages/ClientView';

export default function App() {
  return (
    <InspectionProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/new-inspection" element={<InspectionForm />} />
            <Route path="/client-view"    element={<ClientView />} />
          </Routes>
        </div>
      </BrowserRouter>
    </InspectionProvider>
  );
}
