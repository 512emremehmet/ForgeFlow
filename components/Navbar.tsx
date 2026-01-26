
import React from 'react';
import { ViewType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('customer_form')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-cube text-white text-xs"></i>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ForgeFlow</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => setView('customer_form')}
              className={`text-sm font-medium transition-colors ${currentView === 'customer_form' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Order Service
            </button>
            <button 
              onClick={() => setView('customer_orders')}
              className={`text-sm font-medium transition-colors ${currentView === 'customer_orders' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              My Status
            </button>
            <div className="w-[1px] h-4 bg-slate-200 self-center"></div>
            <button 
              onClick={() => setView('manufacturer_dashboard')}
              className={`text-sm font-medium transition-colors ${currentView === 'manufacturer_dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Manufacturer Portal
            </button>
            <button 
              onClick={() => setView('admin_dashboard')}
              className={`text-sm font-medium transition-colors ${currentView === 'admin_dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Admin
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <select 
              value={currentView}
              onChange={(e) => setView(e.target.value as ViewType)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2"
            >
              <option value="customer_form">New Order</option>
              <option value="customer_orders">Status</option>
              <option value="manufacturer_dashboard">Manufacturer</option>
              <option value="admin_dashboard">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
