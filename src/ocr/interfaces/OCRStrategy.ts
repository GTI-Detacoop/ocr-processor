import { OCRConfig } from './OCRConfig';
import { OCRResult } from './OCRResult';

export interface OCRStrategy {
  process(imageBuffer: Buffer): Promise<OCRResult>;
  getOCRConfig(): OCRConfig;
}
