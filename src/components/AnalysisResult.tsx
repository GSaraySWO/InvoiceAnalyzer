import React from 'react';

interface AnalysisResultProps {
  content: string;
  isLoading: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ content, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No analysis available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white rounded-lg shadow-inner p-6">
      <pre className="whitespace-pre-wrap font-mono text-xs">{content}</pre>
    </div>
  );
};