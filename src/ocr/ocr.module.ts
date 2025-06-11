import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { OCRProcessor } from './ocr-processor';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [OcrController],
  providers: [OcrService, OCRProcessor],
  exports: [OcrService],
})
export class OcrModule {}
