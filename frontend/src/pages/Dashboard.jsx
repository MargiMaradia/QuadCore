import React, { useState } from 'react';
import { mockProducts, mockOperations, mockWarehouses } from '../data/mockData';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Package, 
  Truck, 
  X,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const Dashboard = ({ user }) => {
  if (!user) {
    return <div className="p-6 text-center text-silk-mauve">Loading...</div>;
  }
  
  const isManager = user.role === 'inventory_manager' || user.role === 'admin';
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: [] });

  // KPI Calculations
  const totalStockValue = mockProducts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
  const lowStockProducts = mockProducts.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock');
  const pendingReceiptsList = mockOperations.filter(op => op.type === 'receipt' && op.status === 'waiting');
  const pendingDeliveriesList = mockOperations.filter(op => op.type === 'delivery' && op.status === 'picking');
  
  const lowStockCount = lowStockProducts.length;
  const pendingReceipts = pendingReceiptsList.length;
  const pendingDeliveries = pendingDeliveriesList.length;

  // Chart Data Preparation
  const stockByWarehouse = mockWarehouses.map(wh => ({
    name: wh.code,
    value: mockProducts.filter(p => p.warehouse === wh._id).reduce((acc, p) => acc + p.quantity, 0)
  }));

  const movementData = [
    { name: 'Jan', in: 400, out: 240 },
    { name: 'Feb', in: 300, out: 139 },
    { name: 'Mar', in: 200, out: 980 },
    { name: 'Apr', in: 278, out: 390 },
    { name: 'May', in: 189, out: 480 },
    { name: 'Jun', in: 239, out: 380 },
  ];

  const handleCardClick = (type) => {
    let title = '';
    let data = [];

    switch(type) {
      case 'products':
        title = 'All Products';
        data = mockProducts;
        break;
      case 'low_stock':
        title = 'Low Stock Alerts';
        data = lowStockProducts;
        break;
      case 'receipts':
        title = 'Pending Receipts';
        data = pendingReceiptsList;
        break;
      case 'deliveries':
        title = 'Pending Deliveries';
        data = pendingDeliveriesList;
        break;
      default:
        return;
    }
    setModalConfig({ isOpen: true, title, type, data });
  };

  const KPICard = ({ title, value, subtext, icon: Icon, alert, color, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white p-6 shadow-sm border border-silk-clay flex items-start justify-between hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
    >
      <div>
        <p className="text-silk-mauve text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-silk-charcoal mt-2">{value}</h3>
        {subtext && <p className={`text-xs mt-1 font-medium ${alert ? 'text-red-600' : 'text-green-600'}`}>{subtext}</p>}
      </div>
      <div className={`p-3 rounded-sm ${color || 'bg-silk-sand/50 text-silk-charcoal'}`}>
        <Icon size={20} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">Dashboard Overview</h1>
          <p className="text-silk-mauve text-sm">Welcome back, {user.fullName}</p>
        </div>
        <div className="text-sm text-silk-mauve font-mono bg-white px-3 py-1 border border-silk-clay">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Products" 
          value={mockProducts.length} 
          subtext={`$${totalStockValue.toLocaleString()} Value`}
          icon={Package}
          color="bg-blue-50 text-blue-600"
          onClick={() => handleCardClick('products')}
        />
        <KPICard 
          title="Low Stock Alerts" 
          value={lowStockCount} 
          subtext={lowStockCount > 0 ? "Action Required" : "Healthy"}
          icon={AlertTriangle}
          alert={lowStockCount > 0}
          color="bg-red-50 text-red-600"
          onClick={() => handleCardClick('low_stock')}
        />
        <KPICard 
          title="Pending Receipts" 
          value={pendingReceipts} 
          subtext="Inbound"
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          onClick={() => handleCardClick('receipts')}
        />
        <KPICard 
          title="Pending Deliveries" 
          value={pendingDeliveries} 
          subtext="Outbound"
          icon={Truck}
          color="bg-emerald-50 text-emerald-600"
          onClick={() => handleCardClick('deliveries')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Warehouse */}
        <div className="bg-white p-6 shadow-sm border border-silk-clay">
          <h3 className="font-bold text-silk-charcoal mb-6">Stock Distribution by Warehouse</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByWarehouse}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3dbcf" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e3dbcf' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="value" fill="#1a1a1a" radius={[2, 2, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movement Trends */}
        <div className="bg-white p-6 shadow-sm border border-silk-clay">
          <h3 className="font-bold text-silk-charcoal mb-6">Stock Movements (Last 6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3dbcf" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e3dbcf' }}
                />
                <Line type="monotone" dataKey="in" stroke="#1a1a1a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Inbound" />
                <Line type="monotone" dataKey="out" stroke="#dbc39f" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Outbound" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalConfig({...modalConfig, isOpen: false})}>
          <div className="bg-white w-full max-w-3xl shadow-lg border border-silk-clay max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-silk-clay flex justify-between items-center">
              <h2 className="text-xl font-bold text-silk-charcoal">{modalConfig.title}</h2>
              <button onClick={() => setModalConfig({...modalConfig, isOpen: false})} className="text-silk-mauve hover:text-silk-charcoal">
                <X size={24} />
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-silk-clay text-silk-mauve text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Reference / Name</th>
                    <th className="p-4 font-medium">Details</th>
                    <th className="p-4 font-medium text-right">Status / Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silk-clay">
                  {modalConfig.data.map((item) => (
                    <tr key={item._id} className="hover:bg-silk-sand/10">
                      <td className="p-4 font-medium text-silk-charcoal">
                        {item.name || item.ref}
                        {item.sku && <div className="text-xs text-silk-mauve font-mono">{item.sku}</div>}
                      </td>
                      <td className="p-4 text-sm text-silk-mauve">
                        {item.location || item.warehouse || item.contact}
                        {item.date && <div className="text-xs">{item.date}</div>}
                      </td>
                      <td className="p-4 text-right">
                        {item.quantity !== undefined ? (
                          <span className="font-bold">{item.quantity}</span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium capitalize rounded-sm
                            ${item.status === 'done' || item.status === 'active' ? 'bg-green-100 text-green-800' : 
                              item.status === 'low_stock' || item.status === 'waiting' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {item.status?.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {modalConfig.data.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-silk-mauve">No items found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
