
'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, BookOpen, Clock } from 'lucide-react';
import Navbar from '@/components/student/navbar';
import useAuthStore from '@/store/tutorAuthStore';
import { cartData, removeItem } from '@/app/service/user/userApi';
import { CartItem } from '@/types/types';
import { toast } from 'react-toastify';
import { useCartCountStore } from '@/store/cartCountStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import CartLoading from '@/components/student/cartLoading';
import Image from 'next/image';

const Cart = () => {
  const { user } = useAuthStore();
  const studentId = user?.id;
  const { decrementCartCount } = useCartCountStore();
  const { setCartItems } = useCartStore();

  const [cartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCart = async () => {
    if (!studentId) {
      console.log('Student ID is missing.');
      return;
    }
    try {
      setLoading(true);
      const response = await cartData(studentId);
      if (response.success && response.data) {
        const items = response.data.items || [];
        setLocalCartItems(items);
        setCartItems(items); // Update Zustand store
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCart();
  }, [studentId]);

  const handleRemove = async (id: string) => {
    if (!studentId) {
      toast.error('Student ID is missing.');
      return;
    }
    try {
      const response = await removeItem(id, studentId);
      if (response.success) {
        toast.success(response.message);
        const updatedItems = cartItems.filter((item) => item.courseId !== id);
        setLocalCartItems(updatedItems);
        decrementCartCount();
        setCartItems(updatedItems); // Update Zustand store
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {/* <p>Loading cart...</p> */}
        <CartLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
                  <span className="text-gray-600">{cartItems.length} Courses</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.length === 0 ? (
                  <p className="p-6 text-gray-500">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.courseId} className="p-6">
                      <div className="flex space-x-6">
                        <Image
                          src={item.courseImage}
                          alt={item.courseTitle}
                          width={192}
                          height={128}
                          className="object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.courseTitle}</h3>
                          <p className="mt-1 text-sm text-gray-500">{item.courseSubtitle}</p>
                          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {item.courseDuration} hours
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {item.courseLectures} lectures
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <span className="text-lg font-medium text-gray-900">₹{item.price}</span>
                          <button
                            onClick={() => handleRemove(item.courseId)}
                            className="text-red-600 hover:text-red-700 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-black text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                {/* <Link
                  href="/checkout"
                  className={`w-full text-white py-3 px-4 rounded-lg flex items-center justify-center ${cartItems.length === 0
                      ? 'bg-purple-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  aria-disabled={cartItems.length === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Checkout Now
                </Link> */}
                {cartItems.length === 0 ? (
                  <button
                    className="w-full bg-purple-300 text-white py-3 px-4 rounded-lg flex items-center justify-center cursor-not-allowed"
                    disabled
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Checkout Now
                  </button>
                ) : (
                  <Link
                    href="/checkout"
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Checkout Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;