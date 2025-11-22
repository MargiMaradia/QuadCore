import React from 'react';
import { mockUsers } from '../data/mockData';
import { User, MapPin, Briefcase, Calendar, Users } from 'lucide-react';

const Profile = ({ user }) => {
  // In a real app, we would fetch the full user details based on the logged-in user ID
  // For mock, we find the user in mockUsers
  const userDetails = mockUsers.find(u => u._id === user?._id) || user;

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
            <img 
              src={userDetails.avatar} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-silk-charcoal">{userDetails.fullName}</h2>
              <p className="text-silk-mauve capitalize flex items-center gap-2">
                <Briefcase size={16} />
                {userDetails.role?.replace('_', ' ')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${userDetails.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {userDetails.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-silk-charcoal border-b border-silk-clay pb-2">Personal Details</h3>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-silk-mauve">Email</div>
                <div className="col-span-2 font-medium text-silk-charcoal">{userDetails.email}</div>
                
                <div className="text-silk-mauve">Age</div>
                <div className="col-span-2 font-medium text-silk-charcoal">{userDetails.age || 'N/A'}</div>
                
                <div className="text-silk-mauve">Gender</div>
                <div className="col-span-2 font-medium text-silk-charcoal">{userDetails.gender || 'N/A'}</div>
                
                <div className="text-silk-mauve">Address</div>
                <div className="col-span-2 font-medium text-silk-charcoal">{userDetails.address || 'N/A'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-silk-charcoal border-b border-silk-clay pb-2">Work Information</h3>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-silk-mauve">Branch</div>
                <div className="col-span-2 font-medium text-silk-charcoal flex items-center gap-2">
                  <MapPin size={16} />
                  {userDetails.branch || 'N/A'}
                </div>
                
                <div className="text-silk-mauve">Manager</div>
                <div className="col-span-2 font-medium text-silk-charcoal flex items-center gap-2">
                  <Users size={16} />
                  {userDetails.manager || 'N/A'}
                </div>
                
                <div className="text-silk-mauve">Joined Date</div>
                <div className="col-span-2 font-medium text-silk-charcoal flex items-center gap-2">
                  <Calendar size={16} />
                  Jan 15, 2023
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
