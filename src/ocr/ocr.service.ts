import { OCRProcessor } from './ocr-processor';
import { OCRStrategyFactory } from './factories/ocr-strategy-factory';
import { OCRResult } from './interfaces/ocr-result';
import {
  DocumentsToBeProcessed,
  DocumentsToBeProcessedType,
} from './types/document.type';

export class OcrService {
  private readonly ocrProcessor: OCRProcessor;

  constructor() {
    const cardStrategy = OCRStrategyFactory.createStrategy(
      DocumentsToBeProcessed.ID_CARD,
    );
    this.ocrProcessor = new OCRProcessor(cardStrategy);
  }

  async processDocument(
    imageBuffer: Buffer,
    documentType: DocumentsToBeProcessedType,
  ): Promise<OCRResult> {
    const strategy = OCRStrategyFactory.createStrategy(documentType);
    this.ocrProcessor.setStrategy(strategy);
    return this.ocrProcessor.processDocument(imageBuffer);
  }
}
