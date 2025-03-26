'use client'

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, BookOpen, Clock } from 'lucide-react';
import { useRouter, useParams } from "next/navigation";
import Navbar from '@/components/student/navbar';
import { cartData } from '@/app/service/user/userApi';
import { CartItem } from '@/types/types';

const Cart = () => {
    const router = useRouter();
    const params = useParams();
    const studentId = params.id as string

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const handleCart = async () => {
        console.log("Starting handleCart, studentId:", studentId);

        if (!studentId) {
            console.log("Student ID is missing, exiting handleCart.");
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            console.log("Fetching cart data...");
            setLoading(true);
            const response = await cartData(studentId);

            console.log("Cart API Response:", response);

            if (!response) {
                console.log("No response from cartData, setting empty cart");
                setCartItems([]);
                return;
            }

            if (response.success && response.data) {
                const items = response.data.items || [];
                console.log("Setting cart items:", items);
                setCartItems(items);
            } else {
                console.log("Invalid response or no data, setting empty cart");
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            setCartItems([]);
        } finally {
            console.log("Finally block reached, setting loading to false");
            setLoading(false);
        }
    };



    useEffect(() => {
        console.log("useEffect triggered, studentId:", studentId);
        if (studentId) {
            handleCart();
        } else {
            console.log("No studentId in useEffect, setting empty cart & loading false");
            setCartItems([]); // Ensure empty cart
            setLoading(false);
        }
    }, [studentId]);


    const totalPrice = cartItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;


    console.log("Rendering with cartItems:", cartItems, "Loading:", loading);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Loading cart...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                                <img
                                                    src={item.courseImage}
                                                    alt={item.courseTitle}
                                                    className="w-48 h-32 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {item.courseTitle}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.courseSubtitle}
                                                    </p>
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
                                                    <span className="text-lg font-medium text-gray-900">
                                                        ${item.price}
                                                    </span>
                                                    <button className="text-red-600 hover:text-red-700 flex items-center">
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
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base text-gray-600">
                                    <span>Tax</span>
                                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${(totalPrice * 1.1).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Checkout Now
                                </button>
                                <p className="text-sm text-gray-500 text-center mt-4">
                                    30-Day Money-Back Guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;