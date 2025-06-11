import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  DocumentsToBeProcessed,
  DocumentsToBeProcessedType,
} from '../types/document.type';

export class ProcessDocumentDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Document image file (jpg, jpeg, png, or webp)',
    required: true,
  })
  @IsNotEmpty({ message: 'File is required' })
  file: Express.Multer.File;

  @ApiProperty({
    enum: DocumentsToBeProcessed,
    enumName: 'DocumentType',
    description: ' Type of document to process',
    example: DocumentsToBeProcessed.ID_CARD,
    required: true,
  })
  @IsEnum(DocumentsToBeProcessed, {
    message: `Document type must be one of: ${Object.values(
      DocumentsToBeProcessed,
    ).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Document type is required' })
  documentType: DocumentsToBeProcessedType;
}
