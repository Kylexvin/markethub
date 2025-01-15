import React, { useContext, useState } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import { Shield, Ban, Trash2, Search, Phone, Mail, Calendar, UserCircle, MoreVertical } from 'lucide-react';

const UserManagement = () => {
  const { users, handleGrantAdmin, handleBanUser, handleRemoveUser } = useContext(AdminPanelContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-white rounded-lg border border-gray-200">
              Total Users: {users.length}
            </span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <UserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No users to manage</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user._id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.username}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleGrantAdmin(user._id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Grant Admin
                    </button>
                  )}
                  <button 
                    onClick={() => handleBanUser(user._id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Ban
                  </button>
                  <button 
                    onClick={() => handleRemoveUser(user._id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;