export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
}

class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`ℹ️ ${message}`);
  }

  warn(message: string): void {
    console.warn(`⚠️ ${message}`);
  }

  error(message: string): void {
    console.error(`❌ ${message}`);
  }

  success(message: string): void {
    console.log(`✅ ${message}`);
  }
}

export const logger = new ConsoleLogger();
