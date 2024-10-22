import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { PDFViewer } from './components/PDFViewer';
import { AnalysisResult } from './components/AnalysisResult';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to upload to S3 and get analysis
      // Replace with actual AWS S3 integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis('Sample analysis result for the uploaded PDF...\n\nThis is where the actual analysis from the S3 bucket would appear.');
    } catch (err) {
      setError('Failed to analyze the PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Analyzer</h1>
          <p className="text-gray-600 mb-6">Upload a PDF file to analyze its content</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Choose PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Analyze PDF
            </button>
          </div>

          {error && (
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          
          {selectedFile && (
            <p className="text-sm text-gray-600 mb-4">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[800px]">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">PDF Content</h2>
            <div className="h-[700px]">
              <PDFViewer file={selectedFile} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>
            <div className="h-[700px]">
              <AnalysisResult content={analysis} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;