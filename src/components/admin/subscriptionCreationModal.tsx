'use client'

import React, { useState, useEffect } from 'react';
import { Plus, X, CheckCircle2 } from 'lucide-react';
import { SubscriptionModalProps, SubscriptionType } from '@/types/types';

function SubscriptionModal({ isOpen, onClose, onSave, initialData }: SubscriptionModalProps) {
  const [planName, setPlanName] = useState<string>('');
  const [durationValue, setDurationValue] = useState<number>(1);
  const [durationUnit, setDurationUnit] = useState<'day' | 'month' | 'quarter' | 'year'>('month');
  const [price, setPrice] = useState<string>('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [status, setStatus] = useState<boolean>(true);
  const [currentFeature, setCurrentFeature] = useState<string>('');

  // Update form when initialData changes or modal opens
// In SubscriptionModal.tsx, ensure the useEffect properly handles all fields:
useEffect(() => {
  if (isOpen && initialData) {
      console.log('Populating form with initialData:', initialData);
      setPlanName(initialData.planName || '');
      setDurationValue(initialData.duration?.value || 1);
      setDurationUnit(initialData.duration?.unit || 'month');
      setPrice(initialData.price !== undefined ? initialData.price.toString() : '');
      setFeatures(initialData.features && initialData.features.length ? initialData.features : ['']);
      setStatus(initialData.status !== undefined ? initialData.status : true);
      setCurrentFeature('');
  } else if (isOpen) {
      resetForm();
  }
}, [isOpen, initialData]);

  const handleAddFeature = () => {
    if (currentFeature.trim() !== '') {
      setFeatures([...features, currentFeature]);
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures.length ? updatedFeatures : ['']);
  };

  const handleSave = async () => {
    try {
      const finalFeatures = [...features];
      if (currentFeature.trim() !== '') {
        finalFeatures.push(currentFeature);
      }
      
      const filteredFeatures = finalFeatures.filter(feature => feature.trim() !== '');
      
      const subscriptionData: SubscriptionType = {
        _id: initialData?._id, // Change id to _id
        planName,
        duration: {
          value: Number(durationValue),
          unit: durationUnit
        },
        price: Number(price),
        features: filteredFeatures.length ? filteredFeatures : [],
        status
      };
  
      console.log('Subscription data to save:', subscriptionData);
      await onSave(subscriptionData);
      handleClose();
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  const resetForm = () => {
    setPlanName('');
    setDurationValue(1);
    setDurationUnit('month');
    setPrice('');
    setFeatures(['']);
    setCurrentFeature('');
    setStatus(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl w-full max-w-lg border border-gray-800 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold">
              {initialData ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">Plan Name</label>
              <input
                type="text"
                placeholder="e.g. Premium Monthly"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Duration</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 1, 3, 6"
                value={durationValue}
                onChange={(e) => setDurationValue(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Unit</label>
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value as 'day' | 'month' | 'quarter' | 'year')}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                style={{ 
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", 
                  backgroundPosition: "right 0.5rem center", 
                  backgroundRepeat: "no-repeat", 
                  backgroundSize: "1.5em 1.5em", 
                  paddingRight: "2.5rem" 
                }}
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">Price (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-gray-400">₹</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 199"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">Features</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a feature"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  disabled={!currentFeature.trim()}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              {features.length > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 mb-4 max-h-40 overflow-y-auto">
                  {features.map((feature, index) => (
                    feature.trim() && (
                      <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-700 mb-1 group">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span>{feature}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
            <div className="col-span-2">
              <div className="flex items-center">
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="toggle"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"
                  ></label>
                </div>
                <label htmlFor="toggle" className="text-gray-300">
                  {status ? 'Active' : 'Inactive'}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800">
          <div className="flex justify-end space-x-3">
            <button
              className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={!planName.trim() || !price.trim() || isNaN(Number(price))}
            >
              {initialData ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(1.5rem);
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}

export default SubscriptionModal;