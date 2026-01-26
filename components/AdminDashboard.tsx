
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAll();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const handleAssignManufacturer = async (id: string, manufacturer: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ manufacturer: manufacturer === 'None' ? null : manufacturer })
        .eq('id', id);

      if (error) throw error;
      fetchAll();
    } catch (error) {
      console.error(error);
      alert('Failed to assign manufacturer');
    }
  };

  const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Shipped', 'Cancelled'];
  const manufacturers = ['None', 'TechLabs 3D', 'RapidProto Hub', 'Precision Prints', 'EcoFab'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500">Assign orders to manufacturers and track global status.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
             <span className="block text-2xl font-bold text-indigo-600">{orders.length}</span>
             <span className="text-xs text-slate-500 uppercase font-semibold">Total</span>
           </div>
           <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">
             <span className="block text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'Pending').length}</span>
             <span className="text-xs text-slate-500 uppercase font-semibold">Queue</span>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Specs</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Assignee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <div className="text-xs text-slate-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{order.material}</div>
                    <div className="text-xs text-slate-500">Qty: {order.quantity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md p-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.manufacturer || 'None'}
                      onChange={(e) => handleAssignManufacturer(order.id, e.target.value)}
                      className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md p-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      {manufacturers.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <i className="fas fa-external-link-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
