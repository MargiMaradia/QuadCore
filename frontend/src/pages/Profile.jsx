import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Calendar, Users } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const userDetails = user;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-silk-charcoal">My Profile</h1>
          <p className="text-silk-mauve">Manage your personal information and account settings.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-silk-clay overflow-hidden">
        <div className="h-32 bg-silk-charcoal relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-silk-charcoal text-silk-gold flex items-center justify-center text-2xl font-bold">
              {(userDetails.name || userDetails.fullName || userDetails.email || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-silk-charcoal">{userDetails.name || userDetails.fullName || userDetails.email}</h2>
              <p className="text-silk-mauve capitalize flex items-center gap-2">
                <Briefcase size={16} />
                {userDetails.role?.replace('_', ' ') || 'User'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-silk-charcoal border-b border-silk-clay pb-2">Personal Details</h3>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-silk-mauve">Email</div>
                <div className="col-span-2 font-medium text-silk-charcoal">{userDetails.email || 'N/A'}</div>
                
                <div className="text-silk-mauve">User ID</div>
                <div className="col-span-2 font-medium text-silk-charcoal font-mono text-xs">{userDetails.id || userDetails._id || 'N/A'}</div>
                
                <div className="text-silk-mauve">Role</div>
                <div className="col-span-2 font-medium text-silk-charcoal capitalize">{userDetails.role?.replace('_', ' ') || 'User'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-silk-charcoal border-b border-silk-clay pb-2">Work Information</h3>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-silk-mauve">Account Status</div>
                <div className="col-span-2 font-medium text-silk-charcoal">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                
                <div className="text-silk-mauve">Member Since</div>
                <div className="col-span-2 font-medium text-silk-charcoal flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
