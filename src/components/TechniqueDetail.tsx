// src/components/TechniqueDetail.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TechniqueProps {
  document: {
    _id: string;
    name?: string;
    technique?: string;
    description?: string;
    belt?: string | null;
    key_points?: string[];
    common_mistakes?: string[];
    related_techniques?: string[];
    [key: string]: any;
  };
  collectionName: string;
}

export default function TechniqueDetail({ document, collectionName }: TechniqueProps) {
  const title = document.technique || document.name || 'Unnamed Technique';
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAdmin = (session?.user as any)?.role === 'admin';

  const handleEdit = () => {
    router.push(`/collections/${collectionName}/document/${document._id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/collections/${collectionName}/${document._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete document');
      }

      // Navigate back to collection page
      router.push(`/collections/${collectionName}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleEdit}
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:text-red-300 dark:border-red-800">
          {error}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      {document.belt && (
        <div className="mb-4">
          <span className="font-semibold">Belt Level:</span> {document.belt}
        </div>
      )}
      
      {document.description && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300">{document.description}</p>
        </div>
      )}
      
      {document.key_points && document.key_points.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Key Points</h3>
          <ul className="list-disc pl-5 space-y-1">
            {document.key_points.map((point, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      {document.common_mistakes && document.common_mistakes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Common Mistakes</h3>
          <ul className="list-disc pl-5 space-y-1">
            {document.common_mistakes.map((mistake, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{mistake}</li>
            ))}
          </ul>
        </div>
      )}
      
      {document.related_techniques && document.related_techniques.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Related Techniques</h3>
          <ul className="list-disc pl-5 space-y-1">
            {document.related_techniques.map((technique, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{technique}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Show additional fields that aren't part of the standard structure */}
      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(document).filter(([key]) => 
            !['_id', 'name', 'technique', 'description', 'belt', 'key_points', 'common_mistakes', 'related_techniques'].includes(key)
          ).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="font-medium">{key}: </span>
              <span className="text-gray-700 dark:text-gray-300">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}