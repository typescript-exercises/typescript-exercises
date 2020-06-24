export interface ValidationError {
    file: string;
    start: number;
    length: number;
    messageText: string;
}
