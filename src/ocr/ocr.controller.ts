import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiOperation, ApiBody } from '@nestjs/swagger';
import { OcrService } from './ocr.service';
import { ProcessDocumentDto } from './dto/process-document.dto';

@ApiTags('OCR')
@Controller('ocr')
export class OcrController {
  private readonly logger = new Logger(OcrController.name);

  constructor(private readonly ocrService: OcrService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process a document using OCR' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document file upload with type',
    type: ProcessDocumentDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
          cb(
            new BadRequestException(
              'Only image files are allowed (jpg, jpeg, png, webp)',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async processDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() processDocumentDto: ProcessDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.debug(
      `Processing ${processDocumentDto.documentType} document: ${file.originalname}`,
    );

    try {
      const result = await this.ocrService.processDocument(
        file.buffer,
        processDocumentDto.documentType,
      );

      this.logger.debug(
        `Successfully processed document: ${file.originalname}`,
      );

      return {
        success: true,
        filename: file.originalname,
        documentType: processDocumentDto.documentType,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Error processing document ${file.originalname}: ${error}`,
      );

      throw new BadRequestException(
        `Error processing document: ${file.originalname}`,
      );
    }
  }
}
