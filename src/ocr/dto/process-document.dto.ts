import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  DocumentsToBeProcessed,
  DocumentsToBeProcessedType,
} from '../types/document.type';

export class ProcessDocumentDto {
  @ApiProperty({
    enum: DocumentsToBeProcessed,
    enumName: 'DocumentType',
    description: 'Type of document to process',
    example: DocumentsToBeProcessed.ID_CARD,
    required: true,
  })
  @IsEnum(DocumentsToBeProcessed, {
    message: `documentType must be one of: ${Object.values(
      DocumentsToBeProcessed,
    ).join(', ')}`,
  })
  @IsNotEmpty({ message: 'documentType is required' })
  documentType: DocumentsToBeProcessedType;
}
