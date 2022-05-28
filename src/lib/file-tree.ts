export interface FileTree {
    [filename: string]: {
        content: string;
        readOnly?: boolean;
        solution?: string;
    };
}
