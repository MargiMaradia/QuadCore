import React, { useState } from 'react';
import { mockProducts, mockWarehouses } from '../data/mockData';
import { Search, Filter, Download } from 'lucide-react';

const StockLedger = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    warehouse: 'all',
    category: 'all'
  });

  const categories = [...new Set(mockProducts.map(p => p.category))];

  const filteredStock = mockProducts.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    const matchesWarehouse = filters.warehouse === 'all' || p.warehouse === filters.warehouse;
    const matchesCategory = filters.category === 'all' || p.category === filters.category;

    return matchesSearch && matchesStatus && matchesWarehouse && matchesCategory;
  });

  const getWarehouseName = (id) => {
    const wh = mockWarehouses.find(w => w._id === id);
    return wh ? wh.name : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Stock Ledger</h1>
          <p className="text-silk-mauve">Real-time view of remaining stock across all locations.</p>
        </div>
        <button className="bg-white border border-silk-clay text-silk-charcoal px-4 py-2 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow-sm border border-silk-clay space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silk-mauve" size={18} />
            <input 
              type="text" 
              placeholder="Search by Product or SKU..." 
              className="w-full pl-10 pr-4 py-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <select 
              className="p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white min-w-[140px]"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <select 
              className="p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white min-w-[140px]"
              value={filters.warehouse}
              onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
            >
              <option value="all">All Warehouses</option>
              {mockWarehouses.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
            <select 
              className="p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white min-w-[140px]"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white shadow-sm border border-silk-clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-silk-clay text-silk-mauve text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Product Details</th>
                <th className="p-4 font-medium">Warehouse / Location</th>
                <th className="p-4 font-medium text-right">On Hand</th>
                <th className="p-4 font-medium text-right">Reserved</th>
                <th className="p-4 font-medium text-right">Available</th>
                <th className="p-4 font-medium text-right">Unit Value</th>
                <th className="p-4 font-medium text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silk-clay">
              {filteredStock.map((product) => {
                const reserved = Math.floor(product.quantity * 0.1); // Mock reserved logic
                const available = product.quantity - reserved;
                const totalValue = product.quantity * product.unitPrice;

                return (
                  <tr key={product._id} className="hover:bg-silk-sand/10 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-silk-charcoal">{product.name}</div>
                      <div className="text-xs text-silk-mauve font-mono">{product.sku}</div>
                      <div className="text-xs text-silk-mauve mt-1">{product.category}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-silk-charcoal">{getWarehouseName(product.warehouse)}</div>
                      <div className="text-xs text-silk-mauve">{product.location}</div>
                    </td>
                    <td className="p-4 text-right font-bold text-silk-charcoal">{product.quantity}</td>
                    <td className="p-4 text-right text-amber-600">{reserved}</td>
                    <td className="p-4 text-right font-bold text-green-600">{available}</td>
                    <td className="p-4 text-right text-sm text-silk-mauve">${product.unitPrice.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-silk-charcoal">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                );
              })}
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-silk-mauve">
                    No stock found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-silk-clay">
              <tr>
                <td colSpan="2" className="p-4 font-bold text-silk-charcoal text-right">Totals:</td>
                <td className="p-4 text-right font-bold text-silk-charcoal">
                  {filteredStock.reduce((acc, p) => acc + p.quantity, 0)}
                </td>
                <td className="p-4 text-right font-bold text-amber-600">
                  {filteredStock.reduce((acc, p) => acc + Math.floor(p.quantity * 0.1), 0)}
                </td>
                <td className="p-4 text-right font-bold text-green-600">
                  {filteredStock.reduce((acc, p) => acc + (p.quantity - Math.floor(p.quantity * 0.1)), 0)}
                </td>
                <td className="p-4"></td>
                <td className="p-4 text-right font-bold text-silk-charcoal">
                  ${filteredStock.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockLedger;
