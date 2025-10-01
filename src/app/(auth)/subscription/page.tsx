'use client'

import React, { useEffect, useState } from "react";
import { Check, Sparkles, Shield, Clock } from "lucide-react";
import Navbar from "@/components/student/navbar";
import useAuthStore from '@/store/userAuthStore';
import { createSubscritionOrder, getSubscriptions, verifySubscritionPayment } from "@/app/service/user/userApi";
import { SubscriptionType } from "@/types/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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

const PricingPlans = () => {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionType[]>();
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentFailureModalOpen, setIsPaymentFailureModalOpen] = useState<boolean>(false);
  const [paymentFailureMessage, setPaymentFailureMessage] = useState<string>('');
  const { user } = useAuthStore();
  const userId = user?.id;

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (Price: number, planId: string, planName: string) => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    setSelectedPlan(planId);

    try {
      if (!userId) {
        toast.error("Please log in to purchase this subscription");
        setPaymentFailureMessage("Please log in to purchase this subscription");
        setIsPaymentFailureModalOpen(true);
        setIsProcessingPayment(false);
        setSelectedPlan(null);
        return;
      }

      if (!Price || Price <= 0) {
        toast.error("Invalid Plan price");
        setPaymentFailureMessage("Invalid Plan price");
        setIsPaymentFailureModalOpen(true);
        setIsProcessingPayment(false);
        setSelectedPlan(null);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please check your network connection.");
        setPaymentFailureMessage("Failed to load payment gateway. Please check your network connection.");
        setIsPaymentFailureModalOpen(true);
        setIsProcessingPayment(false);
        setSelectedPlan(null);
        return;
      }

      const order = await createSubscritionOrder(userId, Price, planId);

      if (!order || !order.data || !order.data.orderId) {
        // toast.error("Failed to create order. Please try again.");
        setPaymentFailureMessage("Failed to create order. Please try again.");
        setIsPaymentFailureModalOpen(true);
        setIsProcessingPayment(false);
        setSelectedPlan(null);
        return;
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        toast.error("Payment system configuration error. Please contact support.");
        console.error("Missing Razorpay Key ID in environment variables");
        setPaymentFailureMessage("Payment system configuration error. Please contact support.");
        setIsPaymentFailureModalOpen(true);
        setIsProcessingPayment(false);
        setSelectedPlan(null);
        return;
      }

      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: order.data.paymentDetails.paymentAmount,
        currency: "INR",
        name: "Elevio Learning",
        description: `Purchase: ${planName} Subscription`,
        order_id: order.data.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verification = await verifySubscritionPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verification.status === "paid") {
              toast.success("Subscription purchased successfully! You now have full access to the premium features.");
              router.push("/home");
            } else {
              toast.error("Payment verification failed");
              setPaymentFailureMessage("Payment verification failed. Please contact support if your payment was processed.");
              setIsPaymentFailureModalOpen(true);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("We couldn't verify your payment. Please contact support if your payment was processed.");
            setPaymentFailureMessage("We couldn't verify your payment. Please contact support if your payment was processed.");
            setIsPaymentFailureModalOpen(true);
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: async() => {
            try {
              await verifySubscritionPayment(order.data.orderId, "", "");
            } catch (err) {
              console.error("Failed to notify backend of failure:", err);
            }
            setPaymentFailureMessage("Payment was not completed. Please try again.");
            setIsPaymentFailureModalOpen(true);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error("Something went wrong. Please try again later.");
      setPaymentFailureMessage("Something went wrong. Please try again later.");
      setIsPaymentFailureModalOpen(true);
    } finally {
      setIsProcessingPayment(false);
      setSelectedPlan(null);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await getSubscriptions();
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subscription plans");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and accelerate your learning with our flexible subscription plans
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscription?.map((plan, index) => (
            <div
              key={index}
              className={`relative transform transition-all duration-300 hover:scale-105 ${plan.planName.toLowerCase().includes('premium')
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white'
                  : 'bg-white text-gray-900'
                } rounded-2xl shadow-xl overflow-hidden`}
            >
              {plan.planName.toLowerCase().includes('premium') && (
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center mb-4">
                  {plan.planName.toLowerCase().includes('basic') && <Shield className="w-6 h-6 mr-2" />}
                  {plan.planName.toLowerCase().includes('premium') && <Sparkles className="w-6 h-6 mr-2" />}
                  {plan.planName.toLowerCase().includes('pro') && <Clock className="w-6 h-6 mr-2" />}
                  <h3 className="text-2xl font-bold">{plan.planName}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">₹{plan.price}</span>
                    <span className="ml-2 text-sm opacity-80">/{plan.duration.unit}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className={`w-5 h-5 mr-3 ${plan.planName.toLowerCase().includes('premium')
                          ? 'text-yellow-300'
                          : 'text-green-500'
                        }`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (!plan._id) {
                      toast.error("Plan ID is missing. Please try again.");
                      setPaymentFailureMessage("Plan ID is missing. Please try again.");
                      setIsPaymentFailureModalOpen(true);
                      return;
                    }
                    handlePayment(plan.price, plan._id, plan.planName);
                  }}
                  disabled={isProcessingPayment && selectedPlan === plan._id}
                  className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.planName.toLowerCase().includes('premium')
                      ? 'bg-white text-indigo-600 hover:bg-gray-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } ${isProcessingPayment && selectedPlan === plan._id ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isProcessingPayment && selectedPlan === plan._id
                    ? 'Processing...'
                    : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure payment</span>
            <span className="mx-2">•</span>
            <span>24/7 Support</span>
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

export default PricingPlans;