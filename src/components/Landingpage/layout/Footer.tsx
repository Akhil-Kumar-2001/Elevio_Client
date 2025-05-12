import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand and description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold">Elevio</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Transforming education through technology. Our platform connects students 
              with expert tutors for a personalized learning experience.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={20} />, href: '#' },
                { icon: <Twitter size={20} />, href: '#' },
                { icon: <Instagram size={20} />, href: '#' },
                { icon: <Linkedin size={20} />, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 text-gray-400 hover:text-white hover:bg-pink-600 p-2 rounded-full transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { text: 'Features', href: '#features' },
                { text: 'For Tutors', href: '#tutors' },
                { text: 'For Students', href: '#students' },
                { text: 'Pricing', href: '/pricing' },
                { text: 'Testimonials', href: '/testimonials' },
                { text: 'Blog', href: '/blog' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              {[
                { text: 'Terms of Service', href: '/terms' },
                { text: 'Privacy Policy', href: '/privacy' },
                { text: 'Cookie Policy', href: '/cookies' },
                { text: 'GDPR Compliance', href: '/gdpr' },
                { text: 'Accessibility', href: '/accessibility' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {[
                { 
                  icon: <Mail size={18} />, 
                  text: 'support@elevio.com', 
                  href: 'mailto:support@elevio.com'
                },
                { 
                  icon: <Phone size={18} />, 
                  text: '+1 (888) 123-4567', 
                  href: 'tel:+18881234567'
                },
                { 
                  icon: <MapPin size={18} />, 
                  text: '123 Education St, San Francisco, CA 94107', 
                  href: '#'
                },
              ].map((contact, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 text-pink-400 mt-1">
                    {contact.icon}
                  </div>
                  <a 
                    href={contact.href} 
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {contact.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom section with copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} Elevio. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/help" className="text-gray-500 text-sm hover:text-pink-400 transition-colors">
                Help Center
              </Link>
              <Link href="/status" className="text-gray-500 text-sm hover:text-pink-400 transition-colors">
                System Status
              </Link>
              <Link href="/feedback" className="text-gray-500 text-sm hover:text-pink-400 transition-colors">
                Send Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}