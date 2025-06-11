import { OCRStrategy } from '../interfaces/OCRStrategy';
import { IdCardOCRStrategy } from '../strategies/IdCardOCRStrategy';
import { PensionOCRStrategy } from '../strategies/PensionOCRStrategy';
import { AFPOCRStrategy } from '../strategies/AFPOCRStrategy';

export type DocumentType = 'ID_CARD' | 'PENSION_IPS' | 'AFP_STATEMENT';

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
}
