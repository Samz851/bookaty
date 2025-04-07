import { Request } from "@/helpers/httpHelper";
import { IAccount, IAccountsBranch, ITransaction } from "@/interfaces";
import { useSelect } from "@refinedev/antd";
import { useApiUrl } from "@refinedev/core";
import { axiosInstance } from "@refinedev/simple-rest";
import { AutoComplete, Input, Mentions, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MentionsOptionProps, MentionsRef, OptionProps } from 'antd/es/mentions';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

 const { TextArea } = Input;


const FormulaInput = ({formula, setFormula}) => {
    // Options for different autocompletes
    const textAreaRef = useRef<MentionsRef>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // const [ trigger, setTrigger ] = useState('');

    const [searchResults, setSearchResults] = useState<any[]>([]);
    const apiUrl = useApiUrl('laravel');
    const getData = async () => {
      if ( searchTerm.length > 1 ) {
        let url = `${apiUrl}/accounts/search`;
        let res = await Request('GET', url, null, {params:{code: searchTerm}});
        if ( res.data.success ) {
          setSearchResults([...res.data.result]);
        }
      }
    }

    const {selectProps: accountSelectProps} = useSelect<IAccount>({
        resource: "accounts",
        optionLabel: "code" as any,
        optionValue: "code" as any,
        filters: [{
            field: "type",
            operator: "eq",
            value: "account",
        }]
    })

    const {selectProps: branchesSelectProps} = useSelect<IAccountsBranch>({
        resource: "accounts",
        optionLabel: "code" as any,
        optionValue: "code" as any,
        filters: [{
            field: "type",
            operator: "eq",
            value: "branch",
        }]
    })

    const {selectProps: transactionSelectProps} = useSelect<ITransaction>({
        resource: "transactions",
        optionLabel: "name" as any,
        optionValue: "name" as any
    })




    const formulaOptions = [
        { label: 'ABS', value: 'ABS' },
        { label: 'ACOS', value: 'ACOS' },
        { label: 'ACOSH', value: 'ACOSH' },
        { label: 'ASIN', value: 'ASIN' },
        { label: 'ASINH', value: 'ASINH' },
        { label: 'ATAN', value: 'ATAN' },
        { label: 'ATAN2', value: 'ATAN2' },
        { label: 'ATANH', value: 'ATANH' },
        { label: 'CEILING', value: 'CEILING' },
        { label: 'COMBIN', value: 'COMBIN' },
        { label: 'COS', value: 'COS' },
        { label: 'COSH', value: 'COSH' },
        { label: 'DEGREES', value: 'DEGREES' },
        { label: 'EVEN', value: 'EVEN' },
        { label: 'EXP', value: 'EXP' },
        { label: 'FACT', value: 'FACT' },
        { label: 'FACTDOUBLE', value: 'FACTDOUBLE' },
        { label: 'FLOOR', value: 'FLOOR' },
        { label: 'GCD', value: 'GCD' },
        { label: 'INT', value: 'INT' },
        { label: 'LCM', value: 'LCM' },
        { label: 'LN', value: 'LN' },
        { label: 'LOG', value: 'LOG' },
        { label: 'LOG10', value: 'LOG10' },
        { label: 'MDETERM', value: 'MDETERM' },
        { label: 'MINVERSE', value: 'MINVERSE' },
        { label: 'MMULT', value: 'MMULT' },
        { label: 'MOD', value: 'MOD' },
        { label: 'ODD', value: 'ODD' },
        { label: 'PI', value: 'PI' },
        { label: 'POWER', value: 'POWER' },
        { label: 'PRODUCT', value: 'PRODUCT' },
        { label: 'QUOTIENT', value: 'QUOTIENT' },
        { label: 'RADIANS', value: 'RADIANS' },
        { label: 'RAND', value: 'RAND' },
        { label: 'RANDBETWEEN', value: 'RANDBETWEEN' },
        { label: 'ROMAN', value: 'ROMAN' },
        { label: 'ROUND', value: 'ROUND' },
        { label: 'ROUNDDOWN', value: 'ROUNDDOWN' },
        { label: 'ROUNDUP', value: 'ROUNDUP' },
        { label: 'SERIESSUM', value: 'SERIESSUM' },
        { label: 'SIGN', value: 'SIGN' },
        { label: 'SIN', value: 'SIN' },
        { label: 'SINH', value: 'SINH' },
        { label: 'SQRT', value: 'SQRT' },
        { label: 'SQRTPI', value: 'SQRTPI' },
        { label: 'SUBTOTAL', value: 'SUBTOTAL' },
        { label: 'SUM', value: 'SUM' },
        { label: 'SUMIF', value: 'SUMIF' },
        { label: 'SUMPRODUCT', value: 'SUMPRODUCT' },
        { label: 'SUMSQ', value: 'SUMSQ' },
        { label: 'TAN', value: 'TAN' },
        { label: 'TANH', value: 'TANH' },
        { label: 'TRUNC', value: 'TRUNC' }
    ];

    const [mentions, setMentions] = useState<any>({
        '@': formulaOptions.map(item => (`${item.value}()`)),
        '{{': []
    });


    const handleSearch = (value) => {
        if ( value === '@') {
            setMentions([...formulaOptions.map(item => ({key: `${item.value}()`, label: item.label}))]);
        } else if ( value === '{{') {
            setMentions([...branchesSelectProps?.options?.map(item => ({key: item.value, label: item.label})) || []]);
        }
        // console.log(`search value: ${value}`);
        // setFormula(value);
        
    }
    useEffect(()=>{
        if ( accountSelectProps.options?.length && branchesSelectProps.options?.length ) {
            setMentions({...mentions,
                '{{': [
                    ...accountSelectProps.options.map(item => (item.value)) || [],
                    ...branchesSelectProps?.options?.map(item => (item.value)) || []
                ]
            })
        }
        // console.log(mentions);
    },[accountSelectProps.options, branchesSelectProps.options])

    // useEffect(()=>{
    //     console.log(accountSelectProps, mentions);
    // },[])

    const handleSelect = (value, option) => {
        // let newFormula = '';

        // if ( prefix === '{{' ) {
        //     console.log('formula',formula);
        //     if ( formula.endsWith(')') ) {
        //         newFormula = `${formula.slice(0, formula.length - 1)}${option.key}}}${formula.slice(formula.length-1)}`;
        //     }
        //     else {
        //         newFormula = `${formula}${option.key}}}`;
        //     }
        // }
        // else {
        //     newFormula = `${formula.replace('@','')}${option.key}`;
        // }
        // // console.log(option, formula, newFormula,textAreaRef.current?.textarea?.textLength,textAreaRef.current?.textarea?.selectionStart, textAreaRef.current?.textarea?.selectionEnd);
        // setFormula(newFormula);
        // // if ( prefix === '@' )
        // // {
        // //     console.log(formula,textAreaRef.current?.textarea?.textContent,textAreaRef.current?.textarea?.textLength,textAreaRef.current?.textarea?.selectionStart, textAreaRef.current?.textarea?.selectionEnd);
        // //     if ( textAreaRef.current?.textarea?.selectionEnd ) {
        // //         textAreaRef.current.textarea.value = newFormula;
        // //         textAreaRef.current.textarea.selectionStart = textAreaRef.current.textarea.textLength - 1;
        // //         textAreaRef.current.textarea.selectionEnd = newFormula.length - 1;
        // //         console.log(textAreaRef.current);

        // //     }
        // // }
        const newFormula = `${formula.replace('@','')}${option.key}`;
        setFormula(newFormula);
        console.log(`selectvalue: ${value}, formula: ${newFormula},option:`,option);
    }

    
    const handleChange = (value) => {

        // console.log('change',trigger,value, formula,textAreaRef.current);
        // setFormula(value);
        console.log(`change value: ${value}`);
        setFormula(value);
    }

    const handleChangeOnSelect = (trigger, slug) => {
        console.log(trigger, slug);
        return trigger === '@' ? slug : `{{${slug}}}`;
    }

    // useEffect(()=>{

    //     setTimeout(()=>{
    //         console.log('timeout', formula,textAreaRef.current);
    //     }, 3000)
    // },[formula])

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                
                <TextInput 
                    // Component={TextArea}
                    value={formula}
                    spacer={''}
                    trigger={['@','{{']} 
                    maxOptions={0}
                    options={mentions} 
                    changeOnSelect={handleChangeOnSelect}
                    onSelect={(value) => { 
                        console.log(value);
                        console.log(accountSelectProps, mentions);
                    }}
                    onChange={handleChange}
                />
            </Space>
        </div>
    );
};

export default FormulaInput;
