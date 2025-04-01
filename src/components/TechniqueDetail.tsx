// src/components/TechniqueDetail.tsx
'use client';

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
}

export default function TechniqueDetail({ document }: TechniqueProps) {
  const title = document.technique || document.name || 'Unnamed Technique';
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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