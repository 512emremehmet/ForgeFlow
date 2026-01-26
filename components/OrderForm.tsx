
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface OrderFormProps {
  onSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    material: 'PLA (Matte Black)',
    quantity: 1,
    deadline: '',
  });

  const filamentTypes = [
    'PLA (Standard)', 'PLA (Matte Black)', 'PLA+ (Tough)', 
    'PETG (Translucent)', 'PETG (Solid)', 'ABS (High Temp)', 
    'ASA (UV Resistant)', 'TPU (Flexible)', 'Nylon (Industrial)', 
    'Carbon Fiber PETG', 'Wood-filled PLA', 'Silk PLA (Shiny)'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setBucketError(null);
    }
  };

  const submitOrder = async (fileUrl: string = '') => {
  const { error: insertError } = await supabase
    .from('orders')
    .insert([{ 
      ...formData, 
      email: formData.email.trim().toLowerCase(),  // Değişiklik burada
      file_url: fileUrl 
    }]);

  if (insertError) throw insertError;

  alert('Order submitted successfully!');
  onSuccess();
};

  const handleSubmit = async (e: React.FormEvent, skipFile: boolean = false) => {
    if (e) e.preventDefault();
    
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please check your environment variables.");
      return;
    }

    setLoading(true);
    try {
      let file_url = '';

      // 1. Handle File Upload if exists and not skipping
      if (file && !skipFile) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('parts')
          .upload(filePath, file);

        if (uploadError) {
          if (uploadError.message === 'Bucket not found') {
            setBucketError("The storage bucket 'parts' does not exist yet.");
            setLoading(false);
            return;
          }
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('parts')
          .getPublicUrl(filePath);
        
        file_url = publicUrl;
      }

      // 2. Insert Order
      await submitOrder(file_url);
    } catch (error: any) {
      console.error('Submission error:', error);
      alert('Error: ' + (error.message || 'An unexpected error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      {!isSupabaseConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          <strong>Configuration Required:</strong> Supabase environment variables are missing.
        </div>
      )}

      {bucketError && (
        <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl text-red-800 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-folder-open text-red-600"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Bucket Not Found</h3>
              <p className="text-sm mb-4 opacity-80">You need to create a storage bucket in your Supabase dashboard to allow file uploads.</p>
              
              <div className="bg-white/50 rounded-lg p-3 text-xs mb-4 border border-red-100">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>Storage</strong> in Supabase</li>
                  <li>Click <strong>New Bucket</strong></li>
                  <li>Name it <strong>parts</strong></li>
                  <li>Set to <strong>Public</strong></li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => window.open('https://supabase.com/dashboard/project/kzvfdxzjesorttypozdd/storage/buckets', '_blank')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Go to Supabase Dashboard
                </button>
                <button 
                  onClick={() => handleSubmit(null as any, true)}
                  className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  Submit Order Without File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">3D Printing Service</h2>
        <p className="text-slate-500 mb-8 text-sm">Select your filament and upload your STL file for a quote.</p>
        
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Filament Type</label>
              <select
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              >
                {filamentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Requested Deadline</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload CAD Model (STL/OBJ)</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
              <div className="space-y-1 text-center">
                <i className={`fas ${file ? 'fa-file-alt text-indigo-500' : 'fa-cube text-slate-400'} text-3xl mb-2`}></i>
                <div className="flex text-sm text-slate-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>{file ? file.name : 'Upload file'}</span>
                    <input type="file" className="sr-only" onChange={handleFileChange} accept=".stl,.obj,.step,.pdf" />
                  </label>
                  {!file && <p className="pl-1 text-slate-500">or drag and drop</p>}
                </div>
                <p className="text-xs text-slate-400">STL, STEP, or PNG up to 20MB</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : null}
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
