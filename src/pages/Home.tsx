import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Ruler, Truck } from 'lucide-react';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-stone-50">
      <Hero />

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 border border-stone-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-600 transition-colors">
                <Scissors className="text-stone-600 group-hover:text-white" size={32} />
              </div>
              <h3 className="font-oswald text-xl mb-4">Custom Menswear</h3>
              <p className="text-stone-500 font-light">Expertly tailored Shalwar Kameez, Waistcoats, and Suits to fit your physique perfectly.</p>
            </div>
            <div className="p-8 border border-stone-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-600 transition-colors">
                <Ruler className="text-stone-600 group-hover:text-white" size={32} />
              </div>
              <h3 className="font-oswald text-xl mb-4">Made-to-Measure</h3>
              <p className="text-stone-500 font-light">Provide your measurements for a bespoke fit that exudes confidence and class.</p>
            </div>
            <div className="p-8 border border-stone-100 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-600 transition-colors">
                <Truck className="text-stone-600 group-hover:text-white" size={32} />
              </div>
              <h3 className="font-oswald text-xl mb-4">Global Delivery</h3>
              <p className="text-stone-500 font-light">We deliver premium Pakistani menswear worldwide with secure packaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-oswald text-4xl mb-2">Men's Exclusive</h2>
              <p className="font-playfair italic text-stone-500">Traditional elegance meets modern style.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium uppercase tracking-wider text-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading collection...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-yellow-600 font-medium uppercase tracking-wider text-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1612460067603-12a830a91a99?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-oswald text-5xl mb-6">Experience Luxury Tailoring</h2>
          <p className="font-playfair text-xl text-stone-300 mb-10 italic">
            "Style is a way to say who you are without having to speak."
          </p>
          <Link to="/shop" className="inline-block bg-white text-stone-900 px-10 py-4 rounded-full font-medium uppercase tracking-widest hover:bg-yellow-600 hover:text-white transition-all duration-300">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
