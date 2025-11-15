import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ZES</span>
              </div>
              <span className="text-xl font-bold">Zahid Electric Store</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for quality electrical solutions. We provide premium products, 
              expert guidance, and reliable service for all your electrical needs.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              {/* <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li> */}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/categories/wires-cables" className="text-gray-400 hover:text-white transition-colors">Wires & Cables</Link></li>
              <li><Link href="/categories/switches" className="text-gray-400 hover:text-white transition-colors">Switches</Link></li>
              <li><Link href="/categories/lighting" className="text-gray-400 hover:text-white transition-colors">Lighting</Link></li>
              <li><Link href="/categories/circuit-breakers" className="text-gray-400 hover:text-white transition-colors">Circuit Breakers</Link></li>
              <li><Link href="/categories/tools" className="text-gray-400 hover:text-white transition-colors">Tools</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">Zahid Electric Store, Bazar Topan Wala D.I.Khan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">0966 713244</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">zahidelectric@zes.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Zahid Electric Store. All rights reserved.
          </p>
          {/* <Link href="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Admin
              </Button>
            </Link>  */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
              ZES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}