export interface Logger {
    info(tag: string, message: string): void;
    error(tag: string, message: string, error?: Error): void
}

export interface RandomId {
    generateId(): string;
}