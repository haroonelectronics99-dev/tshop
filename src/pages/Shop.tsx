import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Filter } from 'lucide-react';

const categories = ['All', 'Shalwar Kameez', 'Waistcoat', 'Prince Coat', 'Sherwani', 'Kurta'];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { products, loading } = useProducts(selectedCategory === 'All' ? undefined : selectedCategory);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-oswald text-5xl mb-4">Our Collection</h1>
          <p className="font-playfair text-stone-500 italic text-lg">Discover the finest designs crafted for you.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-500">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
