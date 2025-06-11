import { OCRProcessor } from './ocr-processor';
import { OCRStrategyFactory } from './factories/ocr-strategy-factory';
import { OCRResult } from './interfaces/ocr-result';
import { DocumentType } from './types/document.type';

export class OcrService {
  private readonly ocrProcessor: OCRProcessor;

  constructor() {
    const cardStrategy = OCRStrategyFactory.createStrategy('ID_CARD');
    this.ocrProcessor = new OCRProcessor(cardStrategy);
  }

  async processDocument(
    imageBuffer: Buffer,
    documentType: DocumentType,
  ): Promise<OCRResult> {
    const strategy = OCRStrategyFactory.createStrategy(documentType);
    this.ocrProcessor.setStrategy(strategy);
    return this.ocrProcessor.processDocument(imageBuffer);
  }
}
