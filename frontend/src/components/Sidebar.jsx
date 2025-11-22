import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  User, 
  Warehouse, 
  ClipboardList,
  LogOut,
  X,
  Truck,
  FileText
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ user, isOpen, onClose, onLogout }) => {
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={() => window.innerWidth < 1024 && onClose()}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4",
          isActive
            ? "border-silk-gold text-silk-charcoal bg-silk-sand/30"
            : "border-transparent text-silk-mauve hover:text-silk-charcoal hover:bg-gray-50"
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-silk-clay shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-silk-clay">
          <div className="flex items-center gap-1 select-none">
            <div className="bg-silk-charcoal text-silk-gold px-2 py-1 font-bold text-xl tracking-wider">
              STOCK
            </div>
            <div className="border-2 border-silk-charcoal text-silk-charcoal px-2 py-1 font-bold text-xl tracking-wider">
              SYNC
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-silk-mauve">
            <X size={24} />
          </button>
        </div>

        {/* User Profile Snippet */}
        <div className="p-6 border-b border-silk-clay bg-gray-50/50">
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border border-silk-clay"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-silk-charcoal truncate">{user?.fullName}</p>
              <p className="text-xs text-silk-mauve capitalize truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            
            {(user?.role === 'inventory_manager' || user?.role === 'admin') && (
              <>
                <NavItem to="/inventory" icon={Package} label="Products" />
                <NavItem to="/warehouses" icon={Warehouse} label="Warehouses" />
              </>
            )}
            
            <NavItem to="/deliveries" icon={Truck} label="Deliveries" />
            <NavItem to="/documents" icon={FileText} label="Documents" />
            
            {(user?.role === 'inventory_manager' || user?.role === 'admin') && (
              <NavItem to="/ledger" icon={ClipboardList} label="Stock Ledger" />
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-silk-clay space-y-1">
            <p className="px-6 text-xs font-bold text-silk-mauve uppercase tracking-wider mb-2">System</p>
            {(user?.role === 'inventory_manager' || user?.role === 'admin') && (
              <NavItem to="/settings" icon={Settings} label="Settings" />
            )}
            <NavItem to="/profile" icon={User} label="Profile" />
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-silk-clay">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-sm"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
