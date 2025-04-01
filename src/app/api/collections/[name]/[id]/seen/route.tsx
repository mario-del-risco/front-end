// src/app/api/collections/[name]/[id]/seen/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getToken } from 'next-auth/jwt';
import clientPromise from '@/lib/mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string; id: string } }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('Jiujitsu');
    const collection = db.collection(params.name);

    // Validate ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(params.id);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid document ID' },
        { status: 400 }
      );
    }

    // Get request body for instructor name
    const body = await request.json();
    const instructorName = body.instructor || token.name || 'Unknown Instructor';
    
    // Create a new seenBy entry
    const newEntry = {
      date: new Date().toISOString(),
      instructor: instructorName
    };

    // Update the document to add the new entry to the seenBy array
    const result = await collection.updateOne(
      { _id: objectId },
      { $push: { seenBy: newEntry } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Technique marked as seen',
        entry: newEntry 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { message: 'Error marking technique as seen', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// To get all seenBy entries for a document
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string; id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('Jiujitsu');
    const collection = db.collection(params.name);

    // Validate ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(params.id);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid document ID' },
        { status: 400 }
      );
    }

    // Get the document to retrieve the seenBy array
    const document = await collection.findOne(
      { _id: objectId },
      { projection: { seenBy: 1 } }
    );

    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { seenBy: document.seenBy || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving seenBy data:', error);
    return NextResponse.json(
      { message: 'Error retrieving seenBy data', error: (error as Error).message },
      { status: 500 }
    );
  }
}