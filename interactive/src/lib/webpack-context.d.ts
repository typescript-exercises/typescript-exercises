interface WebpackContext {
    (filename: string): {default: string};
    keys(): string[];
}

declare interface NodeRequire {
    context: (filename: string, deep: boolean, mask: RegExp) => WebpackContext;
}
