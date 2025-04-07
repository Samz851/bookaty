import { IAccount } from "@/interfaces"
import { useSelect } from "@refinedev/antd"
import { Select } from "antd";
import { useState } from "react"

export const CreateVariable = () => {

    const [ variableName, setVariableName ] = useState('');
    const [ variableDefinitions, setVariableDefinitions ] = useState([]);

    const { selectProps: AccountSelectProps } = useSelect<IAccount>({
        resource: "accounts",
        optionLabel: "code_label" as any,
        optionValue: "id" as any
    })


    return (
        <div>
            <input 
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
                placeholder="Variable Name"
            />
            <div>
                <Select
                size="small"
                filterOption={true}
                options={AccountSelectProps.options}
                />
            </div>
        </div>
    );
}