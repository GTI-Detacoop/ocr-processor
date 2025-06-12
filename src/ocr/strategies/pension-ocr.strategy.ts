import { OCRStrategy } from '../interfaces/ocr-strategy';
import { OCRResult } from '../interfaces/ocr-result';
import { OCRConfig } from '../interfaces/ocr-config';

export class PensionOCRStrategy implements OCRStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(imageBuffer: Buffer): Promise<OCRResult> {
    throw new Error('Not implemented');
  }

  getOCRConfig(): OCRConfig {
    throw new Error('Not implemented');
  }
}
