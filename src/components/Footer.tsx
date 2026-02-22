import React from 'react';
import { Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-oswald text-2xl text-white mb-6 tracking-widest">MM <span className="text-yellow-600">TAILOR</span></h3>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Crafting elegance with precision. We bring your dream designs to life with premium fabrics and expert stitching.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-yellow-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-yellow-600 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-oswald text-lg text-white mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/shop" className="hover:text-yellow-600 transition-colors">Shop Collection</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Bridal Wear</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Custom Stitching</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-oswald text-lg text-white mb-6 uppercase tracking-wider">Visit Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-yellow-600 mt-1 flex-shrink-0" size={18} />
                <span>Satar Chowk Moula bhai Wali Gali,<br />Attock City, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-yellow-600 flex-shrink-0" size={18} />
                <a href="https://wa.me/923359816508" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +92 335 9816508
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-16 pt-8 text-center text-xs tracking-wider uppercase">
          &copy; {new Date().getFullYear()} MM Tailor & Cloth. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
