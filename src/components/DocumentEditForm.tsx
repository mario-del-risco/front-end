// src/components/DocumentEditForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentFormProps {
  document: {
    _id: string;
    [key: string]: any;
  };
  collectionName: string;
}

export default function DocumentEditForm({ document, collectionName }: DocumentFormProps) {
  const [formData, setFormData] = useState(document);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle text input changes
  const handleInputChange = (
    fieldName: string,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  // Handle array field changes
  const handleArrayChange = (
    fieldName: string,
    index: number,
    value: string
  ) => {
    const updatedArray = [...(formData[fieldName] || [])];
    updatedArray[index] = value;
    
    setFormData({
      ...formData,
      [fieldName]: updatedArray,
    });
  };

  // Add a new item to an array field
  const handleAddArrayItem = (fieldName: string) => {
    setFormData({
      ...formData,
      [fieldName]: [...(formData[fieldName] || []), ''],
    });
  };

  // Remove an item from an array field
  const handleRemoveArrayItem = (fieldName: string, index: number) => {
    const updatedArray = [...(formData[fieldName] || [])];
    updatedArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [fieldName]: updatedArray,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/collections/${collectionName}/${document._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update document');
      }

      // Redirect to document view page
      router.push(`/collections/${collectionName}/document/${document._id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form fields based on document structure
  const renderFormFields = () => {
    return Object.entries(formData)
      .filter(([key]) => key !== '_id') // Don't allow editing the ID
      .map(([key, value]) => {
        // Render array fields differently
        if (Array.isArray(value)) {
          return (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">{key}</label>
              {value.map((item, index) => (
                <div key={`${key}-${index}`} className="flex mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(key, index, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(key, index)}
                    className="ml-2 px-3 py-2 bg-red-600 text-white rounded-md"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem(key)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md"
              >
                + Add {key} item
              </button>
            </div>
          );
        }

        // Render object fields
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">{key}</label>
              <textarea
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsedValue = JSON.parse(e.target.value);
                    handleInputChange(key, parsedValue);
                  } catch (err) {
                    // Allow invalid JSON while editing
                    handleInputChange(key, e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border rounded-md font-mono dark:bg-gray-700 dark:border-gray-600"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Edit as JSON object
              </p>
            </div>
          );
        }

        // Render boolean fields as checkboxes
        if (typeof value === 'boolean') {
          return (
            <div key={key} className="mb-4 flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={(e) => handleInputChange(key, e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor={key} className="ml-2 text-sm font-medium">
                {key}
              </label>
            </div>
          );
        }

        // Render number fields
        if (typeof value === 'number') {
          return (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">{key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          );
        }

        // Default to text input for strings and other types
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">{key}</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        );
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Document</h2>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:text-red-300 dark:border-red-800">
          {error}
        </div>
      )}
      
      {renderFormFields()}
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}