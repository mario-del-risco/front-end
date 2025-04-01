// src/components/CollectionDetails.tsx
'use client';

import { useState } from 'react';
import { Document } from 'mongodb';

interface CollectionDetailsProps {
  documents: Document[];
}

export default function CollectionDetails({ documents }: CollectionDetailsProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  
  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          No documents found in this collection
        </p>
      </div>
    );
  }
  
  // Get all unique field names across documents
  const fieldNames = new Set<string>();
  documents.forEach(doc => {
    Object.keys(doc).forEach(key => fieldNames.add(key));
  });
  
  // Convert to array and remove _id field (will be shown separately)
  const fields = Array.from(fieldNames).filter(field => field !== '_id').sort();
  
  const toggleDocument = (id: string) => {
    if (expandedDoc === id) {
      setExpandedDoc(null);
    } else {
      setExpandedDoc(id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 overflow-x-auto">
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="space-y-4">
        {documents.map((doc) => {
          const id = doc._id.toString();
          const isExpanded = expandedDoc === id;
          
          return (
            <div key={id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-700"
                onClick={() => toggleDocument(id)}
              >
                <div className="font-medium">
                  <span className="text-gray-800 dark:text-gray-200">ID: </span>
                  <span className="text-gray-600 dark:text-gray-400">{id}</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {isExpanded && (
                <div className="p-4">
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify(doc, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}