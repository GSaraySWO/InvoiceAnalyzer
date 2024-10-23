import { 
  PutObjectCommand, 
  GetObjectCommand,
  S3Client 
} from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '../config/aws';
import { Buffer } from 'buffer';

// Polyfill Buffer for environments that don't support it natively
(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = s3Client;
  }

  async uploadPDF(file: File): Promise<string> {
    console.log('Uploading file:', file);
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
    console.log('Getting analysis result:', fileName);
    
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.analysisBucket,
      Key: fileName,
    });

    const response = await this.client.send(command);
    const analysisText = await response.Body?.transformToString();
    return analysisText || '';
  }

  async pollForAnalysis(fileName: string, maxAttempts = 4): Promise<string> {
    console.log('Polling for analysis result:', fileName);
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await this.getAnalysisResult(fileName);
        if (result) return result;
      } catch (error) {
        if ((error as any).name !== 'NoSuchKey') throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    throw new Error('Analysis timeout');
  }
}

export const s3Service = new S3Service();