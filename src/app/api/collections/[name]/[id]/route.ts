// src/app/api/collections/[name]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getToken } from 'next-auth/jwt';
import clientPromise from '@/lib/mongodb';

export async function PUT(
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

    // Only admin users can edit documents
    if (token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
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

    // Get request body
    const body = await request.json();
    
    // Remove the _id field from the update data (MongoDB doesn't allow modifying it)
    const { _id, ...updateData } = body;
    
    // Update the document
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Document updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { message: 'Error updating document', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Only admin users can delete documents
    if (token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
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

    // Delete the document
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { message: 'Error deleting document', error: (error as Error).message },
      { status: 500 }
    );
  }
}