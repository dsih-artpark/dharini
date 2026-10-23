import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandlingService {
  private errorMessages: { [key: string]: { [code: string]: string } } = {};

  registerModuleMessages(module: string, messages: { [code: string]: string }) {
    this.errorMessages[module] = messages;
  }

  getMessage(module: string, code: string): string {
    return this.errorMessages[module]?.[code] || 'An unexpected error occurred';
  }
}
