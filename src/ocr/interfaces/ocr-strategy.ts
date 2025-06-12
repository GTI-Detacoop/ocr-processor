import { OCRResult } from './ocr-result';

export interface OCRStrategy {
  process(imageBuffer: Buffer): Promise<OCRResult>;
}
