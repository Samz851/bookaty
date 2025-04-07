declare module '@webscopeio/react-textarea-autocomplete' {
    import { ComponentType } from 'react';
    
    interface Props {
        loadingComponent: ComponentType;
        value: string;
        onChange: (e: { target: { value: string } }) => void;
        trigger: Record<string, {
            dataProvider: () => any[];
            component: ComponentType<{ entity: any }>;
            output: (item: any) => string;
        }>;
        style?: React.CSSProperties;
    }

    const ReactTextareaAutocomplete: ComponentType<Props>;
    export default ReactTextareaAutocomplete;
} 