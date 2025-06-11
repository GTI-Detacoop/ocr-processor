import { OCRStrategy } from './interfaces/ocr-strategy';
import { OCRResult } from './interfaces/ocr-result';

export class OCRProcessor {
  private strategy: OCRStrategy;

  constructor(strategy: OCRStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: OCRStrategy): void {
    this.strategy = strategy;
  }

  async processDocument(imageBuffer: Buffer): Promise<OCRResult> {
    try {
      const result = await this.strategy.process(imageBuffer);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
