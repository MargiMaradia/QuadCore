import React, { useState } from 'react';
import { mockProducts, mockWarehouses } from '../data/mockData';
import { Search, Filter, QrCode, MoreHorizontal, Plus, X, Save, Edit2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const Inventory = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState(null);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    location: '',
    warehouse: mockWarehouses[0]?._id || '',
    status: 'active'
  });

  const filteredProducts = products.filter(p => 
    (statusFilter === 'all' || p.status === statusFilter) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      _id: Date.now().toString(),
      ...newProduct
    };
    setProducts([product, ...products]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      sku: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      location: '',
      warehouse: mockWarehouses[0]?._id || '',
      status: 'active'
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedProducts = products.map(p => 
      p._id === id ? { ...p, status: newStatus } : p
    );
    setProducts(updatedProducts);
    setEditingStatusId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Inventory Management</h1>
          <p className="text-silk-mauve">Manage products, stock levels, and prices.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-silk-charcoal text-silk-gold px-4 py-2 font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow-sm border border-silk-clay flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silk-mauve" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name or SKU..." 
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
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-silk-clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-silk-clay text-silk-mauve text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Product Info</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Quantity</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silk-clay">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-silk-sand/10 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-silk-charcoal">{product.name}</div>
                    <div className="text-xs text-silk-mauve">{product.location}</div>
                  </td>
                  <td className="p-4 text-sm font-mono text-silk-mauve">{product.sku}</td>
                  <td className="p-4 text-sm text-silk-charcoal">{product.category}</td>
                  <td className="p-4 text-right font-medium text-silk-charcoal">{product.quantity}</td>
                  <td className="p-4 text-right text-silk-mauve">${product.unitPrice.toFixed(2)}</td>
                  <td className="p-4">
                    {editingStatusId === product._id ? (
                      <select 
                        autoFocus
                        className="text-xs p-1 border border-silk-clay"
                        value={product.status}
                        onChange={(e) => handleStatusUpdate(product._id, e.target.value)}
                        onBlur={() => setEditingStatusId(null)}
                      >
                        <option value="active">Active</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    ) : (
                      <span 
                        onClick={() => setEditingStatusId(product._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium capitalize cursor-pointer hover:opacity-80
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                          product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' : 
                          product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {product.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="p-1.5 text-silk-mauve hover:text-silk-charcoal hover:bg-gray-100 border border-transparent hover:border-silk-clay"
                        title="Generate QR"
                      >
                        <QrCode size={18} />
                      </button>
                      <button 
                        onClick={() => setEditingStatusId(product._id)}
                        className="p-1.5 text-silk-mauve hover:text-silk-charcoal hover:bg-gray-100 border border-transparent hover:border-silk-clay"
                        title="Edit Status"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-lg border border-silk-clay">
            <div className="p-6 border-b border-silk-clay flex justify-between items-center">
              <h2 className="text-xl font-bold text-silk-charcoal">Add New Product</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-silk-mauve hover:text-silk-charcoal">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Name</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">SKU</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Category</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Price</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({...newProduct, unitPrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Quantity</label>
                  <input 
                    type="number" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Warehouse</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={newProduct.warehouse}
                    onChange={(e) => setNewProduct({...newProduct, warehouse: e.target.value})}
                  >
                    {mockWarehouses.map(w => (
                      <option key={w._id} value={w._id}>{w.name}</option>
                    ))}
                  </select>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white p-6 max-w-sm w-full shadow-lg border border-silk-clay" onClick={e => e.stopPropagation()}>
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-silk-charcoal">Product QR Code</h3>
              <div className="flex justify-center p-4 bg-white border border-silk-clay">
                <QRCodeCanvas 
                  value={JSON.stringify({ id: selectedProduct._id, sku: selectedProduct.sku })} 
                  size={200}
                  level={"H"}
                />
              </div>
              <div className="text-sm text-silk-mauve">
                <p className="font-bold text-silk-charcoal">{selectedProduct.name}</p>
                <p className="font-mono">{selectedProduct.sku}</p>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-full bg-silk-charcoal text-silk-gold py-2 font-medium hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
