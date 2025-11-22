import React, { useState } from 'react';
import { mockOperations, mockProducts, mockWarehouses } from '../data/mockData';
import { Search, Truck, Calendar, User, Plus, X, Save, Filter, Edit2 } from 'lucide-react';

const Deliveries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveries, setDeliveries] = useState(mockOperations.filter(op => op.type === 'delivery'));
  const [editingStatusId, setEditingStatusId] = useState(null);
  
  // New Delivery Form State
  const [newDelivery, setNewDelivery] = useState({
    ref: `WH/OUT/${Math.floor(Math.random() * 1000)}`,
    contact: '',
    from: mockWarehouses[0]?._id || '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ product: mockProducts[0]?._id || '', qty: 1 }]
  });

  const filteredDeliveries = deliveries.filter(op => 
    (statusFilter === 'all' || op.status === statusFilter) &&
    (op.ref.toLowerCase().includes(searchTerm.toLowerCase()) || 
    op.contact?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddItem = () => {
    setNewDelivery({
      ...newDelivery,
      items: [...newDelivery.items, { product: mockProducts[0]?._id || '', qty: 1 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = newDelivery.items.filter((_, i) => i !== index);
    setNewDelivery({ ...newDelivery, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...newDelivery.items];
    newItems[index][field] = value;
    setNewDelivery({ ...newDelivery, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const delivery = {
      _id: Date.now().toString(),
      type: 'delivery',
      status: 'draft',
      ...newDelivery,
      // Enrich items with product names for display
      items: newDelivery.items.map(item => ({
        ...item,
        productName: mockProducts.find(p => p._id === item.product)?.name
      }))
    };
    
    setDeliveries([delivery, ...deliveries]);
    setIsModalOpen(false);
    // Reset form
    setNewDelivery({
      ref: `WH/OUT/${Math.floor(Math.random() * 1000)}`,
      contact: '',
      from: mockWarehouses[0]?._id || '',
      to: '',
      date: new Date().toISOString().split('T')[0],
      items: [{ product: mockProducts[0]?._id || '', qty: 1 }]
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedDeliveries = deliveries.map(d => 
      d._id === id ? { ...d, status: newStatus } : d
    );
    setDeliveries(updatedDeliveries);
    setEditingStatusId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Delivery Orders</h1>
          <p className="text-silk-mauve">Manage outgoing shipments and schedules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-silk-charcoal text-silk-gold px-4 py-2 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          New Delivery
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 shadow-sm border border-silk-clay flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silk-mauve" size={18} />
          <input 
            type="text" 
            placeholder="Search by Reference or Contact..." 
            className="w-full pl-10 pr-4 py-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-silk-mauve" />
          <select 
            className="p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="waiting">Waiting</option>
            <option value="picking">Picking</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="bg-white shadow-sm border border-silk-clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-silk-clay text-silk-mauve text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Reference</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">From</th>
                <th className="p-4 font-medium">To</th>
                <th className="p-4 font-medium">Schedule Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silk-clay">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery._id} className="hover:bg-silk-sand/10 transition-colors">
                  <td className="p-4 font-medium text-silk-charcoal">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-silk-mauve" />
                      {delivery.ref}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-silk-charcoal">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-silk-mauve" />
                      {delivery.contact}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-silk-mauve">{delivery.from}</td>
                  <td className="p-4 text-sm text-silk-mauve">{delivery.to}</td>
                  <td className="p-4 text-sm text-silk-mauve">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-silk-mauve" />
                      {delivery.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {editingStatusId === delivery._id ? (
                        <select 
                          autoFocus
                          className="text-xs p-1 border border-silk-clay"
                          value={delivery.status}
                          onChange={(e) => handleStatusUpdate(delivery._id, e.target.value)}
                          onBlur={() => setEditingStatusId(null)}
                        >
                          <option value="draft">Draft</option>
                          <option value="waiting">Waiting</option>
                          <option value="picking">Picking</option>
                          <option value="ready">Ready</option>
                          <option value="done">Done</option>
                        </select>
                      ) : (
                        <span 
                          onClick={() => setEditingStatusId(delivery._id)}
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium capitalize rounded-sm cursor-pointer hover:opacity-80
                          ${delivery.status === 'done' ? 'bg-green-100 text-green-800' : 
                            delivery.status === 'picking' ? 'bg-blue-100 text-blue-800' : 
                            delivery.status === 'ready' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {delivery.status}
                        </span>
                      )}
                      <button 
                        onClick={() => setEditingStatusId(delivery._id)}
                        className="text-silk-mauve hover:text-silk-charcoal"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm font-medium text-silk-charcoal">
                    {delivery.items.length} Items
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-silk-mauve">
                    No deliveries found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Delivery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl shadow-lg border border-silk-clay max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-silk-clay flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-silk-charcoal">New Delivery Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-silk-mauve hover:text-silk-charcoal">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Reference</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newDelivery.ref}
                    onChange={(e) => setNewDelivery({...newDelivery, ref: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Schedule Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newDelivery.date}
                    onChange={(e) => setNewDelivery({...newDelivery, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Customer / Contact</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Customer Name"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newDelivery.contact}
                    onChange={(e) => setNewDelivery({...newDelivery, contact: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Destination Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Delivery Address"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newDelivery.to}
                    onChange={(e) => setNewDelivery({...newDelivery, to: e.target.value})}
                  />
                </div>
              </div>

              <div className="border-t border-silk-clay pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-silk-charcoal">Items</h3>
                  <button 
                    type="button"
                    onClick={handleAddItem}
                    className="text-sm text-silk-gold hover:text-silk-charcoal font-medium flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newDelivery.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-silk-mauve mb-1">Product</label>
                        <select 
                          className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        >
                          {mockProducts.map(p => (
                            <option key={p._id} value={p._id}>{p.name} (Qty: {p.quantity})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-medium text-silk-mauve mb-1">Quantity</label>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value))}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 mb-[1px]"
                        disabled={newDelivery.items.length === 1}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-silk-clay">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-silk-charcoal hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-silk-charcoal text-silk-gold px-6 py-2 font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save size={18} />
                  Create Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deliveries;
