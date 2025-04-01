// src/lib/mongodb-helpers.ts
import { Document, ObjectId } from 'mongodb';

/**
 * Recursively converts MongoDB documents to plain JavaScript objects
 * Handles ObjectId, Date, and nested objects/arrays
 */
export function serializeDocument(doc: any): any {
  if (doc === null || doc === undefined) {
    return doc;
  }
  
  // Handle ObjectId
  if (doc instanceof ObjectId) {
    return doc.toString();
  }
  
  // Handle Date
  if (doc instanceof Date) {
    return doc.toISOString();
  }
  
  // Handle Arrays
  if (Array.isArray(doc)) {
    return doc.map(item => serializeDocument(item));
  }
  
  // Handle Objects (but not ObjectId or Date which were already handled)
  if (typeof doc === 'object') {
    const result: Record<string, any> = {};
    for (const key in doc) {
      result[key] = serializeDocument(doc[key]);
    }
    return result;
  }
  
  // Return primitive values as is
  return doc;
}

/**
 * Serializes an array of MongoDB documents
 */
export function serializeDocuments(docs: Document[]): any[] {
  return docs.map(doc => serializeDocument(doc));
}