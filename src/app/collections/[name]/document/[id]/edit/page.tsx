// src/app/collections/[name]/document/[id]/edit/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import DocumentEditForm from '@/components/DocumentEditForm';
import { serializeDocument } from '@/lib/mongodb-helpers';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    name: string;
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Edit Document | ${params.name} Collection`,
    description: `Edit document in the ${params.name} collection`,
  };
}

export default async function EditDocumentPage({ params }: Props) {
  // Check authentication
  const session = await getServerSession(authConfig);
  
  // If not authenticated or not admin, redirect to login
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login?callbackUrl=' + encodeURIComponent(`/collections/${params.name}/document/${params.id}/edit`));
  }
  
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
          <Link href={`/collections/${params.name}/document/${params.id}`} className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Document
          </Link>
        </div>
        
        <DocumentEditForm document={document} collectionName={params.name} />
      </main>
    );
  } catch (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/collections/${params.name}/document/${params.id}`} className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Document
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