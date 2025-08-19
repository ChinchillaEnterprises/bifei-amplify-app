'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../providers/AuthProvider';
import Link from 'next/link';
import { client, type Reservation, type Order, type User, type ReservationStatus, type OrderStatus } from '../../utils/amplify-client';

export default function RestaurantHostDashboard() {
  const router = useRouter();
  const { user, isInGroup, loading, userGroups } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  
  // Real data states
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({
    todayReservations: 0,
    activeOrders: 0,
    totalMembers: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isInGroup('restaurantHost') && !isInGroup('maintenance')) {
      router.push('/');
    }
  }, [loading, user, isInGroup, router]);

  // Fetch data when component mounts
  useEffect(() => {
    if (user && (isInGroup('restaurantHost') || isInGroup('maintenance'))) {
      console.log('User authenticated, fetching data...');
      console.log('User groups:', userGroups);
      fetchAllData();
      // Set up real-time subscriptions
      const cleanup = setupSubscriptions();
      return cleanup;
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([
        fetchReservations(),
        fetchOrders(),
        fetchMembers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Show more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert('Error loading data. Please check the console for details.');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchReservations = async () => {
    try {
      console.log('Fetching reservations...');
      const response = await client.models.Reservation.list();
      console.log('Full reservation response:', response);
      
      if (response.errors && response.errors.length > 0) {
        console.error('GraphQL errors:', response.errors);
        response.errors.forEach((err: any) => {
          console.error('Error detail:', err);
        });
      }
      
      const data = response.data;
      console.log('Reservations fetched:', data);
      
      setReservations(data || []);
      
      // Calculate today's reservations
      const today = new Date().toISOString().split('T')[0];
      const todayReservations = data?.filter(r => r.date === today) || [];
      setStats(prev => ({ ...prev, todayReservations: todayReservations.length }));
    } catch (error) {
      console.error('Error fetching reservations:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      throw error; // Re-throw to be caught by fetchAllData
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await client.models.Order.list();
      console.log('Orders response:', response);
      
      const data = response.data;
      setOrders(data || []);
      
      // Calculate active orders and today's revenue
      const activeOrders = data?.filter(o => 
        o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'delivering'
      ) || [];
      
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = data?.filter(o => o.createdAt?.startsWith(today)) || [];
      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats(prev => ({ 
        ...prev, 
        activeOrders: activeOrders.length,
        todayRevenue
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      console.log('Fetching members...');
      const response = await client.models.User.list();
      console.log('Members response:', response);
      
      const data = response.data;
      setMembers(data || []);
      setStats(prev => ({ ...prev, totalMembers: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const setupSubscriptions = () => {
    // Subscribe to reservation updates
    const reservationSub = client.models.Reservation.observeQuery().subscribe({
      next: ({ items }) => {
        setReservations(items);
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = items.filter(r => r.date === today);
        setStats(prev => ({ ...prev, todayReservations: todayReservations.length }));
      }
    });

    // Subscribe to order updates
    const orderSub = client.models.Order.observeQuery().subscribe({
      next: ({ items }) => {
        setOrders(items);
        const activeOrders = items.filter(o => 
          o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'delivering'
        );
        setStats(prev => ({ ...prev, activeOrders: activeOrders.length }));
      }
    });

    // Clean up subscriptions on unmount
    return () => {
      reservationSub.unsubscribe();
      orderSub.unsubscribe();
    };
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      await client.models.Reservation.update({
        id,
        status
      });
      // The subscription will automatically update the UI
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation status');
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await client.models.Order.update({
        id,
        status
      });
      // The subscription will automatically update the UI
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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

  if (!user || (!isInGroup('restaurantHost') && !isInGroup('maintenance'))) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />

      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Restaurant Host Dashboard</h1>
          <p className="text-gold mt-2">Manage reservations, orders, and members</p>
          <div className="mt-4 text-sm text-white opacity-90">
            Role: {userGroups.join(', ')}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Reservations</h3>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.todayReservations}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.activeOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-900">Total Members</h3>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.totalMembers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Revenue</h3>
            <p className="text-3xl font-bold text-red-900 mt-2">${stats.todayRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === 'reservations'
                    ? 'text-red-900 border-b-2 border-red-900'
                    : 'text-gray-600 hover:text-red-900'
                }`}
              >
                Reservations ({reservations.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === 'orders'
                    ? 'text-red-900 border-b-2 border-red-900'
                    : 'text-gray-600 hover:text-red-900'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === 'members'
                    ? 'text-red-900 border-b-2 border-red-900'
                    : 'text-gray-600 hover:text-red-900'
                }`}
              >
                Members ({members.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading data...</p>
              </div>
            ) : (
              <>
                {/* Reservations Tab */}
                {activeTab === 'reservations' && (
                  <div>
                    <h2 className="text-2xl font-bold text-red-900 mb-4">Manage Reservations</h2>
                    {reservations.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No reservations yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4">Customer</th>
                              <th className="text-left py-2 px-4">Date</th>
                              <th className="text-left py-2 px-4">Time</th>
                              <th className="text-left py-2 px-4">Guests</th>
                              <th className="text-left py-2 px-4">Status</th>
                              <th className="text-left py-2 px-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reservations.map(reservation => (
                              <tr key={reservation.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-semibold">{reservation.customerName}</p>
                                    <p className="text-sm text-gray-600">{reservation.email}</p>
                                    {reservation.phone && (
                                      <p className="text-sm text-gray-600">{reservation.phone}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">{reservation.date}</td>
                                <td className="py-3 px-4">{reservation.time}</td>
                                <td className="py-3 px-4">{reservation.numberOfGuests}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {reservation.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {reservation.status === 'pending' && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                  {reservation.specialRequests && (
                                    <p className="text-xs text-gray-600 mt-1">
                                      Note: {reservation.specialRequests}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-red-900 mb-4">Manage Orders</h2>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No orders yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4">Order ID</th>
                              <th className="text-left py-2 px-4">Customer</th>
                              <th className="text-left py-2 px-4">Time</th>
                              <th className="text-left py-2 px-4">Total</th>
                              <th className="text-left py-2 px-4">Status</th>
                              <th className="text-left py-2 px-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(order => (
                              <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">#{order.id.slice(-8)}</td>
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-semibold">{order.customerName}</p>
                                    <p className="text-sm text-gray-600">{order.phone}</p>
                                    <p className="text-xs text-gray-500">{order.deliveryAddress}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{formatDateTime(order.createdAt)}</td>
                                <td className="py-3 px-4">${order.total?.toFixed(2)}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'delivering' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <select
                                    value={order.status || 'pending'}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    className="border rounded px-2 py-1 text-sm"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="delivering">Delivering</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  {order.specialInstructions && (
                                    <p className="text-xs text-gray-600 mt-1">
                                      Note: {order.specialInstructions}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                  <div>
                    <h2 className="text-2xl font-bold text-red-900 mb-4">Member Management</h2>
                    {members.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No members yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4">Name</th>
                              <th className="text-left py-2 px-4">Email</th>
                              <th className="text-left py-2 px-4">Role</th>
                              <th className="text-left py-2 px-4">Total Orders</th>
                              <th className="text-left py-2 px-4">Loyalty Points</th>
                              <th className="text-left py-2 px-4">Member Since</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map(member => (
                              <tr key={member.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{member.name || 'N/A'}</td>
                                <td className="py-3 px-4">{member.email}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                                    member.role === 'maintenance' ? 'bg-purple-100 text-purple-800' :
                                    member.role === 'restaurantHost' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {member.role || 'customer'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">{member.totalOrders || 0}</td>
                                <td className="py-3 px-4">{member.loyaltyPoints || 0}</td>
                                <td className="py-3 px-4">
                                  {member.memberSince ? new Date(member.memberSince).toLocaleDateString() : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}