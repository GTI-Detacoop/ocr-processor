import { OCRStrategy } from '../interfaces/OCRStrategy';
import { OCRResult } from '../interfaces/OCRResult';
import { OCRConfig } from '../interfaces/OCRConfig';

export class AFPOCRStrategy implements OCRStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(imageBuffer: Buffer): Promise<OCRResult> {
    throw new Error('Not implemented');
  }

  getOCRConfig(): OCRConfig {
    throw new Error('Not implemented');
  }
}
