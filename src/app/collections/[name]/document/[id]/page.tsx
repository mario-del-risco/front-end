// src/app/collections/[name]/document/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import TechniqueDetail from '@/components/TechniqueDetail';
import { serializeDocument } from '@/lib/mongodb-helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    name: string;
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = await clientPromise;
  const db = client.db('Jiujitsu');
  
  try {
    // Validate ObjectId
    const objectId = new ObjectId(params.id);
    const document = await db.collection(params.name).findOne({ _id: objectId });
    
    if (!document) {
      return {
        title: 'Document Not Found',
        description: 'The requested document could not be found',
      };
    }
    
    const documentName = document.technique || document.name || 'Document';
    
    return {
      title: `${documentName} | ${params.name} Collection`,
      description: document.description || `Details of ${documentName} in the ${params.name} collection`,
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while retrieving the document',
    };
  }
}

export default async function DocumentDetailPage({ params }: Props) {
  const client = await clientPromise;
  const db = client.db('Jiujitsu');
  
  try {
    // Validate ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(params.id);
    } catch (error) {
      notFound();
    }
    
    // Get the document
    const rawDocument = await db.collection(params.name).findOne({ _id: objectId });
    
    if (!rawDocument) {
      notFound();
    }
    
    // Serialize document
    const document = serializeDocument(rawDocument);
    
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/collections/${params.name}`} className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {params.name} Collection
          </Link>
        </div>
        
        <TechniqueDetail document={document} />
      </main>
    );
  } catch (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/collections/${params.name}`} className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {params.name} Collection
          </Link>
        </div>
        
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <h2 className="font-bold">Error loading document</h2>
          <p>{(error as Error).message}</p>
        </div>
      </main>
    );
  }
}