import { Plugin, ButtonView, View } from 'ckeditor5'
// import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// import ModalView from '@ckeditor/ckeditor5-ui/src/modal/modalview';
import ReactComponent from './ReactComponent'; // Your React component
import { Modal } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

export default class CustomPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // Add the "Tags" button
        editor.ui.componentFactory.add('tags', locale => {
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: 'Tags',
                tooltip: true
            });

            buttonView.on('execute', () => {
                const dialog = this.editor.plugins.get( 'Dialog' );
                // If the button is turned on, hide the modal.
                if ( buttonView.isOn ) {
                    dialog.hide();
                    buttonView.isOn = false;

                    return;
                }

                buttonView.isOn = true;

                // Otherwise, show the modal.
                // First, create a view with some simple content. It will be displayed as the dialog's body.
                const textView = new View( locale );

                textView.setTemplate( {
                    tag: 'div',
                    attributes: {
                        style: {
                            padding: 'var(--ck-spacing-large)',
                            whiteSpace: 'initial',
                            width: '100%',
                            maxWidth: '500px'
                        },
                        tabindex: -1
                    },
                    children: [
                        'This is a sample content of the modal.',
                        'You can put here text, images, inputs, buttons, etc.'
                    ]
                } );

                // Tell the plugin to display a modal with the title, content, and one action button.
                dialog.show( {
                    isModal: true,
                    id: 'tags',
                    title: 'Modal with text',
                    content: textView,
                    actionButtons: [
                        {
                            label: 'OK',
                            class: 'ck-button-action',
                            withText: true,
                            onExecute: () => dialog.hide()
                        }
                    ],
                    onHide() { buttonView.isOn = false; }
                } );
            });

            return buttonView;
        });

        // Add the "Accounts" button
        editor.ui.componentFactory.add('accounts', locale => {
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: 'Accounts',
                tooltip: true
            });

            buttonView.on('execute', () => {
                const dialog = this.editor.plugins.get( 'Dialog' );
                // If the button is turned on, hide the modal.
                if ( buttonView.isOn ) {
                    dialog.hide();
                    buttonView.isOn = false;

                    return;
                }

                buttonView.isOn = true;

                // Otherwise, show the modal.
                // First, create a view with some simple content. It will be displayed as the dialog's body.
                const textView = new View( locale );

                textView.setTemplate( {
                    tag: 'div',
                    attributes: {
                        style: {
                            padding: 'var(--ck-spacing-large)',
                            whiteSpace: 'initial',
                            width: '100%',
                            maxWidth: '500px'
                        },
                        tabindex: -1
                    },
                    children: [
                        'This is a sample content of the modal.',
                        'You can put here text, images, inputs, buttons, etc.'
                    ]
                } );

                // Tell the plugin to display a modal with the title, content, and one action button.
                dialog.show( {
                    isModal: true,
                    id: 'accounts',
                    title: 'Modal with text',
                    content: textView,
                    actionButtons: [
                        {
                            label: 'OK',
                            class: 'ck-button-action',
                            withText: true,
                            onExecute: () => dialog.hide()
                        }
                    ],
                    onHide() { buttonView.isOn = false; }
                } );
            });

            return buttonView;
        });

        // Add the "Transactions" button
        editor.ui.componentFactory.add('transactions', locale => {
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: 'Transactions',
                tooltip: true
            });

            buttonView.on('execute', () => {
                const dialog = this.editor.plugins.get( 'Dialog' );
                // If the button is turned on, hide the modal.
                if ( buttonView.isOn ) {
                    dialog.hide();
                    buttonView.isOn = false;

                    return;
                }

                buttonView.isOn = true;

                // Otherwise, show the modal.
                // First, create a view with some simple content. It will be displayed as the dialog's body.
                const textView = new View( locale );

                textView.setTemplate( {
                    tag: 'div',
                    attributes: {
                        style: {
                            padding: 'var(--ck-spacing-large)',
                            whiteSpace: 'initial',
                            width: '100%',
                            maxWidth: '500px'
                        },
                        tabindex: -1
                    },
                    children: [
                        'This is a sample content of the modal.',
                        'You can put here text, images, inputs, buttons, etc.'
                    ]
                } );

                // Tell the plugin to display a modal with the title, content, and one action button.
                dialog.show( {
                    isModal: true,
                    id: 'transactions',
                    title: 'Modal with text',
                    content: textView,
                    actionButtons: [
                        {
                            label: 'OK',
                            class: 'ck-button-action',
                            withText: true,
                            onExecute: () => dialog.hide()
                        }
                    ],
                    onHide() { buttonView.isOn = false; }
                } );
            });

            return buttonView;
        });
    }

    _createTagsModal(): HTMLElement {
        const container = document.createElement('div');
        const table = document.createElement('table');
        // Implement your table logic here

        const select = document.createElement('select');
        const option1 = document.createElement('option');
        option1.value = 'tag1';
        option1.text = 'Tag 1';

        const option2 = document.createElement('option');
        option2.value = 'tag2';
        option2.text = 'Tag 2';

        select.add(option1);
        select.add(option2);

        table.appendChild(select);
        container.appendChild(table);

        return container;
    }

    _createReactComponent(): HTMLElement {
        const container = document.createElement('div');
        // Assuming you have a React component you want to render
        const reactElement = React.createElement(ReactComponent);
        ReactDOM.render(reactElement, container);

        return container;
    }

    _createTransactionsModal(): HTMLElement {
        const container = document.createElement('div');
        const table = document.createElement('table');
        // Implement your table logic here

        const select1 = document.createElement('input');
        select1.type = 'checkbox';
        const label1 = document.createElement('label');
        label1.innerText = 'Transaction 1';

        const select2 = document.createElement('input');
        select2.type = 'checkbox';
        const label2 = document.createElement('label');
        label2.innerText = 'Transaction 2';

        table.appendChild(select1);
        table.appendChild(label1);
        table.appendChild(select2);
        table.appendChild(label2);

        container.appendChild(table);

        return container;
    }
}
