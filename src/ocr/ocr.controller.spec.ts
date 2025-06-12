import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { DocumentsToBeProcessed } from './types/document.type';

describe('OcrController', () => {
  let controller: OcrController;
  let service: jest.Mocked<OcrService>;

  const mockValidFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test-id-card.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('mock image content'),
    size: 1024 * 100, // 100KB
    destination: '',
    filename: '',
    path: '',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    stream: null as any,
  };

  // Mock successful OCR result
  const mockOcrResult = {
    success: true,
    confidence: 0.95,
    documentType: DocumentsToBeProcessed.ID_CARD,
    extractedData: {
      rut: '12.345.678-9',
      name: 'JUAN PEREZ',
    },
    processingTimeMs: 150,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcrController],
      providers: [
        {
          provide: OcrService,
          useValue: {
            processDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OcrController>(OcrController);
    service = module.get(OcrService);
  });

  describe('processDocument', () => {
    it('should successfully process a valid document', async () => {
      const dto = { documentType: DocumentsToBeProcessed.ID_CARD };

      const mockProcess = jest
        .spyOn(service, 'processDocument')
        .mockResolvedValue(mockOcrResult);
      const result = await controller.processDocument(mockValidFile, dto);

      expect(result).toEqual({
        success: true,
        filename: mockValidFile.originalname,
        documentType: dto.documentType,
        data: mockOcrResult,
      });

      expect(mockProcess).toHaveBeenCalledWith(
        mockValidFile.buffer,
        dto.documentType,
      );
      mockProcess.mockClear();
    });

    it('should process all supported document types', async () => {
      const documentTypes = Object.values(DocumentsToBeProcessed);

      for (const documentType of documentTypes) {
        const dto = { documentType };
        const mockProcess = jest
          .spyOn(service, 'processDocument')
          .mockResolvedValue(mockOcrResult);
        await controller.processDocument(mockValidFile, dto);

        expect(mockProcess).toHaveBeenCalledWith(
          mockValidFile.buffer,
          documentType,
        );
        mockProcess.mockClear();
      }
    });

    it('should handle service errors appropriately', async () => {
      const dto = { documentType: DocumentsToBeProcessed.ID_CARD };
      const errorMessage = 'OCR processing failed';
      const mockProcess = jest
        .spyOn(service, 'processDocument')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.processDocument(mockValidFile, dto),
      ).rejects.toThrow(BadRequestException);

      expect(mockProcess).toHaveBeenCalledWith(
        mockValidFile.buffer,
        dto.documentType,
      );
      mockProcess.mockClear();
    });
  });
});
