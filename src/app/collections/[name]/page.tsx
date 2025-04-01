// src/app/collections/[name]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import CollectionDetails from '@/components/CollectionDetails';
import { serializeDocuments } from '@/lib/mongodb-helpers';

interface Props {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.name} Collection | Jiujitsu Database`,
    description: `View details of the ${params.name} collection in the Jiujitsu database`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const client = await clientPromise;
  const db = client.db('Jiujitsu');
  
  try {
    // Get documents from the collection
    const rawDocuments = await db.collection(params.name).find({}).limit(20).toArray();
    
    // Serialize documents to make them safe for client components
    const documents = serializeDocuments(rawDocuments);
    
    // Get total count
    const totalCount = await db.collection(params.name).countDocuments();
    
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collections
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{params.name} Collection</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Total documents: {totalCount}
        </p>
        
        <CollectionDetails documents={documents} />
      </main>
    );
  } catch (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collections
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{params.name} Collection</h1>
        
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <h2 className="font-bold">Error loading collection</h2>
          <p>{(error as Error).message}</p>
        </div>
      </main>
    );
  }
}