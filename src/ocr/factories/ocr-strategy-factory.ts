import { OCRStrategy } from '../interfaces/ocr-strategy';
import { IdCardOCRStrategy } from '../strategies/id-card-ocr-strategy/id-card-ocr.strategy';
import { PensionOCRStrategy } from '../strategies/pension-ocr.strategy';
import { AFPOCRStrategy } from '../strategies/afp-ocr.strategy';
import { DocumentsToBeProcessedType } from '../types/document.type';

export class OCRStrategyFactory {
  private static strategies = new Map<DocumentsToBeProcessedType, OCRStrategy>([
    ['ID_CARD', new IdCardOCRStrategy()],
    ['PENSION_IPS', new PensionOCRStrategy()],
    ['AFP_STATEMENT', new AFPOCRStrategy()],
  ]);

  static createStrategy(documentType: DocumentsToBeProcessedType): OCRStrategy {
    const strategy = this.strategies.get(documentType);
    if (!strategy) {
      throw new Error(`Unsupported document type: ${documentType}`);
    }
    return strategy;
  }

  static registerStrategy(
    documentType: DocumentsToBeProcessedType,
    strategy: OCRStrategy,
  ): void {
    this.strategies.set(documentType, strategy);
  }
}
