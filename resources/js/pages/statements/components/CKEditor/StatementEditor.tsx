import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
	BalloonEditor,
	AccessibilityHelp,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockQuote,
	BlockToolbar,
	Bold,
	Essentials,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	ListProperties,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SelectAll,
	SimpleUploadAdapter,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Style,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextPartLanguage,
	TextTransformation,
	TodoList,
	Underline,
	Undo,
    EditorConfig,
	Mention,
	Dialog,
	CloudServices
} from 'ckeditor5';
import CustomPlugin from './plugin/TemplatingPlugin';
// import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import './styles.css';
import {
	CaseChange,
	DocumentOutline,
	ExportPdf,
	ExportWord,
	FormatPainter,
	ImportWord,
	// MergeFields,
	MultiLevelList,
	PasteFromOfficeEnhanced,
	TableOfContents,
	// Template
} from 'ckeditor5-premium-features';
import { useList } from '@refinedev/core';
import { ITag } from '@/interfaces';
import { Button, Form } from 'antd';
import FormulaPlugin from './plugin/formulaEditor/formulaEditor';
import FormulaBuilder from '@/components/formulaBuilder/formulaBuilder';
import { InputFields } from '@/components/templateAutocomplete/inputFields';
import PlaceHoldersInput from '@/components/placeholdersInputs/placeholdersInputs';

// import './App.css';

type ItemType = {
	tag_id: number;
	id: string;
	label: string
}

export const StatementEditor = ({content, setContent}) =>{
	const [formula, setFormula] = useState<string>('');
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const [ tags, setTags ] = useState<ItemType[]>([]);
	const { data, isLoading } = useList<ITag>({
		resource: 'tags'
	})
	const [editorInstance, setEditorInstance] = useState<BalloonEditor>();
	// const [ content, setContent] = useState('<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n')
	const editorData = {
		textEditor: content,
	  };
	// useEffect(() => {
	// 	setIsLayoutReady(true);

	// 	return () => setIsLayoutReady(false);
	// }, []);
    const { VITE_CKEDITOR_KEY} = import.meta.env;
	// console.log( import.meta.env, 'key')

	useEffect(() => {
        if(isLoading) return;
		setIsLayoutReady(true);
		// console.log('Loading', data);

        setTags(data?.data.map(i => { return {tag_id: i.id, id: i.label, label: i.label}}) || []);
    }, [isLoading]);

	const getFeed = ( qt ) => {
		const markers = [
			{id: 'tag\d', name: 'Tag - Debit'},
			{id: 'tag\c', name: 'Tag - Credit'},
			{id: 'tag\b', name: 'Tag - Balance'},
			{id: 'tag\n', name: 'Tag - Name'},
			{id: 'acc\d', name: 'Account - Debit'},
			{id: 'acc\c', name: 'Account - Credit'},
			{id: 'acc\b', name: 'Account - Balance'},
			{id: 'acc\n', name: 'Account - Name'},
		];
		// const markers = ['tag\d','tag\c','tag\b','tag\n','@acc\d','@acc\c','@acc\b','@acc\n',]
		console.log('Getting', tags, data, qt);
			const items = markers?.filter( item => item.name.toLowerCase().startsWith( qt.toLowerCase() ) );
			console.log('got',items, markers ,data, qt);
			return items;
	}
	const getFeedItems = ( queryText ) => {
		// As an example of an asynchronous action, return a promise
		// that resolves after a 100ms timeout.
		// This can be a server request or any sort of delayed action.
		return new Promise( resolve => {
			console.log('Getting', tags, data, queryText);
			const items = tags?.filter( item => item.label.toLowerCase().includes( queryText.toLowerCase() ) );
			console.log('got',items, tags ,data, queryText);

			resolve(items);
			// setTimeout( () => {
			// 	const itemsToDisplay = items
			// 		// Filter out the full list of all items to only those matching the query text.
			// 		.filter( isItemMatching )
			// 		// Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
			// 		.slice( 0, 10 );
	
			// 	resolve( itemsToDisplay );
			// }, 100 );
		} );
	}

	const submitHandler = (values) => {
		// e.preventDefault();
		console.log(editorData, values, 'data');
	}
	
	const editorConfig: EditorConfig = {
		licenseKey: VITE_CKEDITOR_KEY,
		toolbar: {
			items: [
				'insertFormula',
				'tags', 'accounts', 'transactions',
				// 'insertTemplate',
				// 'insertMergeField',
				'undo',
				'redo',
				'|',
				'exportPdf',
				'|',
				'findAndReplace',
				'selectAll',
				'textPartLanguage',
				'|',
				'heading',
				'style',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'subscript',
				'superscript',
				'removeFormat',
				'|',
				'specialCharacters',
				'horizontalLine',
				'link',
				'insertImage',
				'mediaEmbed',
				'insertTable',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'bulletedList',
				'numberedList',
				'todoList',
				'outdent',
				'indent',
				'|',
				'accessibilityHelp'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			FormulaPlugin,
			CloudServices,
			AccessibilityHelp,
			// MergeFields,
			// Template,
			Alignment,
			Autoformat,
			AutoImage,
			AutoLink,
			Autosave,
			BalloonToolbar,
			BlockQuote,
			BlockToolbar,
			Bold,
			Essentials,
			FindAndReplace,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			GeneralHtmlSupport,
			Heading,
			HorizontalLine,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsert,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Indent,
			IndentBlock,
			Italic,
			Link,
			List,
			ListProperties,
			Mention,
			MediaEmbed,
			Paragraph,
			PasteFromOffice,
			RemoveFormat,
			SelectAll,
			SimpleUploadAdapter,
			SpecialCharacters,
			SpecialCharactersArrows,
			SpecialCharactersCurrency,
			SpecialCharactersEssentials,
			SpecialCharactersLatin,
			SpecialCharactersMathematical,
			SpecialCharactersText,
			Strikethrough,
			Style,
			Subscript,
			Superscript,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TextPartLanguage,
			TextTransformation,
			TodoList,
			Underline,
			Undo,
			CustomPlugin,
			ExportPdf

		],
		balloonToolbar: ['tags', 'accounts', 'transactions', 'bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
		blockToolbar: [
			'insertFormula',
			'tags', 'accounts', 'transactions',
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'|',
			'link',
			'insertImage',
			'insertTable',
			'|',
			'bulletedList',
			'numberedList',
			'outdent',
			'indent'
		],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		htmlSupport: {
			allow: [
				{
					name: /^.*$/,
					styles: true,
					attributes: true,
					classes: true
				}
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		initialData:
			content,
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		placeholder: 'Type or paste your content here!',
		style: {
			definitions: [
				{
					name: 'Article category',
					element: 'h3',
					classes: ['category']
				},
				{
					name: 'Title',
					element: 'h2',
					classes: ['document-title']
				},
				{
					name: 'Subtitle',
					element: 'h3',
					classes: ['document-subtitle']
				},
				{
					name: 'Info box',
					element: 'p',
					classes: ['info-box']
				},
				{
					name: 'Side quote',
					element: 'blockquote',
					classes: ['side-quote']
				},
				{
					name: 'Marker',
					element: 'span',
					classes: ['marker']
				},
				{
					name: 'Spoiler',
					element: 'span',
					classes: ['spoiler']
				},
				{
					name: 'Code (dark)',
					element: 'pre',
					classes: ['fancy-code', 'fancy-code-dark']
				},
				{
					name: 'Code (bright)',
					element: 'pre',
					classes: ['fancy-code', 'fancy-code-bright']
				}
			]
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		},
		// mention: {
        //     feeds: [
        //         {
        //             marker: '@tag\d',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@tag\c',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@tag\b',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@tag\n',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@acc\d',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@acc\c',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@acc\b',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         },
		// 		{
        //             marker: '@acc\n',
        //             feed: getFeed as any,
        //             minimumCharacters: 1
        //         }
        //     ]
		// }
        
	};

	// useEffect(()=>{
	// 	console.log('formula',formula);
	// 	console.log('editorState',editor);
	// 	console.log('editorData',editor.getData());

	// 	if (editorRef.current) {
	// 	console.log('editor',editorRef);
	// 	}
	// },[formula])


	useEffect(()=>{
		console.log('editorInstance',editorInstance);
	},[editorInstance])

	const insertTemplateString = (template: string) => {
		const templateData = template
		const viewFragment = editorInstance?.data.processor.toView(templateData)
                const modelFragment = editorInstance?.data.toModel(viewFragment as any)
		editorInstance?.model.change(writer => {
			const insertPosition = editorInstance?.model.document.selection?.getFirstPosition()
			writer.insert(modelFragment as any, insertPosition as any)
		})
	}
	const handleTagsSelect = (value) => {
		insertTemplateString(`{{T|${value}}}`);
    };

	const handleAccountsSelect = (value) => {
		insertTemplateString(`{{A|${value}}}`);
    };

	const handleTransactionsSelect = (value) => {
		insertTemplateString(`{{TR|${value}}}`);
    };

	const handleFormulasSelect = (value) => {
		insertTemplateString(`{{F|${value}}}`);
    };



	return (
		// <Form
		// 	onFinish={submitHandler}
		// >
		// 	<Form.Item>
			<div className="main-container">
				<PlaceHoldersInput 
					handleTagsSelect={handleTagsSelect} 
					handleAccountsSelect={handleAccountsSelect} 
					handleTransactionSelect={handleTransactionsSelect} 
					handleFormulaSelect={handleFormulasSelect} 
					includeFormula={true}
				/>
				<div
					className="editor-container editor-container_balloon-editor editor-container_include-style editor-container_include-block-toolbar"
					ref={editorContainerRef}
				>
					<div className="editor-container__editor">
						<div 
							ref={editorRef}>
								{isLayoutReady && 
									<CKEditor 
										editor={BalloonEditor}
										config={editorConfig}
										onReady={(editor) => {
											setEditorInstance(editor);
										}}
										// onReady={( editor ) => {
										// 	// A function executed when the editor has been initialized and is ready.
										// 	// It synchronizes the initial data state and saves the reference to the editor instance.
										// 	// CKEditor&nbsp;5 inspector allows you to take a peek into the editor's model and view
										// 	// data layers. Use it to debug the application and learn more about the editor.
										// 	CKEditorInspector.attach( editor );}}
										onChange={(e, editor) => {
											setContent(editor.getData());
											// console.log(editor.getData(), 'data');
										}}
										 />}</div>
					</div>
				</div>
			</div>
	// 		</Form.Item>
	// 		<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
    //   <Button type="primary" htmlType="submit">
    //     Submit
    //   </Button>
    // </Form.Item>
	// 	</Form>
	);
}
