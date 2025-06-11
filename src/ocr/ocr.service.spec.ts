import { Test, TestingModule } from '@nestjs/testing';
import { OcrService } from './ocr.service';
import { IdCardOCRStrategy } from './strategies/id-card-ocr.strategy';
import { OCRResult } from './interfaces/ocr-result';
import { PensionOCRStrategy } from './strategies/pension-ocr.strategy';
import { AFPOCRStrategy } from './strategies/afp-ocr.strategy';

describe('OcrService', () => {
  let service: OcrService;
  const mockOcrResult: OCRResult = {
    success: true,
    confidence: 0.95,
    documentType: 'ID_CARD',
    extractedData: {},
    processingTimeMs: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcrService],
    }).compile();

    service = module.get<OcrService>(OcrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should properly initialize with default strategy', async () => {
    const mockProcess = jest
      .spyOn(IdCardOCRStrategy.prototype, 'process')
      .mockResolvedValue(mockOcrResult);
    const result = await service.processDocument(Buffer.from([]), 'ID_CARD');
    expect(result).toBeDefined();
    expect(mockProcess).toHaveBeenCalled();
    mockProcess.mockClear();
  });

  it('should not call the wrong strategy', async () => {
    const mockPensionProcess = jest
      .spyOn(PensionOCRStrategy.prototype, 'process')
      .mockResolvedValue(mockOcrResult);
    const mockAfpProcess = jest
      .spyOn(AFPOCRStrategy.prototype, 'process')
      .mockResolvedValue(mockOcrResult);
    const mockIdCardProcess = jest
      .spyOn(IdCardOCRStrategy.prototype, 'process')
      .mockResolvedValue(mockOcrResult);
    const result = await service.processDocument(
      Buffer.from([]),
      'PENSION_IPS',
    );
    expect(result).toBeDefined();
    expect(mockPensionProcess).toHaveBeenCalled();
    expect(mockAfpProcess).not.toHaveBeenCalled();
    expect(mockIdCardProcess).not.toHaveBeenCalled();
    mockPensionProcess.mockClear();
    mockAfpProcess.mockClear();
    mockIdCardProcess.mockClear();
  });
});
