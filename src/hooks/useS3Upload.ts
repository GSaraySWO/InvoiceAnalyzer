import { useState } from 'react';
import { s3Service } from '../services/s3Service';

export const useS3Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const uploadAndAnalyze = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError('');
    

    try {
      const fileName = await s3Service.uploadPDF(file);
      console.log('Uploaded file:', fileName);

      // Extraer el nombre del archivo sin la extensión .pdf
      const originalPdfName = fileName;
      console.log('originalPdfName:', originalPdfName);
      
      const expectedFileName = `${originalPdfName}-analyzeexpenseresponse.txt`;
      console.log('originalPdfName:', expectedFileName);
  
      const analysis = await s3Service.pollForAnalysis(expectedFileName);
      return analysis;
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAndAnalyze, isUploading, error };
};