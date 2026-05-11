import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PreOrderProduct {
  productId: string;
  productName: string;
  slug: string;
  currentStock: number;
  reservedQuantity: number;
  totalReserved: number;
  shortage: number;
  canDeliver: boolean;
  preOrderCount: number;
  status: string;
}

export default function AdminPreOrders() {
  const [preOrders, setPreOrders] = useState<PreOrderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/dashboard/pre-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data.success) {
          setPreOrders(response.data.preOrderProducts);
        } else {
          setError(response.data.message || 'Failed to fetch pre-orders');
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch pre-orders';
        setError(errorMsg);
        console.error('Pre-order fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-600 py-10">{error}</div>;

  const readyCount = preOrders.filter(p => p.canDeliver).length;
  const pendingCount = preOrders.filter(p => !p.canDeliver).length;
  const totalShortage = preOrders.reduce((sum, p) => sum + p.shortage, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pre-Order Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-gray-600 text-sm">Total Pre-Order Products</div>
          <div className="text-3xl font-bold text-blue-600">{preOrders.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-gray-600 text-sm">Ready for Delivery</div>
          <div className="text-3xl font-bold text-green-600">{readyCount}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-gray-600 text-sm">Waiting for Stock</div>
          <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-gray-600 text-sm">Total Shortage</div>
          <div className="text-3xl font-bold text-red-600">{totalShortage}</div>
        </div>
      </div>

      {/* Pre-Order Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Product Name</th>
              <th className="text-center px-4 py-3 font-semibold">Current Stock</th>
              <th className="text-center px-4 py-3 font-semibold">Reserved</th>
              <th className="text-center px-4 py-3 font-semibold">Order Count</th>
              <th className="text-center px-4 py-3 font-semibold">Shortage</th>
              <th className="text-center px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {preOrders.map((order) => (
              <tr key={order.productId} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <a href={`/product/${order.slug}`} className="text-blue-600 hover:underline">
                    {order.productName}
                  </a>
                </td>
                <td className="text-center px-4 py-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    {order.currentStock}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                    {order.totalReserved}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className="font-semibold">{order.preOrderCount}</span>
                </td>
                <td className="text-center px-4 py-4">
                  {order.shortage > 0 ? (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                      {order.shortage}
                    </span>
                  ) : (
                    <span className="text-green-600">-</span>
                  )}
                </td>
                <td className="text-center px-4 py-4">
                  {order.canDeliver ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                      Ready for Delivery
                    </span>
                  ) : (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preOrders.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          No pre-orders found
        </div>
      )}
    </div>
  );
}
