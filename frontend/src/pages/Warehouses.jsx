import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Box, History, Plus, X } from 'lucide-react';

const Warehouses = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    code: '',
    location: '',
    contactPerson: '',
    description: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/warehouses');
      setWarehouses(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      setError('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/warehouses', newWarehouse);
      setWarehouses([...warehouses, response.data]);
      setIsAddModalOpen(false);
      setNewWarehouse({
        name: '',
        code: '',
        location: '',
        contactPerson: '',
        description: ''
      });
      setError('');
    } catch (err) {
      console.error('Error adding warehouse:', err);
      setError(err.response?.data?.message || 'Failed to add warehouse');
    }
  };

  const getUsedCapacity = (warehouseId) => {
    // This would need to be calculated from stock data
    // For now, return 0 as placeholder
    return 0;
  };

  if (loading) {
    return <div className="text-center py-8">Loading warehouses...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Warehouses</h1>
          <p className="text-silk-mauve">Manage your storage locations and view history.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-silk-charcoal text-silk-gold px-4 py-2 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
            Add Warehouse
          </button>
          <button 
            onClick={() => navigate('/move-history')}
            className="bg-white border border-silk-clay text-silk-charcoal px-4 py-2 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <History size={18} />
            View Move History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warehouses.map((wh) => {
          const used = getUsedCapacity(wh._id);
          const remaining = wh.capacity - used;
          const usagePercent = Math.min(100, (used / wh.capacity) * 100);

          return (
            <div key={wh._id} className="bg-white p-6 shadow-sm border border-silk-clay hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-silk-charcoal">{wh.name}</h3>
                  <span className="inline-block bg-silk-sand/50 text-silk-mauve text-xs px-2 py-1 font-mono mt-1 rounded-sm">
                    {wh.code}
                  </span>
                </div>
                <div className="p-2 bg-silk-sand/30 text-silk-charcoal rounded-full">
                  <Box size={24} />
                </div>
              </div>
              
              <div className="space-y-4 text-sm text-silk-mauve">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <p>{wh.location}</p>
                </div>

                {wh.description && (
                  <p className="text-xs">{wh.description}</p>
                )}

                {wh.contactPerson && (
                  <div className="pt-4 border-t border-silk-clay flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider font-medium">Contact</span>
                    <span className="text-silk-charcoal font-medium">{wh.contactPerson}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Warehouse Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-lg border border-silk-clay">
            <div className="p-6 border-b border-silk-clay flex justify-between items-center">
              <h2 className="text-xl font-bold text-silk-charcoal">Add New Warehouse</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-silk-mauve hover:text-silk-charcoal">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddWarehouse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Name</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Code</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.code}
                    onChange={(e) => setNewWarehouse({...newWarehouse, code: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Location</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse({...newWarehouse, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Contact Person</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.contactPerson}
                    onChange={(e) => setNewWarehouse({...newWarehouse, contactPerson: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Description</label>
                  <textarea 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.description}
                    onChange={(e) => setNewWarehouse({...newWarehouse, description: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-silk-charcoal hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-silk-charcoal text-silk-gold px-6 py-2 font-bold hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
