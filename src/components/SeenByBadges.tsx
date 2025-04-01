// src/components/SeenByBadges.tsx
'use client';

import { useState } from 'react';

interface SeenByEntry {
  date: string;
  instructor: string;
}

interface SeenByBadgesProps {
  seenBy?: SeenByEntry[];
}

export default function SeenByBadges({ seenBy }: SeenByBadgesProps) {
  const [showAll, setShowAll] = useState(false);
  
  if (!seenBy || seenBy.length === 0) {
    return null;
  }

  // Group by instructor to count occurrences
  const instructorCounts: Record<string, number> = {};
  const instructorDates: Record<string, string[]> = {};
  
  seenBy.forEach(entry => {
    const instructor = entry.instructor;
    instructorCounts[instructor] = (instructorCounts[instructor] || 0) + 1;
    
    if (!instructorDates[instructor]) {
      instructorDates[instructor] = [];
    }
    instructorDates[instructor].push(entry.date);
  });

  // Get instructors sorted by frequency
  const instructors = Object.keys(instructorCounts).sort((a, b) => 
    instructorCounts[b] - instructorCounts[a]
  );

  // Create a color map for instructors
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-gray-100 text-gray-800',
  ];
  
  const instructorColors: Record<string, string> = {};
  instructors.forEach((instructor, index) => {
    instructorColors[instructor] = colors[index % colors.length];
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Seen By</h3>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {instructors.map(instructor => (
          <div 
            key={instructor}
            className={`${instructorColors[instructor]} px-3 py-1 rounded-full text-sm font-medium flex items-center`}
          >
            {instructor} 
            <span className="ml-1 bg-white bg-opacity-30 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
              {instructorCounts[instructor]}
            </span>
          </div>
        ))}
      </div>
      
      {seenBy.length > 0 && (
        <div>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showAll ? 'Hide details' : 'Show all dates'}
          </button>
          
          {showAll && (
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {seenBy.map((entry, index) => (
                <div 
                  key={index}
                  className="text-sm flex items-center gap-2"
                >
                  <span className={`w-2 h-2 rounded-full ${instructorColors[entry.instructor].split(' ')[0]}`}></span>
                  <span className="font-medium">{entry.instructor}</span>
                  <span>-</span>
                  <span>{formatDate(entry.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}