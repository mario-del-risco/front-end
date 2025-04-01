// src/components/TechniqueDetail.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import SeenByBadges from './SeenByBadges';

interface SeenByEntry {
  date: string;
  instructor: string;
}

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
    seenBy?: SeenByEntry[];
    [key: string]: any;
  };
  collectionName: string;
}

export default function TechniqueDetail({ document, collectionName }: TechniqueProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // helpful for soft refresh

  const title = document.technique || document.name || 'Unnamed Technique';
  const isAdmin = (session?.user as any)?.role === 'admin';

  const handleEdit = () => {
    router.push(`/collections/${collectionName}/document/${document._id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/collections/${collectionName}/${document._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete document');
      }

      router.push(`/collections/${collectionName}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAsSeen = async () => {
    if (!session?.user) return;

    setIsMarking(true);
    setError(null);

    try {
      const res = await fetch(`/api/collections/${collectionName}/${document._id}/seen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructor: session.user.name || 'Unknown Instructor',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to mark as seen');
      }

      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        {session?.user && (
          <button
            onClick={handleMarkAsSeen}
            disabled={isMarking}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {isMarking ? 'Marking...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Seen
              </>
            )}
          </button>
        )}

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
      </div>

      {/* Error Box */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:text-red-300 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Content */}
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

      {document.key_points?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Key Points</h3>
          <ul className="list-disc pl-5 space-y-1">
            {document.key_points.map((point, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">{point}</li>
            ))}
          </ul>
        </div>
      )}

      {document.common_mistakes?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Common Mistakes</h3>
          <ul className="list-disc pl-5 space-y-1">
            {document.common_mistakes.map((mistake, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {document.related_techniques?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Related Techniques</h3>
          <ul className="list-disc pl-5 space-y-1">
            {document.related_techniques.map((technique, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">{technique}</li>
            ))}
          </ul>
        </div>
      )}

      {document.seen_by_who?.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <SeenByBadges seenBy={document.seenBy} />
        </div>
      )}

      {/* Extra fields */}
      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(document).filter(([key]) =>
            ![
              '_id', 'name', 'technique', 'description', 'belt', 'key_points',
              'common_mistakes', 'related_techniques', 'seenBy',
            ].includes(key)
          ).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key}: </span>
              <span className="text-gray-700 dark:text-gray-300">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
