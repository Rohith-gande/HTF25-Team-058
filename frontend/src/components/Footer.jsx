import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t -mt-1">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-600">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Podify</h2>
          <p className="text-sm">
            Turn your notes, articles, and ideas into podcasts using AI.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600">Features</a></li>
            <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-600">API</a></li>
            <li><a href="#" className="hover:text-blue-600">Integrations</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600">Careers</a></li>
            <li><a href="#" className="hover:text-blue-600">Blog</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t mt-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Podify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
