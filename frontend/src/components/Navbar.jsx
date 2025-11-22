import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Search, AlertTriangle, Truck, FileText, Check } from 'lucide-react';
import { mockNotifications, mockProducts, mockOperations } from '../data/mockData';

const Navbar = ({ onMenuClick, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate pending works
  const lowStockProducts = mockProducts.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock');
  const pendingDeliveries = mockOperations.filter(op => op.type === 'delivery' && op.status !== 'done');
  const pendingReceipts = mockOperations.filter(op => op.type === 'receipt' && op.status !== 'done');

  // Generate dynamic notifications
  const dynamicNotifications = [
    ...lowStockProducts.map(p => ({
      id: `ls-${p._id}`,
      title: "Low Stock Alert",
      message: `${p.name} is ${p.status === 'out_of_stock' ? 'out of stock' : 'running low'}.`,
      type: "warning",
      icon: <AlertTriangle size={16} className="text-red-500" />
    })),
    ...pendingDeliveries.map(d => ({
      id: `pd-${d._id}`,
      title: "Pending Delivery",
      message: `Delivery ${d.ref} to ${d.to} is ${d.status}.`,
      type: "info",
      icon: <Truck size={16} className="text-blue-500" />
    })),
    ...pendingReceipts.map(r => ({
      id: `pr-${r._id}`,
      title: "Pending Receipt",
      message: `Receipt ${r.ref} from ${r.contact} is ${r.status}.`,
      type: "info",
      icon: <FileText size={16} className="text-green-500" />
    }))
  ];

  // Combine with mock static notifications and filter dismissed ones
  const allNotifications = [...dynamicNotifications, ...mockNotifications.map(n => ({
    ...n,
    icon: n.type === 'warning' ? <AlertTriangle size={16} className="text-red-500" /> : <FileText size={16} className="text-blue-500" />
  }))].filter(n => !dismissedIds.includes(n.id));

  const unreadCount = allNotifications.length;

  const handleDismiss = (e, id) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-silk-clay shadow-sm px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-silk-charcoal hover:bg-gray-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        {/* Global Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-silk-mauve" size={18} />
          <input 
            type="text" 
            placeholder="Search orders, products..." 
            className="pl-10 pr-4 py-2 w-64 bg-silk-sand/20 border border-transparent focus:bg-white focus:border-silk-gold focus:outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-silk-mauve hover:text-silk-charcoal transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-silk-clay shadow-lg rounded-sm overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 border-b border-silk-clay bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-silk-charcoal text-sm">Notifications</h3>
                <span className="text-xs text-silk-mauve">{unreadCount} Pending</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {allNotifications.length === 0 ? (
                  <div className="p-4 text-center text-silk-mauve text-sm">No new notifications</div>
                ) : (
                  allNotifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-silk-clay hover:bg-silk-sand/10 transition-colors cursor-pointer group relative">
                      <div className="flex gap-3 pr-8">
                        <div className="mt-1 flex-shrink-0">
                          {notification.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-silk-charcoal">{notification.title}</p>
                          <p className="text-xs text-silk-mauve mt-1">{notification.message}</p>
                          {notification.time && <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleDismiss(e, notification.id)}
                        className="absolute top-3 right-3 text-silk-mauve hover:text-green-600 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-full hover:bg-green-50"
                        title="Mark as Done"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Profile Icon (Visible only on small screens) */}
        <div className="md:hidden w-8 h-8 rounded-full bg-silk-charcoal text-silk-gold flex items-center justify-center font-bold text-sm">
          {user?.fullName?.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
