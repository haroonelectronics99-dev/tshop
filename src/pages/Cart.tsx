import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            customization_details: item.customization
          })),
          total_price: total
        })
      });

      if (res.ok) {
        clearCart();
        navigate('/my-orders'); // Or success page
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen bg-stone-50">
        <h2 className="font-oswald text-3xl mb-4">Your Cart is Empty</h2>
        <p className="text-stone-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full uppercase tracking-wider text-sm">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-oswald text-4xl mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex gap-6">
                <div className="w-24 h-32 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-oswald text-lg">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-stone-500 text-sm mb-4">Size: {item.customization.size}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-playfair italic text-lg">Rs. {item.price.toLocaleString()}</span>
                    <span className="text-stone-400 text-sm">Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 sticky top-32">
              <h3 className="font-oswald text-xl mb-6 uppercase tracking-wider">Order Summary</h3>
              <div className="space-y-4 mb-8 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-stone-100 pt-4 flex justify-between font-bold text-stone-900 text-lg">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-yellow-600 text-white py-4 rounded-full font-medium uppercase tracking-widest hover:bg-yellow-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
