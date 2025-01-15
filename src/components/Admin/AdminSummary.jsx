import React, { useContext } from 'react';
import { AdminPanelContext } from './AdminPanelProvider';
import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle, XCircle, Trash2, ArrowRight } from 'lucide-react';

const AdminSummary = () => {
  const { products, approvedProducts, rejectedProducts, users, deleteAllRejected } = useContext(AdminPanelContext);

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-blue-500",
      link: "/admin/user-management"
    },
    {
      title: "Pending Products",
      value: products.length,
      icon: Clock,
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      textColor: "text-yellow-500",
      link: "/admin/pending-products"
    },
    {
      title: "Approved Products",
      value: approvedProducts.length,
      icon: CheckCircle,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      textColor: "text-green-500",
      link: "/admin/approved-products"
    },
    {
      title: "Rejected Products",
      value: rejectedProducts.length,
      icon: XCircle,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      textColor: "text-red-500",
      link: "/admin/rejected-products"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        {/* <button 
          onClick={deleteAllRejected}
          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Delete Rejected
        </button> */} 
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color} group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 tracking-tight mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color} opacity-50`} 
                    style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                  />
                </div>
                <Link 
                  to={stat.link}
                  className={`mt-4 flex items-center justify-between p-3 -mx-6 -mb-6 border-t border-gray-100 ${stat.textColor} hover:bg-gray-50 transition-colors duration-200`}
                >
                  <span className="font-medium">View Details</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSummary;