import {editor, languages, MarkerSeverity} from 'monaco-editor';
import {DiagnosticMessageChain} from 'typescript';

export function flattenDiagnosticMessageText(
    diag: string | DiagnosticMessageChain | undefined,
    newLine: string,
    indent = 0
): string {
    if (typeof diag === 'string') {
        return diag;
    } else if (diag === undefined) {
        return '';
    }
    let result = '';
    if (indent) {
        result += newLine;

        for (let i = 0; i < indent; i++) {
            result += '  ';
        }
    }
    result += diag.messageText;
    indent++;
    if (diag.next) {
        for (const kid of diag.next) {
            result += flattenDiagnosticMessageText(kid, newLine, indent);
        }
    }
    return result;
}

export async function revalidateModel(model: editor.IModel) {
    if (!model || model.isDisposed()) return;

    const getWorker = await languages.typescript.getTypeScriptWorker();
    const worker = await getWorker(model.uri);
    const diagnostics = (
        await Promise.all([
            worker.getSyntacticDiagnostics(model.uri.toString()),
            worker.getSemanticDiagnostics(model.uri.toString())
        ])
    ).reduce((a, it) => a.concat(it));

    const markers = diagnostics.map((d) => {
        const start = model.getPositionAt(d.start!);
        const end = model.getPositionAt(d.start! + d.length!);
        return {
            severity: MarkerSeverity.Error,
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
            message: flattenDiagnosticMessageText(d.messageText, '\n')
        };
    });
    editor.setModelMarkers(model, 'typescript', markers);
}
