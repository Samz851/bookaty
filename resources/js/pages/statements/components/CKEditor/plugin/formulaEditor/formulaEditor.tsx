// import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// import { Editor } from '@ckeditor/ckeditor5-core';
import { Plugin, ButtonView, View } from 'ckeditor5'
import React from 'react';
import FormulaDialog from './formulaDialog';
import ReactDOM from 'react-dom';

import { createRoot } from 'react-dom/client';


export default class FormulaPlugin extends Plugin {
    private container: HTMLElement | null = null;

    constructor(editor) {
        super(editor);
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
    }

    // public static get pluginName(): string {
    //     return 'FormulaPlugin';
    // }

    public init(): void {
        const predefinedVariables: string[] = ['x', 'y', 'z']; // Define allowed variables

        const editor = this.editor;
        const dialog = this.editor.plugins.get( 'Dialog' );

        // Add the formula button to the toolbar
        editor.ui.componentFactory.add('insertFormula', locale => {
            const button = new ButtonView(locale);

            button.set({
                label: 'Insert Formula',
                tooltip: true,
                withText: true
            });

            // Open formula input dialog on click
            button.on('execute', () => {
                // const dialog = this.editor.plugins.get( 'Dialog' );
                // if ( button.isOn ) {
                //     dialog.hide();
                //     button.isOn = false;
        
                //     return;
                // }

                // button.isOn = true;
                // const textView = new View( locale );

                // textView.setTemplate( {
                //     tag: 'div',
                //     attributes: {
                //         style: {
                //             padding: 'var(--ck-spacing-large)',
                //             whiteSpace: 'initial',
                //             width: '100%',
                //             maxWidth: '500px'
                //         },
                //         tabindex: -1
                //     },
                //     children: [
                //         'This is a sample content of the modal.',
                //         'You can put here text, images, inputs, buttons, etc.'
                //     ]
                // } );

                // // Tell the plugin to display a modal with the title, content, and one action button.
                // dialog.show( {
                //     isModal: true,
                //     id: 'tags',
                //     title: 'Modal with text',
                //     content: textView,
                //     actionButtons: [
                //         {
                //             label: 'OK',
                //             class: 'ck-button-action',
                //             withText: true,
                //             onExecute: () => dialog.hide()
                //         }
                //     ],
                //     onHide() { button.isOn = false; }
                // } );

                this.openFormulaDialog();
            });

            return button;
        });
    }
    // _createTagsModal(): HTMLElement {
    //     const container = document.createElement('div');
    //     const table = document.createElement('table');
    //     // Implement your table logic here

    //     const select = document.createElement('select');
    //     const option1 = document.createElement('option');
    //     option1.value = 'tag1';
    //     option1.text = 'Tag 1';

    //     const option2 = document.createElement('option');
    //     option2.value = 'tag2';
    //     option2.text = 'Tag 2';

    
    //     select.add(option1);
    //     select.add(option2);

    //     table.appendChild(select);
    //     container.appendChild(table);

    //     return container;
    // }
    // _createReactComponent(): HTMLElement {
    //     const container = document.createElement('div');
    //     // Assuming you have a React component you want to render
    //     const root = createRoot(container);
    //     const reactElement = React.createElement(FormulaDialog);
    //     root.render(reactElement);

    //     return container;
    // }

    openFormulaDialog(): void {
        const predefinedVariables: string[] = ['x', 'y', 'z']; // Define allowed variables
        const closeDialog = () => {
            // if (this.container) ReactDOM.unmountComponentAtNode(this.container);
        };
        const handleSubmit = (formula: string) => {
            // closeDialog();
            this.editor.model.change(writer => {
                const formulaText = writer.createText(`ƒƒ${formula}ƒƒ`);
                const formulaElement = writer.createElement('span', { class: 'formula' });
                writer.append(formulaText, formulaElement);
                this.editor.model.insertContent(formulaElement, this.editor.model.document.selection);
            });
        };
        if (this.container) {
            const container = document.createElement('div');
            const root = createRoot(container);
            const reactElement = React.createElement(FormulaDialog, {predefinedVariables, onSubmit: handleSubmit});
            root.render(reactElement);
            // ReactDOM.render(
            //     <FormulaDialog
            //         // visible={true}
            //         predefinedVariables={predefinedVariables}
            //         onSubmit={handleSubmit}
            //         // onCancel={closeDialog}
            //     />,
            //     this.container
            // );
        }
        
        // const dialog = this.editor.plugins.get( 'Dialog' );
        // dialog.show( {
        //     isModal: true,
        //     id: 'tags',
        //     title: 'Modal with text',
        //     content: this._createReactComponent(),
        // } );
    }
    // destroy(): void {
    //     super.destroy();
    //     if (this.container) {
    //         ReactDOM.unmountComponentAtNode(this.container);
    //         document.body.removeChild(this.container);
    //     }
    // }

    // openFormulaDialog(): void {

    //     const textView = new View( locale );

    //             textView.setTemplate( {
    //                 tag: 'div',
    //                 attributes: {
    //                     style: {
    //                         padding: 'var(--ck-spacing-large)',
    //                         whiteSpace: 'initial',
    //                         width: '100%',
    //                         maxWidth: '500px'
    //                     },
    //                     tabindex: -1
    //                 },
    //                 children: [
    //                     'This is a sample content of the modal.',
    //                     'You can put here text, images, inputs, buttons, etc.'
    //                 ]
    //             } );

    //             // Tell the plugin to display a modal with the title, content, and one action button.
    //             dialog.show( {
    //                 isModal: true,
    //                 id: 'tags',
    //                 title: 'Modal with text',
    //                 content: textView,
    //                 actionButtons: [
    //                     {
    //                         label: 'OK',
    //                         class: 'ck-button-action',
    //                         withText: true,
    //                         onExecute: () => dialog.hide()
    //                     }
    //                 ],
    //                 onHide() { buttonView.isOn = false; }
    //             } );
    //     const editor = this.editor;

    //     const predefinedVariables: string[] = ['x', 'y', 'z']; // Define allowed variables

    //     const formula = prompt(
    //         'Enter your formula using predefined variables like {x}, {y}, {z}.\nExample: SUM({x}, {y})'
    //     );

    //     if (formula) {
    //         const isValid = predefinedVariables.every(variable =>
    //             formula.includes(`{${variable}}`) || !formula.includes('{')
    //         );

    //         if (!isValid) {
    //             alert('Invalid formula! Use only predefined variables like {x}, {y}, {z}.');
    //             return;
    //         }

    //         editor.model.change(writer => {
    //             const formulaText = writer.createText(`Formula: ${formula}`);
    //             const formulaElement = writer.createElement('span', { class: 'formula' });
    //             writer.append(formulaText, formulaElement);
    //             editor.model.insertContent(formulaElement, editor.model.document.selection);
    //         });
    //     }
    // }
}
