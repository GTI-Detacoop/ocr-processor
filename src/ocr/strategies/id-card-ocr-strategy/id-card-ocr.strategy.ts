import { OCRStrategy } from '../../interfaces/ocr-strategy';
import { OCRResult } from '../../interfaces/ocr-result';
import { OCRConfig } from '../../interfaces/ocr-config';
import { createWorker, PSM } from 'tesseract.js';
import { CedulaParser } from './id-card-parser';

import { IdCardData } from '../../interfaces/id-card-data';
import { IdCardValidator } from './id-card-validator';

export class IdCardOCRStrategy extends OCRStrategy {
  private readonly parser = CedulaParser;
  private readonly validator = IdCardValidator;
  private readonly defaultConfig: OCRConfig = {
    language: 'spa',
  };

  async process(imageBuffer: Buffer): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      const enhancedBuffer = await this.preprocessImage(imageBuffer);

      const ocrText = await this.performOCR(enhancedBuffer);

      const extractedData = this.extractIdCardData(ocrText);

      const isValid = this.validateExtractedData(extractedData);

      return {
        success: true,
        rawText: ocrText,
        confidence: isValid ? 0.9 : 0.7,
        extractedData: extractedData,
        documentType: 'chilean_id_card',
        processingTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        rawText: '',
        confidence: 0,
        extractedData: {},
        documentType: 'chilean_id_card',
        processingTimeMs: Date.now() - startTime,
        errors: [
          error instanceof Error ? error.message : 'Unknown error occurred',
        ],
      };
    }
  }

  private async performOCR(imageBuffer: Buffer): Promise<string> {
    try {
      const worker = await createWorker(this.defaultConfig.language, 0, {
        logger: (m) => console.log(m),
      });

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.áéíóúñÁÉÍÓÚÑ ',
        preserve_interword_spaces: '1',
      });

      const {
        data: { text },
      } = await worker.recognize(imageBuffer);

      await worker.terminate();

      return text;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error}`);
    }
  }

  private extractIdCardData(ocrText: string): IdCardData {
    const parseData = this.parser.parse(ocrText);
    console.log(parseData);
    return parseData;
  }

  private validateExtractedData(data: IdCardData): boolean {
    return this.validator.validate(data);
  }
}
