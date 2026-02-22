import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/my-orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <div className="pt-32 text-center">Loading orders...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-oswald text-4xl mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <p className="text-stone-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-sm text-stone-400 uppercase tracking-wider">Order #{order.id}</span>
                    <p className="text-stone-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-xs uppercase font-medium tracking-wider ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-stone-800">{item.product_name}</p>
                        <p className="text-xs text-stone-500">Qty: {item.quantity} | Size: {item.customization?.size || 'N/A'}</p>
                      </div>
                      <p className="text-sm font-playfair italic">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between font-bold text-stone-900">
                  <span>Total</span>
                  <span>Rs. {order.total_price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
