import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus } from '../types';

const SESSION_ID = '00000000-0000-0000-0000-000000000001';

const ManufacturerDashboard: React.FC = () => {
  const [manufacturerName, setManufacturerName] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- SUPABASE ---------------- */

  const fetchManufacturerOrders = async (name: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('manufacturer', name)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('SUPABASE FETCH ERROR:', error);
      throw error;
    }

    setOrders(data || []);
  };

  const saveWorkshopSession = async (name: string) => {
    const { error } = await supabase
      .from('manufacturer_session')
      .upsert({
        id: SESSION_ID,
        workshop_name: name,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('SESSION SAVE ERROR:', error);
      throw error;
    }
  };

  const loadWorkshopSession = async () => {
    const { data, error } = await supabase
      .from('manufacturer_session')
      .select('workshop_name')
      .eq('id', SESSION_ID)
      .single();

    if (error || !data) return;

    setManufacturerName(data.workshop_name);
    await fetchManufacturerOrders(data.workshop_name);
    setLoggedIn(true);
  };

  const clearWorkshopSession = async () => {
    await supabase
      .from('manufacturer_session')
      .delete()
      .eq('id', SESSION_ID);

    setLoggedIn(false);
    setManufacturerName('');
    setOrders([]);
  };

  /* ---------------- LIFECYCLE ---------------- */

  useEffect(() => {
    loadWorkshopSession();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturerName) return;

    setLoading(true);

    try {
      await saveWorkshopSession(manufacturerName);
      await fetchManufacturerOrders(manufacturerName);
      setLoggedIn(true);
    } catch (error: any) {
      console.error('LOGIN ERROR:', error);
      alert(error?.message || 'Failed to fetch workshop orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchManufacturerOrders(manufacturerName);
    } catch (error) {
      console.error('STATUS UPDATE ERROR:', error);
      alert('Failed to update status');
    }
  };

  const downloadFile = (fileUrl: string) => {
    if (!fileUrl) {
      alert('No file uploaded');
      return;
    }
    window.open(fileUrl, '_blank');
  };

  /* ---------------- UI ---------------- */

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl border p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Manufacturer Portal</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Enter your workshop name
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g. TechLabs 3D"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg"
            >
              {loading ? 'Loading...' : 'Access Workshop'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Active Workshop: {manufacturerName}
          </span>
          <h2 className="text-3xl font-bold mt-2">Current Assignments</h2>
        </div>
        <button
          onClick={clearWorkshopSession}
          className="text-sm text-slate-400 hover:text-slate-600"
        >
          Switch Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-20">
            No jobs assigned
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white border rounded-xl p-6">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-400">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-xs font-bold">{order.status}</span>
              </div>

              <h3 className="font-bold">{order.material}</h3>
              <p className="text-sm text-slate-500">
                Quantity: {order.quantity}
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Deadline: {new Date(order.deadline).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value as OrderStatus)
                  }
                  className="flex-1 border rounded p-2 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Shipped">Shipped</option>
                </select>

                <button
                  onClick={() => downloadFile(order.file_url)}
                  disabled={!order.file_url}
                  className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                >
                  ⬇
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
