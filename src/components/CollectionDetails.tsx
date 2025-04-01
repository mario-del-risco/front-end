// src/components/CollectionDetails.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DocumentType {
  _id: string;
  [key: string]: any;
}

interface CollectionDetailsProps {
  documents: DocumentType[];
}

export default function CollectionDetails({ documents }: CollectionDetailsProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const pathname = usePathname();
  
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
          const id = doc._id;
          const isExpanded = expandedDoc === id;
          const documentName = doc.technique || doc.name || doc.position || 'Document';
          
          return (
            <div key={id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
                <div 
                  className="flex-1 font-medium cursor-pointer"
                  onClick={() => toggleDocument(id)}
                >
                  <span className="text-gray-800 dark:text-gray-200">
                    {documentName}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ID: {id}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`${pathname}/document/${id}`}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => toggleDocument(id)}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
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