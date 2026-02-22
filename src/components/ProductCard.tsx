import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400x600'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Quick Add Button */}
        <button className="absolute bottom-4 right-4 bg-white text-stone-900 p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-600 hover:text-white">
          <ShoppingBag size={20} />
        </button>
      </Link>

      <div className="p-5">
        <p className="text-xs text-yellow-600 uppercase tracking-wider font-medium mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-oswald text-lg text-stone-900 mb-2 group-hover:text-yellow-600 transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="font-playfair text-stone-600 italic">Rs. {product.price.toLocaleString()}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
