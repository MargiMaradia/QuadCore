import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockWarehouses, mockProducts } from '../data/mockData';
import { MapPin, Box, History, Plus, X, Save } from 'lucide-react';

const Warehouses = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    code: '',
    address: '',
    manager: '',
    capacity: 1000
  });

  const handleAddWarehouse = (e) => {
    e.preventDefault();
    const warehouse = {
      _id: `WH-${Date.now()}`,
      ...newWarehouse
    };
    setWarehouses([...warehouses, warehouse]);
    setIsAddModalOpen(false);
    setNewWarehouse({
      name: '',
      code: '',
      address: '',
      manager: '',
      capacity: 1000
    });
  };

  const getUsedCapacity = (warehouseId) => {
    return mockProducts
      .filter(p => p.warehouse === warehouseId)
      .reduce((acc, p) => acc + p.quantity, 0);
  };

  return (
    <div className="space-y-6">
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
                  <p>{wh.address}</p>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Capacity Usage</span>
                    <span className={usagePercent > 90 ? 'text-red-600' : 'text-silk-charcoal'}>
                      {used} / {wh.capacity} ({usagePercent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${usagePercent > 90 ? 'bg-red-500' : 'bg-silk-gold'}`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-silk-mauve">
                    Remaining: <span className="font-bold text-silk-charcoal">{remaining}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-silk-clay flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider font-medium">Manager</span>
                  <span className="text-silk-charcoal font-medium">{wh.manager}</span>
                </div>
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
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Address</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.address}
                    onChange={(e) => setNewWarehouse({...newWarehouse, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Manager</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.manager}
                    onChange={(e) => setNewWarehouse({...newWarehouse, manager: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Capacity</label>
                  <input 
                    type="number" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newWarehouse.capacity}
                    onChange={(e) => setNewWarehouse({...newWarehouse, capacity: parseInt(e.target.value)})}
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
