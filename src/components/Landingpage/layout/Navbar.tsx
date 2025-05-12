'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
          >
            <div className={cn(
              "text-2xl font-bold tracking-tight transition-colors",
              isScrolled ? "text-pink-600" : "text-gray-900"
            )}>
              Elevio
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks isScrolled={isScrolled} />
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  isScrolled 
                    ? "text-gray-700 hover:text-pink-600" 
                    : "text-gray-800 hover:text-pink-700"
                )}
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  isScrolled 
                    ? "bg-pink-600 text-white hover:bg-pink-700" 
                    : "bg-pink-500 text-white hover:bg-pink-600"
                )}
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                "p-2 rounded-md transition-colors",
                isScrolled ? "text-gray-700" : "text-gray-900"
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <NavLinks mobile setMobileMenuOpen={setMobileMenuOpen} />
            <div className="flex flex-col space-y-4 w-64">
              <Link 
                href="/login" 
                className="px-4 py-3 rounded-md text-center text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-3 rounded-md text-center bg-pink-600 text-white hover:bg-pink-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ 
  isScrolled, 
  mobile,
  setMobileMenuOpen
}: { 
  isScrolled?: boolean;
  mobile?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}) {
  const links = [
    { name: 'Features', href: '#features' },
    { name: 'For Tutors', href: '#tutors' },
    { name: 'For Students', href: '#students' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className={cn(
      "flex",
      mobile ? "flex-col space-y-6" : "space-x-8"
    )}>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "transition-colors font-medium",
            mobile 
              ? "text-2xl text-gray-900 hover:text-pink-600" 
              : "text-sm",
            !mobile && isScrolled
              ? "text-gray-700 hover:text-pink-600"
              : "text-gray-800 hover:text-pink-700"
          )}
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}