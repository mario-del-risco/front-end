// src/components/CollectionList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CollectionListProps {
  collections: string[];
}

export default function CollectionList({ collections }: CollectionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCollections = collections.filter(collection => 
    collection.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search collections..."
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCollections.length > 0 ? (
        <ul className="space-y-2">
          {filteredCollections.map((collection) => (
            <li key={collection} className="border-b dark:border-gray-700 py-2">
              <Link 
                href={`/collections/${collection}`}
                className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{collection}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No collections found
        </div>
      )}
    </div>
  );
}