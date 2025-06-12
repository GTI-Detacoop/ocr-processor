import { IdCardData } from 'src/ocr/interfaces/id-card-data';

export class IdCardValidator {
  static validate(data: IdCardData): boolean {
    return this.validateExtractedData(data);
  }

  private static validateExtractedData(data: IdCardData): boolean {
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

  private static validateRun(run: string): boolean {
    const runRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
    return runRegex.test(run);
  }

  private static validateChileanDate(date: string): boolean {
    const dateRegex =
      /^\d{1,2}\s*(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)\s*\d{4}$/i;
    return dateRegex.test(date);
  }
}
