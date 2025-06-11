import { OCRStrategy } from '../interfaces/OCRStrategy';
import { OCRResult } from '../interfaces/OCRResult';
import { OCRConfig } from '../interfaces/OCRConfig';

export class IdCardOCRStrategy implements OCRStrategy {
  private readonly defaultConfig: OCRConfig = {
    language: 'spa',
    dpi: 300,
    enhanceImage: true,
    confidenceThreshold: 0.8,
    timeout: 30000,
    retryAttempts: 2,
    customParams: {
      detectFaces: true,
      validateFormat: true,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(imageBuffer: Buffer): Promise<OCRResult> {
    throw new Error('Not implemented');
  }

  getOCRConfig(): OCRConfig {
    return this.defaultConfig;
  }
}
