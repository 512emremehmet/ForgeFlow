
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import AdminDashboard from './components/AdminDashboard';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('customer_form');

  const renderView = () => {
    switch (currentView) {
      case 'customer_form':
        return <OrderForm onSuccess={() => setCurrentView('customer_orders')} />;
      case 'customer_orders':
        return <OrderList />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'manufacturer_dashboard':
        return <ManufacturerDashboard />;
      default:
        return <OrderForm onSuccess={() => setCurrentView('customer_orders')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow bg-slate-50">
        <div className="animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <i className="fas fa-cube text-white text-[10px]"></i>
            </div>
            <span className="font-bold text-slate-900 tracking-tight">ForgeFlow</span>
          </div>
          <p className="text-slate-400 text-xs">
            Precision 3D Printing Marketplace MVP &bull; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
