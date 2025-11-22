import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import { Search, Edit2, X, UserPlus } from 'lucide-react';

const Settings = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'warehouse_staff',
    branch: '',
    manager: '',
    isActive: true,
    address: '',
    age: '',
    gender: ''
  });

  if (!currentUser) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canEdit = (targetUser) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'inventory_manager' && targetUser.role === 'warehouse_staff') return true;
    return false;
  };

  const canAddUser = () => {
    return currentUser.role === 'admin' || currentUser.role === 'inventory_manager';
  };

  const getAvailableRoles = () => {
    if (currentUser.role === 'admin') {
      return ['admin', 'inventory_manager', 'warehouse_staff'];
    }
    return ['warehouse_staff'];
  };

  const handleEditClick = (targetUser) => {
    if (canEdit(targetUser)) {
      setEditingUser({ ...targetUser });
    } else {
      alert("You do not have permission to edit this user.");
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(u => u._id === editingUser._id ? editingUser : u);
    setUsers(updatedUsers);
    setEditingUser(null);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const id = `u${users.length + 1}`;
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.fullName)}&background=random&color=fff`;
    const userToAdd = { ...newUser, _id: id, avatar };
    setUsers([...users, userToAdd]);
    setIsAddingUser(false);
    setNewUser({
      fullName: '',
      email: '',
      role: 'warehouse_staff',
      branch: '',
      manager: '',
      isActive: true,
      address: '',
      age: '',
      gender: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">System Settings</h1>
          <p className="text-silk-mauve">Manage users, roles, and system preferences.</p>
        </div>
        {canAddUser() && (
          <button 
            onClick={() => setIsAddingUser(true)}
            className="bg-silk-charcoal text-silk-gold px-4 py-2 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <UserPlus size={18} />
            Add User
          </button>
        )}
      </div>

      <div className="bg-white p-6 shadow-sm border border-silk-clay">
        <h2 className="text-lg font-bold text-silk-charcoal mb-4">User Management</h2>
        
        {/* Search */}
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silk-mauve" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-10 pr-4 py-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-silk-clay text-silk-mauve text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Branch</th>
                <th className="p-4 font-medium">Manager</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-silk-clay">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-silk-sand/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="font-bold text-silk-charcoal">{user.fullName}</div>
                        <div className="text-xs text-silk-mauve">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm capitalize">{user.role.replace('_', ' ')}</td>
                  <td className="p-4 text-sm">{user.branch || '-'}</td>
                  <td className="p-4 text-sm">{user.manager || '-'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
                      ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {canEdit(user) && (
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="text-silk-mauve hover:text-silk-charcoal p-1"
                        title="Edit User"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-lg border border-silk-clay max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-silk-clay flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-silk-charcoal">Edit User Details</h2>
              <button onClick={() => setEditingUser(null)} className="text-silk-mauve hover:text-silk-charcoal">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Email</label>
                  <input 
                    type="email" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Role</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    disabled={currentUser.role !== 'admin'} // Only admin can change roles
                  >
                    <option value="admin">Admin</option>
                    <option value="inventory_manager">Inventory Manager</option>
                    <option value="warehouse_staff">Warehouse Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Status</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={editingUser.isActive}
                    onChange={(e) => setEditingUser({...editingUser, isActive: e.target.value === 'true'})}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Age</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={editingUser.age || ''}
                    onChange={(e) => setEditingUser({...editingUser, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Gender</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={editingUser.gender || ''}
                    onChange={(e) => setEditingUser({...editingUser, gender: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Address</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={editingUser.address || ''}
                    onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Branch</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={editingUser.branch || ''}
                    onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Manager</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={editingUser.manager || ''}
                    onChange={(e) => setEditingUser({...editingUser, manager: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-silk-clay">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-silk-charcoal hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-silk-charcoal text-silk-gold px-6 py-2 font-bold hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-lg border border-silk-clay max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-silk-clay flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-silk-charcoal">Add New User</h2>
              <button onClick={() => setIsAddingUser(false)} className="text-silk-mauve hover:text-silk-charcoal">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Email</label>
                  <input 
                    type="email" required
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Role</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    {getAvailableRoles().map(role => (
                      <option key={role} value={role}>{role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Status</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={newUser.isActive}
                    onChange={(e) => setNewUser({...newUser, isActive: e.target.value === 'true'})}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Age</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newUser.age}
                    onChange={(e) => setNewUser({...newUser, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Gender</label>
                  <select 
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold bg-white"
                    value={newUser.gender}
                    onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Address</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newUser.address}
                    onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Branch</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newUser.branch}
                    onChange={(e) => setNewUser({...newUser, branch: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-silk-charcoal mb-1">Manager</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-silk-clay focus:outline-none focus:border-silk-gold"
                    value={newUser.manager}
                    onChange={(e) => setNewUser({...newUser, manager: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-silk-clay">
                <button 
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 text-silk-charcoal hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-silk-charcoal text-silk-gold px-6 py-2 font-bold hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
