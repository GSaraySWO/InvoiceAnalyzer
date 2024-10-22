import { 
  PutObjectCommand, 
  GetObjectCommand,
  S3Client 
} from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '../config/aws';

export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = s3Client;
  }

  async uploadPDF(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.uploadBucket,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: 'application/pdf',
    });

    await this.client.send(command);
    return fileName;
  }

  async getAnalysisResult(fileName: string): Promise<string> {
    // Extract the original PDF name from the timestamp-prefixed filename
    const originalPdfName = fileName.substring(fileName.indexOf('-') + 1);
    const analysisKey = `${originalPdfName}-analyzeexpenseresponse.txt`;
    
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.analysisBucket,
      Key: analysisKey,
    });

    const response = await this.client.send(command);
    const analysisText = await response.Body?.transformToString();
    return analysisText || '';
  }

  async pollForAnalysis(fileName: string, maxAttempts = 10): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await this.getAnalysisResult(fileName);
        if (result) return result;
      } catch (error) {
        if ((error as any).name !== 'NoSuchKey') throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Analysis timeout');
  }
}

export const s3Service = new S3Service();