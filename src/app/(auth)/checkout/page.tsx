'use client';

import React, { useState } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import Navbar from '@/components/student/navbar';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCartCountStore } from '@/store/cartCountStore';
import useAuthStore from '@/store/userAuthStore';
import { removeItem, createOrder, verifyPayment } from '@/app/service/user/userApi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import PaymentFailureModal from '@/components/student/PaymentFailureModal';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cartItems, totalPrice, setCartItems } = useCartStore();
  const { decrementCartCount } = useCartCountStore();
  const { user } = useAuthStore();
  const subtotal = totalPrice;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPaymentFailureModalOpen, setIsPaymentFailureModalOpen] = useState<boolean>(false);
  const [paymentFailureMessage, setPaymentFailureMessage] = useState<string>('');

  const studentId = user?.id;

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRemoveItem = async (id: string) => {
    try {
      if (!studentId) {
        toast.error('Please log in to remove items from the cart');
        return;
      }
      const result = await removeItem(id, studentId);
      if (result) {
        const updatedCart = cartItems.filter((item) => item.courseId !== id);
        setCartItems(updatedCart);
        decrementCartCount();
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.warning('Please select a payment method');
      setPaymentFailureMessage('Please select a payment method');
      setIsPaymentFailureModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please check your network connection.');
        setPaymentFailureMessage('Failed to load payment gateway. Please check your network connection.');
        setIsPaymentFailureModalOpen(true);
        setLoading(false);
        return;
      }

      const courseIds = cartItems.map((item) => item.courseId);
      if (courseIds.length === 0) {
        toast.error('No courses in cart');
        setPaymentFailureMessage('No courses in cart');
        setIsPaymentFailureModalOpen(true);
        setLoading(false);
        return;
      }
      if (!studentId) {
        toast.error('Please log in to proceed with payment');
        setPaymentFailureMessage('Please log in to proceed with payment');
        setIsPaymentFailureModalOpen(true);
        setLoading(false);
        return;
      }

      const order = await createOrder(studentId, totalPrice, courseIds);
      console.log('order after creation', order);
      if (!order || !order.data || !order.data.razorpayOrderId) {
        // toast.error('Failed to create order. Please try again.');
        setPaymentFailureMessage('Failed to create order. Please try again.');
        setIsPaymentFailureModalOpen(true);
        setLoading(false);
        return;
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        toast.error('Payment system configuration error. Please contact support.');
        console.error('Missing Razorpay Key ID in environment variables');
        setPaymentFailureMessage('Payment system configuration error. Please contact support.');
        setIsPaymentFailureModalOpen(true);
        setLoading(false);
        return;
      }

      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: order.data.amount,
        currency: 'INR',
        name: 'Elevio Learning',
        description: 'Course Purchase',
        order_id: order.data.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            console.log('order id razorpay', response);
            const verification = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            console.log('verification', verification);

            if (verification.status === 'success') {
              setCartItems([]);
              toast.success('Payment completed successfully!');
              router.push('/cart');
            } else {
              toast.error('Payment verification failed');
              setPaymentFailureMessage('Payment verification failed. Please contact support if your payment was processed.');
              setIsPaymentFailureModalOpen(true);
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('We couldn’t verify your payment. Please contact support if your payment was processed.');
            setPaymentFailureMessage('We couldn’t verify your payment. Please contact support if your payment was processed.');
            setIsPaymentFailureModalOpen(true);
          }
        },
        prefill: {
          name:  'Student Name',
          email: 'student@example.com',
        },
        theme: {
          color: '#6B46C1',
        },
        modal: {
          ondismiss: () => {
            setPaymentFailureMessage('Payment was not completed. Please try again.');
            setIsPaymentFailureModalOpen(true);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong during payment');
      setPaymentFailureMessage('Something went wrong during payment. Please try again later.');
      setIsPaymentFailureModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Payment Method */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order details ({cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'})
              </h2>
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500">No items in cart</p>
                ) : (
                  cartItems.map((course, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="relative w-32 h-20">
                        <Image
                          src={course.courseImage}
                          alt={course.courseTitle}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{course.courseTitle}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center space-x-4">
                        <p className="text-sm font-medium text-gray-900">₹{course.price}</p>
                        <button
                          onClick={() => handleRemoveItem(course.courseId)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment method</h2>
              <button
                onClick={() => setSelectedPaymentMethod('razorpay')}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
                  selectedPaymentMethod === 'razorpay'
                    ? 'border-purple-500 text-purple-700 bg-purple-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                Razorpay
              </button>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <p>Original Price</p>
                  <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 pt-4 border-t">
                  <p>Total</p>
                  <p>₹{totalPrice.toFixed(2)}</p>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={loading || cartItems.length === 0}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                    loading || cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Complete Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentFailureModal
        isOpen={isPaymentFailureModalOpen}
        onClose={() => {
          setIsPaymentFailureModalOpen(false);
          setPaymentFailureMessage('');
        }}
        message={paymentFailureMessage || 'Payment failed. Please try again or contact support.'}
      />
    </div>
  );
};

export default Checkout;