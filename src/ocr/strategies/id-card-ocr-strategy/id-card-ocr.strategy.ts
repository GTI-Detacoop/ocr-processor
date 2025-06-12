import { OCRStrategy } from '../../interfaces/ocr-strategy';
import { OCRResult } from '../../interfaces/ocr-result';
import { OCRConfig } from '../../interfaces/ocr-config';
import { createWorker, PSM } from 'tesseract.js';

import * as sharp from 'sharp';
import { CedulaParser } from './id-card-parser';

import { IdCardData } from '../../interfaces/id-card-data';

export class IdCardOCRStrategy implements OCRStrategy {
  private readonly parser = CedulaParser;
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

  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    try {
      const processedImage = await sharp(imageBuffer)
        .grayscale()
        .normalize()
        .sharpen()
        .resize(2000, null, {
          withoutEnlargement: false,
          kernel: sharp.kernel.lanczos3,
        })
        .threshold(128)
        .toBuffer();

      return processedImage;
    } catch (error) {
      console.error('Error preprocessing image:', error);
      return imageBuffer;
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
    const requiredFields = ['run', 'nombres', 'apellidos'];

    for (const field of requiredFields) {
      if (!data[field as keyof IdCardData]) {
        return false;
      }
    }

    if (!this.validateRun(data.run)) {
      return false;
    }

    const dateFields = ['fechaNacimiento', 'fechaEmision', 'fechaVencimiento'];
    for (const field of dateFields) {
      const value = data[field as keyof IdCardData];
      if (value && !this.validateChileanDate(value)) {
        return false;
      }
    }

    return true;
  }

  private validateRun(run: string): boolean {
    const runRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
    return runRegex.test(run);
  }

  private validateChileanDate(date: string): boolean {
    const dateRegex =
      /^\d{1,2}\s*(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)\s*\d{4}$/i;
    return dateRegex.test(date);
  }
}
