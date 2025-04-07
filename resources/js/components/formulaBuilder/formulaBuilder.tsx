import { Request } from "@/helpers/httpHelper";
import { IAccount, IAccountsBranch, ITag, ITransaction } from "@/interfaces";
import { useSelect, useTable } from "@refinedev/antd";
import { useApiUrl } from "@refinedev/core";
import { axiosInstance } from "@refinedev/simple-rest";
import { AutoComplete, Input, Mentions, Select, Space, TreeSelect } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MentionsOptionProps, MentionsRef, OptionProps } from 'antd/es/mentions';
import type { GetProp, TreeSelectProps } from 'antd';
import { TextAreaRef } from "antd/es/input/TextArea";
import { debounce } from "lodash";
import PlaceHoldersInput from '@/components/placeholdersInputs/placeholdersInputs';


type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number];

const FORMULA_FUNCTIONS = [
    'ABS', 'ACOS', 'ACOSH', 'ASIN', 'ASINH', 'ATAN', 'ATAN2', 'ATANH', 'CEILING', 'COMBIN',
    'COS', 'COSH', 'DEGREES', 'EVEN', 'EXP', 'FACT', 'FACTDOUBLE', 'FLOOR', 'GCD', 'INT',
    'LCM', 'LN', 'LOG', 'LOG10', 'MDETERM', 'MINVERSE', 'MMULT', 'MOD', 'ODD', 'PI',
    'POWER', 'PRODUCT', 'QUOTIENT', 'RADIANS', 'RAND', 'RANDBETWEEN', 'ROMAN', 'ROUND',
    'ROUNDDOWN', 'ROUNDUP', 'SERIESSUM', 'SIGN', 'SIN', 'SINH', 'SQRT', 'SQRTPI', 'SUBTOTAL',
    'SUM', 'SUMIF', 'SUMPRODUCT', 'SUMSQ', 'TAN', 'TANH', 'TRUNC'
];

const isValidFunction = (name: string): boolean => {
    return FORMULA_FUNCTIONS.includes(name.toUpperCase());
};

const isBalancedParentheses = (formula: string): boolean => {
    let count = 0;
    for (let char of formula) {
        if (char === '(') count++;
        if (char === ')') count--;
        if (count < 0) return false;
    }
    return count === 0;
};

const isValidPlaceholder = (placeholder: string): boolean => {
    const pattern = /{{(A|T|TR)\|[^}]+}}/;
    return pattern.test(placeholder);
};

interface FormulaBuilderProps {
    formula: string;
    setFormula: (value: string) => void;
    errors: string[];
    setErrors: (errors: string[]) => void;
}

const FormulaBuilder = ({ formula, setFormula, errors, setErrors }: FormulaBuilderProps) => {

    const textAreaRef = useRef<TextAreaRef>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const apiUrl = useApiUrl('laravel');
    const getData = async () => {
      if ( searchTerm.length > 1 ) {
        let url = `${apiUrl}/accounts/search`;
        let res = await Request('GET', url, null, {params:{code: searchTerm}});
        if ( res.data.success ) {
            const newTreeData = formatAccountTreeData(res.data.result)
            // console.log('new result', newTreeData)
          setAccountTreeData([...newTreeData]);
        }
      }
    }

    const { tableProps: accountTableProps, filters, setFilters } = useTable<IAccount>({
        resource: "accounts",
        filters: {
            initial: [{
                field: "type",
                operator: "eq",
                value: "all",
            }]
        },
        sorters: {
            mode: "off",
        },
        syncWithLocation: false,
        pagination: {
            mode: "off"
          },
    });

    const {selectProps: tagsSelectProps} = useSelect<ITag>({
        resource: "tags",
        optionLabel: "label" as any,
        optionValue: "label" as any
    })

    const {selectProps: transactionsSelectProps} = useSelect<ITransaction>({
        resource: "transactions",
        optionLabel: "code" as any,
        optionValue: "code" as any,
        searchField: "code" as any,
        onSearch: (value) => [
            {
              field: "code",
              operator: "startswith",
              value,
            },
          ],
        
    })

    const formatAccountTreeData = (data: IAccount[]) => {
        return data?.map(account => {
            // console.log('account', account)
            return {
            title: account.code,
            value: account.code,
            key: account.code,
            isLeaf: account.has_children === true ? false : true,
            pId: account.parent_id ? account.parent_id : 0,
            id: account.id
        }
        }
    ) ?? [];
    }

    const [accountTreeData, setAccountTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
    
    const [ selectedAccount, setSelectedAccount ] = useState<DefaultOptionType | null>(null);

    

    useEffect(()=>{
        // console.log('tree data', accountTableProps.dataSource)
        if ( ! accountTableProps.loading) {
            const newAccountData = formatAccountTreeData(accountTableProps.dataSource as any)
            // console.log('new account data', newAccountData)
            setAccountTreeData([...accountTreeData, ...newAccountData]);

        }
    },[accountTableProps.dataSource])


    const onLoadData: TreeSelectProps['loadData'] = (record) => {
        const account = accountTreeData.find(account => account.id === record.id);

        // console.log('record',record, account);
        setSelectedAccount(record);
        if (account && ! account.isLeaf) {
            setFilters([
                {
                    field: 'type',
                    operator: 'eq',
                    value: 'all',
                },
                {
                    field: 'parent',
                    operator: 'eq',
                    value: record.id,
                }
            ], 'replace');
        }


        return new Promise((resolve) => {
            setTimeout(()=>{
                resolve(undefined);
            }, 300)
        });
        
    };
    useEffect(()=>{
        // console.log(searchTerm);
        // console.log('accountTreeData',accountTreeData);
        getData()
    }, [searchTerm])

    const handleSearch = debounce((searchValue: string) => {

        const filteredData = accountTreeData.filter(item => 
            (item.title as string).toLowerCase().startsWith(searchValue.toLowerCase())
        );
        // console.log('filteredData',filteredData);
        // If no results found in existing data, trigger API search
        if (filteredData.length === 0) {
            setSearchTerm(searchValue);
        }
    }, 300);

    const handleTagsSelect = (value) => {
        const cursorPosition = textAreaRef.current?.resizableTextArea?.textArea.selectionStart || 0;
        const newFormula = formula.substring(0, cursorPosition) + 
                          `{{T|${value}}}` + 
                          formula.substring(cursorPosition);
        setFormula(newFormula);
        textAreaRef.current?.focus({
            cursor: 'end',
        });
    };

    const handleTransactionSelect = (value) => {
        const cursorPosition = textAreaRef.current?.resizableTextArea?.textArea.selectionStart || 0;
        const newFormula = formula.substring(0, cursorPosition) + 
                          `{{TR|${value}}}` + 
                          formula.substring(cursorPosition);
        setFormula(newFormula);
        textAreaRef.current?.focus({
            cursor: 'end',
        });
    };

    const handleAccountsSelect = (value) => {
        const cursorPosition = textAreaRef.current?.resizableTextArea?.textArea.selectionStart || 0;
        const newFormula = formula.substring(0, cursorPosition) + 
                          `{{A|${value}}}` + 
                          formula.substring(cursorPosition);
        setFormula(newFormula);
        // setFilters([
        //     {
        //         field: 'type',
        //         operator: 'eq',
        //         value: 'all',
        //     }
        // ], 'replace');
        textAreaRef.current?.focus({
            cursor: 'end',
        });
    };

    const validateFormula = (value: string) => {
        const newErrors: string[] = [];
        
        // Extract function calls
        const functionPattern = /(\w+)\s*\(/g;
        let match;
        while ((match = functionPattern.exec(value)) !== null) {
            const funcName = match[1];
            if (!isValidFunction(funcName)) {
                newErrors.push(`Invalid function: ${funcName}`);
            }
        }

        // Check parentheses
        if (!isBalancedParentheses(value)) {
            newErrors.push('Unbalanced parentheses');
        }

        // Check placeholders
        const placeholderPattern = /{{[^}]+}}/g;
        const placeholders = value.match(placeholderPattern) || [];
        placeholders.forEach(placeholder => {
            if (!isValidPlaceholder(placeholder)) {
                newErrors.push(`Invalid placeholder: ${placeholder}`);
            }
        });

        // Check argument separation
        const argumentPattern = /\([^)]+\)/g;
        const matchedArguments = value.match(argumentPattern) || [];
        matchedArguments.forEach(args => {
            const trimmed = args.slice(1, -1).trim();
            if (trimmed.length > 0) {
                const parts = trimmed.split(',');
                parts.forEach(part => {
                    const trimmedPart = part.trim();
                    if (trimmedPart.length === 0) {
                        newErrors.push('Empty argument in function call');
                    }
                });
            }
        });

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleFormulaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormula(value);
        validateFormula(value);
        
        // Get cursor position and calculate dropdown position
        const textarea = textAreaRef.current?.resizableTextArea?.textArea;
        if (textarea) {
            const cursorPosition = textarea.selectionStart;
            const { top, left } = getCursorXY(textarea, cursorPosition);
            setDropdownPosition({ top, left });
        }

        // Get the current word being typed
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPosition);
        const words = textBeforeCursor.split(/\s/);
        const currentWord = words[words.length - 1];

        // Show suggestions if "$f" is typed or if a letter matches function names
        if (currentWord === "$f") {
            setSuggestions(FORMULA_FUNCTIONS);
            setShowSuggestions(true);
        } else if (currentWord.length > 0) {
            const matched = FORMULA_FUNCTIONS.filter(fn => 
                fn.toLowerCase().startsWith(currentWord.toLowerCase())
            );
            setSuggestions(matched);
            setShowSuggestions(matched.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    // Helper function to get cursor coordinates
    const getCursorXY = (input: HTMLTextAreaElement, selectionPoint: number) => {
        const { offsetLeft: inputX, offsetTop: inputY } = input;
        
        // Create a dummy element to measure the text
        const div = document.createElement('div');
        const styles = getComputedStyle(input);
        
        // Copy textarea styles to div
        div.style.position = 'absolute';
        div.style.top = '0';
        div.style.left = '0';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';
        div.style.font = styles.font;
        div.style.padding = styles.padding;
        div.style.width = styles.width;
        
        // Get text before cursor
        const textContent = input.value.substring(0, selectionPoint);
        div.textContent = textContent;
        
        // Create a span for the last character
        const span = document.createElement('span');
        span.textContent = input.value.substring(selectionPoint - 1, selectionPoint);
        div.appendChild(span);
        
        document.body.appendChild(div);
        const { offsetLeft: spanX, offsetTop: spanY } = span;
        document.body.removeChild(div);
        
        return {
            top: inputY + spanY + parseInt(styles.lineHeight),
            left: inputX + spanX
        };
    };

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <PlaceHoldersInput
                    handleTransactionSelect={handleTransactionSelect}
                    handleTagsSelect={handleTagsSelect}
                    handleAccountsSelect={handleAccountsSelect}
                />
                <div style={{ position: 'relative' }}>
                    <Input.TextArea
                        rows={4}
                        value={formula}
                        onChange={handleFormulaChange}
                        placeholder="Type $f for functions or start typing a function name"
                        ref={textAreaRef}
                        status={errors.length > 0 ? 'error' : ''}
                    />
                    {errors.length > 0 && (
                        <div style={{ 
                            color: '#ff4d4f',
                            fontSize: '12px',
                            marginTop: '4px'
                        }}>
                            {errors.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </div>
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            minWidth: '150px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}>
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        backgroundColor: hoveredIndex === index ? '#f5f5f5' : 'transparent'
                                    }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => {
                                        // Get cursor position and text before cursor
                                        const cursorPosition = textAreaRef.current?.resizableTextArea?.textArea.selectionStart || 0;
                                        const textBeforeCursor = formula.substring(0, cursorPosition);
                                        const words = textBeforeCursor.split(/\s/);
                                        const currentWord = words[words.length - 1];
                                        
                                        // Replace the current word with the selected function
                                        const newFormula = formula.substring(0, cursorPosition - currentWord.length) + 
                                                         suggestion + "()" + 
                                                         formula.substring(cursorPosition);
                                        
                                        setFormula(newFormula);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Space>
        </div>
    );
};

export default FormulaBuilder;
