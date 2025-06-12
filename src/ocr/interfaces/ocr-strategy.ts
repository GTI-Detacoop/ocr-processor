import { OCRResult } from './ocr-result';
import * as sharp from 'sharp';
export abstract class OCRStrategy {
  abstract process(imageBuffer: Buffer): Promise<OCRResult>;

  async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
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
}
