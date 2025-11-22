import React, { useState, useEffect } from 'react';
import { stockAPI, warehousesAPI, exportAPI } from '../services/api';
import { exportStockToCSV } from '../utils/csvExport';
import { Search, Filter, Download } from 'lucide-react';

const StockLedger = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    warehouse: 'all',
  });
  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters.warehouse]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stocksData, warehousesData] = await Promise.all([
        stockAPI.getAll(filters.warehouse !== 'all' ? { warehouse: filters.warehouse } : {}),
        warehousesAPI.getAll()
      ]);
      
      setStocks(stocksData.stocks || stocksData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stocks.filter(item => {
    const product = item.product;
    if (!product) return false;
    
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWarehouse = filters.warehouse === 'all' || item.warehouse?._id === filters.warehouse;

    return matchesSearch && matchesWarehouse;
  });

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const params = filters.warehouse !== 'all' ? { warehouse: filters.warehouse } : {};
      
      // Try server-side export first
      const token = localStorage.getItem('token');
      const queryString = new URLSearchParams(params).toString();
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/export/stock${queryString ? `?${queryString}` : ''}`;
      
      // Fetch with authentication
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `stock-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        throw new Error('Server export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      // Fallback to client-side export
      exportStockToCSV(filteredStock, warehouses);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Stock Ledger</h1>
          <p className="text-silk-mauve">Real-time view of remaining stock across all locations.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={exporting || loading}
          className="bg-white border border-silk-clay text-silk-charcoal px-4 py-2 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          {exporting ? 'Exporting...' : 'Export CSV'}
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
              value={filters.warehouse}
              onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
            >
              <option value="all">All Warehouses</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-silk-mauve">
                    Loading stock data...
                  </td>
                </tr>
              ) : filteredStock.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-silk-mauve">
                    No stock found matching your search.
                  </td>
                </tr>
              ) : (
                filteredStock.map((item) => {
                  const product = item.product || {};
                  const warehouse = item.warehouse || {};
                  const location = item.location || {};
                  const quantity = item.quantity || 0;
                  const reserved = item.reservedQuantity || 0;
                  const available = item.availableQuantity || 0;
                  const costPrice = product.costPrice || 0;
                  const totalValue = quantity * costPrice;

                  return (
                    <tr key={item._id} className="hover:bg-silk-sand/10 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-silk-charcoal">{product.name || 'N/A'}</div>
                        <div className="text-xs text-silk-mauve font-mono">{product.sku || ''}</div>
                        <div className="text-xs text-silk-mauve mt-1">{product.category || ''}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-silk-charcoal">{warehouse.name || warehouse.code || 'N/A'}</div>
                        <div className="text-xs text-silk-mauve">{location.name || location.code || ''}</div>
                      </td>
                      <td className="p-4 text-right font-bold text-silk-charcoal">{quantity}</td>
                      <td className="p-4 text-right text-amber-600">{reserved}</td>
                      <td className="p-4 text-right font-bold text-green-600">{available}</td>
                      <td className="p-4 text-right text-sm text-silk-mauve">${costPrice.toFixed(2)}</td>
                      <td className="p-4 text-right font-medium text-silk-charcoal">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-silk-clay">
              <tr>
                <td colSpan="2" className="p-4 font-bold text-silk-charcoal text-right">Totals:</td>
                <td className="p-4 text-right font-bold text-silk-charcoal">
                  {filteredStock.reduce((acc, item) => acc + (item.quantity || 0), 0)}
                </td>
                <td className="p-4 text-right font-bold text-amber-600">
                  {filteredStock.reduce((acc, item) => acc + (item.reservedQuantity || 0), 0)}
                </td>
                <td className="p-4 text-right font-bold text-green-600">
                  {filteredStock.reduce((acc, item) => acc + (item.availableQuantity || 0), 0)}
                </td>
                <td className="p-4"></td>
                <td className="p-4 text-right font-bold text-silk-charcoal">
                  ${filteredStock.reduce((acc, item) => {
                    const qty = item.quantity || 0;
                    const price = item.product?.costPrice || 0;
                    return acc + (qty * price);
                  }, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
