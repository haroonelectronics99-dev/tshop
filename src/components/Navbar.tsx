import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="font-oswald text-2xl font-bold tracking-widest text-stone-900">
              MM <span className="text-yellow-600">TAILOR</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-stone-600 hover:text-yellow-600 transition-colors font-medium uppercase text-sm tracking-wide">Home</Link>
            <Link to="/shop" className="text-stone-600 hover:text-yellow-600 transition-colors font-medium uppercase text-sm tracking-wide">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-stone-600 hover:text-yellow-600 transition-colors font-medium uppercase text-sm tracking-wide">Admin</Link>
            )}
            {user?.role === 'customer' && (
               <Link to="/my-orders" className="text-stone-600 hover:text-yellow-600 transition-colors font-medium uppercase text-sm tracking-wide">My Orders</Link>
            )}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="text-stone-600 hover:text-yellow-600 transition-colors relative">
              <ShoppingBag size={20} />
              {/* Cart Badge Placeholder */}
              {/* <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span> */}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="text-stone-600 hover:text-yellow-600 transition-colors flex items-center gap-2">
                  <User size={20} />
                  <span className="text-xs uppercase font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md py-2 hidden group-hover:block border border-stone-100">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-stone-600 hover:text-yellow-600 transition-colors font-medium uppercase text-xs tracking-wide border border-stone-300 px-4 py-2 rounded-full hover:border-yellow-600">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-600 hover:text-yellow-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-stone-600 hover:text-yellow-600 font-medium uppercase text-sm">Home</Link>
              <Link to="/shop" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-stone-600 hover:text-yellow-600 font-medium uppercase text-sm">Shop</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-stone-600 hover:text-yellow-600 font-medium uppercase text-sm">Admin Dashboard</Link>
              )}
               {user?.role === 'customer' && (
                <Link to="/my-orders" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-stone-600 hover:text-yellow-600 font-medium uppercase text-sm">My Orders</Link>
              )}
              <div className="border-t border-stone-100 my-2 pt-2">
                {user ? (
                   <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600 hover:text-yellow-600 font-medium uppercase text-sm">Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-stone-600 hover:text-yellow-600 font-medium uppercase text-sm">Login</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
