import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, ShoppingBag, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Shalwar Kameez',
    images: '',
    estimated_days: 7
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeJobs: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } else {
        const res = await fetch('/api/orders/admin/all');
        const data = await res.json();
        setOrders(data);
        
        // Calculate stats
        const totalOrders = data.length;
        const totalRevenue = data.reduce((sum: number, order: any) => sum + order.total_price, 0);
        const activeJobs = data.filter((order: any) => ['Pending', 'In Progress'].includes(order.status)).length;
        setStats({ totalOrders, totalRevenue, activeJobs });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      images: formData.images.split(',').map(s => s.trim()), // Simple CSV for images
      estimated_days: Number(formData.estimated_days)
    };

    try {
      const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowForm(false);
        fetchData();
        resetForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Shalwar Kameez',
      images: '',
      estimated_days: 7
    });
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const openEdit = (product: any) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images.join(', '),
      estimated_days: product.estimated_days
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-oswald text-4xl">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-full uppercase text-sm tracking-wider ${activeTab === 'products' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-full uppercase text-sm tracking-wider ${activeTab === 'orders' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600'}`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Total Revenue</h3>
              <p className="font-oswald text-3xl text-stone-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Total Orders</h3>
              <p className="font-oswald text-3xl text-stone-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Active Jobs</h3>
              <p className="font-oswald text-3xl text-yellow-600">{stats.activeJobs}</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-full uppercase tracking-wider text-sm hover:bg-yellow-700 transition-all"
              >
                <Plus size={18} /> Add New Design
              </button>
            </div>

            {showForm && (
              <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-stone-100 animate-in fade-in slide-in-from-top-4">
                <h3 className="font-oswald text-xl mb-6">{isEditing ? 'Edit Design' : 'Add New Design'}</h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Design Name"
                      className="w-full p-3 border border-stone-200 rounded-md"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <select
                      className="w-full p-3 border border-stone-200 rounded-md"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Shalwar Kameez</option>
                      <option>Waistcoat</option>
                      <option>Prince Coat</option>
                      <option>Sherwani</option>
                      <option>Kurta</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Description"
                    className="w-full p-3 border border-stone-200 rounded-md"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Price (PKR)"
                      className="w-full p-3 border border-stone-200 rounded-md"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Est. Days"
                      className="w-full p-3 border border-stone-200 rounded-md"
                      value={formData.estimated_days}
                      onChange={e => setFormData({...formData, estimated_days: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Image URLs (comma separated)"
                      className="w-full p-3 border border-stone-200 rounded-md"
                      value={formData.images}
                      onChange={e => setFormData({...formData, images: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-stone-500 hover:text-stone-800">Cancel</button>
                    <button type="submit" className="bg-stone-900 text-white px-8 py-2 rounded-md uppercase tracking-wider text-sm">Save</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex gap-4">
                  <img src={product.images[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-grow">
                    <h4 className="font-oswald text-lg">{product.name}</h4>
                    <p className="text-sm text-stone-500 mb-2">{product.category}</p>
                    <p className="font-bold text-yellow-600">Rs. {product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => openEdit(product)} className="p-2 text-stone-400 hover:text-stone-800 bg-stone-50 rounded-full"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-stone-400 hover:text-red-500 bg-stone-50 rounded-full"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="p-4 font-oswald uppercase text-sm text-stone-500">Order ID</th>
                    <th className="p-4 font-oswald uppercase text-sm text-stone-500">Customer</th>
                    <th className="p-4 font-oswald uppercase text-sm text-stone-500">Items</th>
                    <th className="p-4 font-oswald uppercase text-sm text-stone-500">Total</th>
                    <th className="p-4 font-oswald uppercase text-sm text-stone-500">Status</th>
                    <th className="p-4 font-oswald uppercase text-sm text-stone-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 font-mono text-sm">#{order.id}</td>
                      <td className="p-4">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-stone-500">{order.customer_phone}</p>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="mb-1">
                              {item.quantity}x {item.product_name}
                              {item.customization?.size === 'Custom' && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Custom</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-bold">Rs. {order.total_price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs uppercase font-medium tracking-wider ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="bg-white border border-stone-200 rounded-md text-sm p-1 focus:outline-none focus:border-yellow-600"
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Ready</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
