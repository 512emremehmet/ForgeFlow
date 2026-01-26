
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200',
    'Shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      {status}
    </span>
  );
};

const OrderList: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email.trim().toLowerCase())  // Değişiklik burada
      .order('created_at', { ascending: false });

    if (error) throw error;
    setOrders(data || []);
    setSearched(true);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Track Your Orders</h2>
        <p className="text-slate-500">Enter your email to see status updates on your manufacturing requests.</p>
        
        <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Track'}
          </button>
        </form>
      </div>

      {searched && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <i className="fas fa-search text-slate-300 text-4xl mb-4"></i>
              <p className="text-slate-500">No orders found for this email address.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{order.material}</h3>
                  <p className="text-sm text-slate-500">Qty: {order.quantity} • Target Date: {new Date(order.deadline).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <i className="fas fa-file-download mr-2"></i>Drawing
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;
