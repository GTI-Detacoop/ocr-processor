import { OCRStrategy } from '../interfaces/ocr-strategy';
import { IdCardOCRStrategy } from '../strategies/id-card-ocr.strategy';
import { PensionOCRStrategy } from '../strategies/pension-ocr.strategy';
import { AFPOCRStrategy } from '../strategies/afp-ocr.strategy';
import { DocumentType } from '../types/document.type';

export class OCRStrategyFactory {
  private static strategies = new Map<DocumentType, OCRStrategy>([
    ['ID_CARD', new IdCardOCRStrategy()],
    ['PENSION_IPS', new PensionOCRStrategy()],
    ['AFP_STATEMENT', new AFPOCRStrategy()],
  ]);

  static createStrategy(documentType: DocumentType): OCRStrategy {
    const strategy = this.strategies.get(documentType);
    if (!strategy) {
      throw new Error(`Unsupported document type: ${documentType}`);
    }
    return strategy;
  }

  static registerStrategy(
    documentType: DocumentType,
    strategy: OCRStrategy,
  ): void {
    this.strategies.set(documentType, strategy);
  }
}
