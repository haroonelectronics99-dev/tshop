import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Ruler, ShoppingBag, Truck, Check, Scissors } from 'lucide-react';

const sizes = ['S', 'M', 'L', 'XL', 'Custom'];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    length: '',
    shoulder: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const customization = {
      size: selectedSize,
      measurements: selectedSize === 'Custom' ? measurements : null
    };

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      customization
    });
    
    navigate('/cart');
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img: string, idx: number) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-stone-100 cursor-pointer hover:opacity-80">
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="text-yellow-600 uppercase tracking-wider text-sm font-medium">{product.category}</span>
            <h1 className="font-oswald text-4xl md:text-5xl mt-2 mb-4 text-stone-900">{product.name}</h1>
            <p className="font-playfair text-2xl text-stone-600 italic mb-6">Rs. {product.price.toLocaleString()}</p>
            
            <div className="prose prose-stone mb-8 text-stone-500">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="font-oswald text-lg mb-4 flex items-center gap-2">
                <Ruler size={20} /> Select Size
              </h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                      selectedSize === size
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'
                    }`}
                  >
                    {size === 'Custom' ? <Scissors size={16} /> : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Measurements Form */}
            {selectedSize === 'Custom' && (
              <div className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-100">
                <h4 className="font-oswald text-sm uppercase mb-4 text-stone-500">Enter Your Measurements (Inches)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(measurements).map((key) => (
                    <div key={key}>
                      <label className="block text-xs uppercase text-stone-400 mb-1">{key}</label>
                      <input
                        type="number"
                        value={measurements[key as keyof typeof measurements]}
                        onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-md focus:outline-none focus:border-yellow-600"
                        placeholder="0.0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-600 text-white py-4 rounded-full font-medium uppercase tracking-widest hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-600/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-stone-100 pt-8 space-y-4 text-sm text-stone-500">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-stone-400" />
                <span>Estimated Delivery: {product.estimated_days} - {product.estimated_days + 2} days</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-stone-400" />
                <span>Premium Quality Fabric</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
