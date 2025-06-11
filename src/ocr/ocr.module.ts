import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { OCRProcessor } from './ocr-processor';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [OcrController],
  providers: [OcrService, OCRProcessor],
  exports: [OcrService],
})
export class OcrModule {}
