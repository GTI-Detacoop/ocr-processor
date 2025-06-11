export interface OCRResult {
  success: boolean;
  confidence: number;
  documentType: string;
  extractedData: Record<string, any>;
  rawText?: string;
  processingTimeMs: number;
  errors?: string[];
}
