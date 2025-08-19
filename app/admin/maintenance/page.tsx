'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../providers/AuthProvider';
import Link from 'next/link';

export default function MaintenanceDashboard() {
  const router = useRouter();
  const { user, isInGroup, loading, userGroups } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample system data
  const [systemStats] = useState({
    totalUsers: 512,
    activeUsers: 45,
    totalOrders: 1234,
    totalRevenue: 45678.90,
    serverStatus: 'healthy',
    databaseSize: '2.3 GB',
    lastBackup: '2024-01-20 03:00',
    apiCalls: 12456,
  });

  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active' },
    { id: 2, name: 'Jane Host', email: 'jane@example.com', role: 'restaurantHost', status: 'active' },
    { id: 3, name: 'Bob Admin', email: 'bob@example.com', role: 'maintenance', status: 'active' },
  ]);

  const [menuItems] = useState([
    { id: 1, name: 'Kung Pao Chicken', category: 'poultry', price: 12.99, available: true },
    { id: 2, name: 'Beef and Broccoli', category: 'beef', price: 14.99, available: true },
    { id: 3, name: 'Spring Rolls', category: 'appetizers', price: 6.99, available: false },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isInGroup('maintenance')) {
      router.push('/');
    }
  }, [loading, user, isInGroup, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isInGroup('maintenance')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />

      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Maintenance Dashboard</h1>
          <p className="text-yellow-400 mt-2">Full system access and control</p>
          <div className="mt-4 text-sm text-white opacity-90">
            Role: {userGroups.join(', ')} | Full Access
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🟢</div>
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{systemStats.serverStatus.toUpperCase()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">💾</div>
            <h3 className="text-lg font-semibold text-gray-900">Database Size</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{systemStats.databaseSize}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold text-gray-900">API Calls Today</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{systemStats.apiCalls.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900">Last Backup</h3>
            <p className="text-sm font-bold text-gray-900 mt-2">{systemStats.lastBackup}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'database'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Database
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'logs'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                System Logs
              </button>
              <Link
                href="/admin/host"
                className="px-6 py-3 font-semibold text-blue-600 hover:text-blue-800 transition whitespace-nowrap"
              >
                Host Dashboard →
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Business Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Users:</span>
                        <span className="font-bold">{systemStats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Now:</span>
                        <span className="font-bold text-green-600">{systemStats.activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span className="font-bold">{systemStats.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-bold text-green-600">${systemStats.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Backup Database
                      </button>
                      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        Clear Cache
                      </button>
                      <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                        Restart Services
                      </button>
                      <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                        Emergency Shutdown
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add New User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">ID</th>
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Role</th>
                        <th className="text-left py-2 px-4">Status</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{user.id}</td>
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <select className="border rounded px-2 py-1 text-sm" defaultValue={user.role}>
                              <option value="customer">Customer</option>
                              <option value="restaurantHost">Restaurant Host</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Menu Item
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">ID</th>
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Category</th>
                        <th className="text-left py-2 px-4">Price</th>
                        <th className="text-left py-2 px-4">Available</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{item.id}</td>
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">${item.price}</td>
                          <td className="py-3 px-4">
                            <input type="checkbox" defaultChecked={item.available} />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Database Tab */}
            {activeTab === 'database' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Management</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Database Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>DynamoDB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{systemStats.databaseSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tables:</span>
                        <span>5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Backup:</span>
                        <span>{systemStats.lastBackup}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Create Backup
                    </button>
                    <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      Restore from Backup
                    </button>
                    <button className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                      Optimize Tables
                    </button>
                    <button className="bg-red-600 text-white py-2 rounded hover:bg-red-700">
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* System Logs Tab */}
            {activeTab === 'logs' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Logs</h2>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <div>[2024-01-20 10:23:45] INFO: User authentication successful</div>
                  <div>[2024-01-20 10:24:12] INFO: Order #1234 created</div>
                  <div>[2024-01-20 10:25:03] WARNING: High API usage detected</div>
                  <div>[2024-01-20 10:26:34] INFO: Database backup completed</div>
                  <div>[2024-01-20 10:27:56] ERROR: Failed to send email notification</div>
                  <div>[2024-01-20 10:28:12] INFO: Email service reconnected</div>
                  <div>[2024-01-20 10:29:45] INFO: New reservation created</div>
                  <div>[2024-01-20 10:30:22] INFO: Cache cleared successfully</div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Download Logs
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Clear Logs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}