import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import FormulaBuilder from '@/components/formulaBuilder/formulaBuilder';

interface FormulaDialogProps {
    visible?: boolean;
    predefinedVariables: string[];
    onSubmit: (formula: string) => void;
    onCancel?: () => void;
}

const FormulaDialog: React.FC<FormulaDialogProps> = ({predefinedVariables, onSubmit}) => {
    const [formula, setFormula] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(true);

    const handleOk = () => {
        // Basic validation: check if formula contains only allowed variables
        // const isValid = predefinedVariables.every(variable =>
        //     formula.includes(`{${variable}}`) || !formula.includes('{')
        // );

        // if (!isValid) {
        //     alert('Invalid formula! Use only predefined variables like {x}, {y}, {z}.');
        //     return;
        // }

        onSubmit(formula);
    };

    return (
        <Modal
            title="Insert Formula"
            destroyOnClose={true}
            open={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}
            okText="Insert"
            cancelText="Cancel"
        >
            {/* <p>Enter your formula using predefined variables like {predefinedVariables.map(v => `{${v}}`).join(', ')}.</p>
            <Input.TextArea
                rows={4}
                value={formula}
                onChange={e => setFormula(e.target.value)}
                placeholder="Example: SUM({x}, {y})"
            /> */}
            <FormulaBuilder formula={formula} setFormula={setFormula} />
        </Modal>
    );
};

export default FormulaDialog;