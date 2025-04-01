// src/app/page.tsx
import { Metadata } from 'next';
import clientPromise from '@/lib/mongodb';
import CollectionList from '@/components/CollectionList';

export const metadata: Metadata = {
  title: 'Jiujitsu Database Viewer',
  description: 'A MongoDB collection viewer for Jiujitsu database',
};

export default async function Home() {
  const client = await clientPromise;
  const db = client.db('Jiujitsu');
  
  // Get all collections from the database
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(collection => collection.name);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Jiujitsu Database Collections</h1>
      <CollectionList collections={collectionNames} />
    </main>
  );
}