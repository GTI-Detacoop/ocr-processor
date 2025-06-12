export interface OCRConfig {
  language: string;
  dpi?: number;
  enhanceImage?: boolean;
  confidenceThreshold?: number;
  timeout?: number;
  retryAttempts?: number;
  customParams?: Record<string, any>;
}
