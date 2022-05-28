export interface ValidationError {
    file: string | null;
    start: number;
    length: number;
    messageText: string;
}
