'use client'
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Navbar from "@/components/student/navbar";
import useAuthStore from '@/store/userAuthStore';
import { createOrder, createSubscritionOrder, getSubscriptions, verifyPayment, verifySubscritionPayment } from "@/app/service/user/userApi";
import { SubscriptionType } from "@/types/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


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
}

// Extend the Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const PricingPlans = () => {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const { user } = useAuthStore();
  const userId = user?.id;

  // Function to dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true); // Script already loaded
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

  // Handle payment initiation
  const handlePayment = async (Price: number, planId: string, planName: string) => {
    console.log("plan price",Price,typeof(Price))
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      // Validate required data
      if (!userId) {
        toast.error("Please log in to purchase this subscription");
        return;
      }

      if (!Price || Price <= 0) {
        toast.error("Invalid Plan price");
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please check your network connection.");
        return;
      }

      // Create order
      const order = await createSubscritionOrder(userId, Price, planId);
      // console.log("order in component",order.data)

      if (!order || !order.data || !order.data.orderId) {
        // toast.error("Failed to create order. Please try again.");
        return;
      }

      // Get Razorpay key from environment
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        toast.error("Payment system configuration error. Please contact support.");
        console.error("Missing Razorpay Key ID in environment variables");
        return;
      }

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: order.data.paymentDetails.paymentAmount,
        currency: "INR",
        name: "Elevio Learning",
        description: `Purchase: ${planName} Subscription`,
        order_id: order.data.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verification = await verifySubscritionPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verification.status === "paid") {
              toast.success("Subscription purchased successfully! You now have full access to the premium features.");
              router.push("/home");
            } else {
              toast.error("Payment verification failed. Please contact support if your payment was processed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("We couldn't verify your payment. Please contact support if your payment was processed.");
          }
        },
        prefill: {
          name: "Student Name", // Replace with actual student data
          email: "student@example.com",
        },
        theme: {
          color: "#6B46C1",
        },
      };

      // Initialize and open Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await getSubscriptions();
      console.log(response)
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <Navbar />
      <div className="text-center mt-14 mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 mt-2">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {subscription?.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
          >
            <div className="text-center mb-5">
              <h3 className="text-xl font-semibold text-gray-800">{plan.planName}</h3>
              <div className="w-14 h-0.5 bg-gray-300 mx-auto my-2"></div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-black">₹ {plan.price}</span>
              </div>
              <p className="text-sm text-gray-600">Per {plan.duration.unit}</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-base text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (!plan._id) {
                  toast.error("Plan ID is missing. Please try again.");
                  return;
                }
                handlePayment(plan.price, plan._id, plan.planName);
              }}
              className="w-full py-3 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition duration-200"
            >
              Subscribe Now
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
