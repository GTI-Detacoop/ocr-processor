/* eslint-disable no-useless-escape */
import { IdCardData } from '../../interfaces/id-card-data';

export class CedulaParser {
  static parse(rawText: string): IdCardData {
    const text = rawText;

    return {
      run: this.extractRun(text),
      nombres: this.extractName(text),
      apellidos: this.extractLastNames(text),
      nacionalidad: this.extractNationality(text),
      sexo: this.extractSex(text),
      fechaNacimiento: this.extractBirthDate(text),
      numeroDocumento: this.extractNumeroDocumento(text),
      fechaEmision: this.extractIssueDate(text),
      fechaVencimiento: this.extractExpirationDate(text),
    };
  }

  private static extractRun(text: string): string {
    return this.matchField(/RUN\s+([\d\.]+\-[K\d])/, text);
  }

  private static extractName(text: string): string {
    const regex = /(NOMBRE|NOMB[RE]S?)/i;
    const lineas = text.split('\n').map((line) => line.trim());

    for (let i = 0; i < lineas.length; i++) {
      if (regex.test(lineas[i])) {
        const apellido1 = lineas[i + 1] || '';
        const apellido2 = lineas[i + 2] || '';
        if (apellido1 || apellido2) {
          return `${apellido1} ${apellido2}`;
        }
      }
    }

    return '';
  }

  private static extractLastNames(text: string): string {
    const regex = /(APELLIDO|APE[UO]I?L?D[O0]S?)/i;
    const lineas = text.split('\n').map((line) => line.trim());

    for (let i = 0; i < lineas.length; i++) {
      if (regex.test(lineas[i])) {
        const apellido1 = lineas[i + 1] || '';
        const apellido2 = lineas[i + 2] || '';
        if (apellido1 && apellido2) {
          return `${apellido1} ${apellido2}`;
        }
      }
    }

    return '';
  }

  private static extractNationality(text: string): string {
    const lineas = text.split('\n').map((line) => line.trim());

    for (let i = 0; i < lineas.length; i++) {
      if (/NAC.{0,5}LIDAD/i.test(lineas[i])) {
        console.log('lineas[i]', lineas[i]);
        // Retorna la siguiente línea si existe y no está vacía
        const siguiente = lineas[i + 1]?.trim();
        if (siguiente) {
          return siguiente;
        }
      }
    }
    return '';
  }

  private static extractSex(text: string): string {
    const regex = /SE[X5][O0]\s*\n\s*([FM])/i;
    const match = text.match(regex);
    return match ? match[1].toUpperCase() : '';
  }

  private static extractBirthDate(text: string): string {
    const regex =
      /FECHA\s+(DE|OE)\s+NAC[IM]{1,2}I[EM]{0,2}N[T7][O0]\s*\n\s*([\d]{1,2}\s+[A-Z]{3,}\s+\d{4})/i;
    const match = text.match(regex);
    return match ? match[2].toUpperCase() : '';
  }

  private static extractNumeroDocumento(text: string): string {
    return this.matchField(/DOCUMENTO\s+(\d{6,})/, text);
  }

  private static extractIssueDate(text: string): string {
    const regex = /FECHA\s+DE\s+EM[I1]S[ÍI1]?[OÓ0]N\s*\n\s*([A-Z\d\s]{5,20})/i;
    const match = text.match(regex);
    return match ? match[1].trim().toUpperCase().split('\n')[0] : '';
  }

  private static extractExpirationDate(text: string): string {
    const regex =
      /FECHA\s+DE\s+V[EN]{1,2}C[IM]{1,2}I[EM]{0,2}N[T7][O0]\s*\n\s*([\d]{1,2}\s+[A-Z]{3,}\s+\d{4})/i;
    const match = text.match(regex);
    return match ? match[1].toUpperCase() : '';
  }

  private static matchField(regex: RegExp, text: string): string {
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }
}
