import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      login(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
        <div className="text-center">
          <h2 className="font-oswald text-3xl font-bold text-stone-900 uppercase tracking-wider">Create Account</h2>
          <p className="mt-2 text-sm text-stone-600 font-playfair italic">Join our exclusive community</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">{error}</div>}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-3 top-3 text-stone-400" size={20} />
            <input
              name="name"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-10 py-3 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-stone-400" size={20} />
            <input
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-10 py-3 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-stone-400" size={20} />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="appearance-none rounded-md relative block w-full px-10 py-3 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-stone-400" size={20} />
            <input
              name="phone"
              type="tel"
              className="appearance-none rounded-md relative block w-full px-10 py-3 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-stone-400" size={20} />
            <input
              name="address"
              type="text"
              className="appearance-none rounded-md relative block w-full px-10 py-3 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 uppercase tracking-wider transition-all mt-6"
            >
              Create Account
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-yellow-600 hover:text-yellow-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
