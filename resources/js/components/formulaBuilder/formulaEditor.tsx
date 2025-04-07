import { useState } from "react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Editor, { OnMount, OnValidate } from "@monaco-editor/react";



const handleOnMount: OnMount= (editor, monaco ) => {
    monaco.languages.register({ id: "formula-language" });

    monaco.languages.setMonarchTokensProvider("formula-language", {
        tokenizer: {
            root: [
                [/[A-Za-z_]\w*/, "identifier"], // Identifies valid field names or variables
                [/[+\-*/=]/, "operator"],       // Recognizes operators
                [/\d+/, "number"],              // Matches numbers
                [/\(/, "delimiter.parenthesis"], // Matches opening parenthesis
                [/\)/, "delimiter.parenthesis"], // Matches closing parenthesis
            ],
        },
    });
    
    // Add autocomplete suggestions for the formula editor
    monaco.languages.registerCompletionItemProvider("formula-language", {
        provideCompletionItems: (): monaco.languages.CompletionList => {
            const suggestions: monaco.languages.CompletionItem[] = [
                {
                    label: "SUM",
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: "SUM()",
                    documentation: "Calculates the sum of a range of numbers.",
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 1,
                        endColumn: 4,
                    }
                },
                {
                    label: "IF",
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: "IF(condition, trueValue, falseValue)",
                    documentation: "Returns a value based on a condition.",
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 1,
                        endColumn: 4,
                    }
                },
                {
                    label: "AccountBalance",
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: "AccountBalance",
                    documentation: "The current balance of the account.",
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 1,
                        endColumn: 4,
                    }
                },
            ];
    
            return { suggestions };
        },
    });

    editor.getModel()?.onDidChangeContent(() => {
        // validateModel(editor.getModel()!, monaco.editor.getModelMarkers({}));
        const value = editor.getModel()?.getValue() || "";
        const errors = monaco.editor.getModelMarkers({});
        
        const openParentheses = (value.match(/\(/g) || []).length;
        const closeParentheses = (value.match(/\)/g) || []).length;
        
    //     if (openParentheses !== closeParentheses) {
    //     errors.push({
    //         severity: monaco.MarkerSeverity.Error,
    //         message: "Unmatched parentheses",
    //         startLineNumber: 1,
    //         startColumn: value.indexOf("(") + 1,
    //         endLineNumber: 1,
    //         endColumn: value.length,
    //     });
    // }

    monaco.editor.setModelMarkers(editor.getModel()!, "formula-language", errors);
    });
}
const validateModel: OnValidate = (markers) => {

    markers.forEach(marker => {
        console.log(marker);
    });
    // const value = model.getValue();
    // const errors = markers;
    
    // const openParentheses = (value.match(/\(/g) || []).length;
    // const closeParentheses = (value.match(/\)/g) || []).length;
    
    // if (openParentheses !== closeParentheses) {
    //     errors.push({
    //         severity: monaco.MarkerSeverity.Error,
    //         message: "Unmatched parentheses",
    //         startLineNumber: 1,
    //         startColumn: value.indexOf("(") + 1,
    //         endLineNumber: 1,
    //         endColumn: value.length,
    //     });
    // }

    // monaco.editor.setModelMarkers(model, "formula-language", errors);
};

const FormulaEditor = ({ initialFormula = "", onSave }) => {
    const [formula, setFormula] = useState(initialFormula);

    const handleEditorChange = (value) => {
        setFormula(value || "");
    };

    const saveFormula = () => {
        onSave(formula);
    };

    return (
        <div>
            <h3>Formula Editor</h3>
            <Editor
                height="200px"
                language="formula-language"
                value={formula}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    lineNumbers: "off",
                    scrollBeyondLastLine: false,
                }}
                onMount={handleOnMount}
                onValidate={validateModel}
            />
            <button onClick={saveFormula}>Save Formula</button>
        </div>
    );
};

export default FormulaEditor;
