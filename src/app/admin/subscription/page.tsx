'use client'

import React, { useState, useEffect } from 'react';
import { Check, Edit, Trash2, Plus } from 'lucide-react';
import AdminSidebar from '@/components/admin/adminsidebar';
import SubscriptionModal from '@/components/admin/subscriptionCreationModal';
import { getSubscriptions, createSubscription, deleteSubscription, updateSubscription } from '@/app/service/admin/adminApi';
import { SubscriptionType } from '@/types/types';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSubscriptions, setHasSubscriptions] = useState(false); // Track if any subscriptions exist

  // Fetch subscriptions from the backend
  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const data = await getSubscriptions(currentPage, 3);

      if (data && data.data) {
        const fetchedSubscriptions = data.data.subscriptions || [];
        setSubscriptions(fetchedSubscriptions);

        // Calculate total pages based on totalRecord
        const totalRecords = data.data.totalRecord || 0;
        console.log("total records",totalRecords)
        setTotalPages(Math.ceil(totalRecords / 3));
        setError(null);
      } else {
        setError("Failed to fetch subscription plans");
        setSubscriptions([]);
        setTotalPages(1);
        setHasSubscriptions(false);
      }
    } catch (err) {
      console.error('Error in component while fetching subscriptions:', err);
      setError("An unexpected error occurred");
      setSubscriptions([]);
      setTotalPages(1);
      setHasSubscriptions(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [currentPage]);

  // Handle creating/updating a subscription
  const handleSaveSubscription = async (subscription: SubscriptionType) => {
    try {
      console.log('Saving subscription:', subscription);
      if (subscription._id && subscription._id.trim() !== '') {
        console.log('Updating subscription with ID:', subscription._id);
        const subscriptionToUpdate = { ...subscription };
        const result = await updateSubscription(subscription._id, subscriptionToUpdate);
        if (result && result.data) {
          setCurrentPage(1); 
          await fetchSubscriptionData();
          setEditingSubscription(null);
          setIsModalOpen(false);
        }
      } else {
        console.log('Creating new subscription');
        const subscriptionToCreate = { ...subscription };
        delete subscriptionToCreate._id;
        const result = await createSubscription(subscriptionToCreate);
        if (result && result.data && result.data._id) {
          setCurrentPage(1); // Reset to page 1 after creation
          await fetchSubscriptionData();
          setIsModalOpen(false);
        } else {
          setCurrentPage(1);
          await fetchSubscriptionData();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      setError('Failed to save subscription');
    }
  };

  // Handle deleting a subscription
  const handleDeleteSubscription = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription plan?")) {
      try {
        console.log('Deleting subscription with ID:', id);
        const result = await deleteSubscription(id);
        if (result) {
          console.log('Subscription deleted:', result);
          setCurrentPage(1); // Reset to page 1 after deletion
          await fetchSubscriptionData();
        } else {
          throw new Error('Delete subscription returned no result');
        }
      } catch (error) {
        console.error('Error deleting subscription:', error);
        setError('Failed to delete subscription');
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (subscription: SubscriptionType) => {
    console.log('Editing subscription:', subscription);
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navbar - Now Fixed */}
      <div className="fixed top-0 left-0 w-full bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center z-50 h-16">
      <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>      </div>

      {/* Main Content Area with Sidebar and Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar - Now Fixed */}
        <div className="fixed top-0 left-0 h-full w-64 bg-black pt-16 z-40 border-r border-gray-800">
          <AdminSidebar />
        </div>

        {/* Main Content - Adjusted with left margin */}
        <div className="ml-64 w-[calc(100%-256px)] p-6 bg-black">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Subscription Plans</h1>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              onClick={() => {
                setEditingSubscription(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={20} />
              <span>Create new plan</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-700">
            <div className="flex gap-4">
              <button className="px-4 py-2 text-blue-400 border-b-2 border-blue-400">
                User Subscription
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-900/30 border border-red-700 p-4 rounded-md text-center">
              <p>Failed to load subscription plans: {error}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
                onClick={() => fetchSubscriptionData()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Subscription Content */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {/* Subscription Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.length > 0 ? (
                  subscriptions.map((subscription, index) => (
                    <div
                      key={subscription._id || `temp-subscription-${index}`}
                      className="bg-[#111111] rounded-lg p-6 hover:bg-[#1A1A1A] transition-colors border border-gray-800"
                    >
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold">{subscription.planName}</h2>
                        <div className="flex items-baseline mt-2">
                          <span className="text-3xl font-bold">₹{subscription.price}</span>
                          <span className="text-gray-400 ml-2">
                            per {subscription.duration.unit}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {subscription.features && subscription.features.map((feature, idx) => (
                          <div key={`${subscription._id || index}-feature-${idx}`} className="flex items-center gap-2">
                            <Check size={18} className="text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                          onClick={() => handleEditClick(subscription)}
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                          onClick={() => subscription._id ? handleDeleteSubscription(subscription._id) : null}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 bg-[#111111] rounded-lg">
                    <p className="text-gray-400">
                      {!hasSubscriptions ? "No subscription plans found" : "No subscriptions on this page"}
                    </p>
                    {!hasSubscriptions && (
                      <button
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Create your first plan
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination - Centered below grid */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page: number) => setCurrentPage(page)}
                  />
                </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Creation/Edit Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubscription(null);
        }}
        onSave={handleSaveSubscription}
        initialData={editingSubscription}
      />
    </div>
  );
};

export default Subscription;