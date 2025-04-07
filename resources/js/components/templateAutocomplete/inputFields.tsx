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


type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number];

export const InputFields = ({formula, setFormula,insertTemplate}) => {

    const textAreaRef = useRef<TextAreaRef>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tags, setTags] = useState<ITag[]>([]);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const { PROD, VITE_DEV_APP_URL, VITE_PROD_APP_URL} = import.meta.env;
    const API_URL = "https://api.finefoods.refine.dev";
    const LARAVEL_API_URL = `${ PROD 
                                ? VITE_PROD_APP_URL
                                : VITE_DEV_APP_URL
                            }/api`;
    const apiUrl = LARAVEL_API_URL;
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

    const accountOptionsRequest = async (query = {type: 'all', parent: null}) => {
        let url = `${apiUrl}/accounts`;
        let res = await Request('GET', url, null, {params: query});
        // console.log('res', res);
        if ( res.status === 200 ) {
            const newTreeData = formatAccountTreeData(res.data)
          setAccountTreeData([...newTreeData]);
        }
    }

    const tagsOptionsRequest = async () => {
        let url = `${apiUrl}/tags`;
        let res = await Request('GET', url, null);
        // console.log('res', res);
        if ( res.status === 200 ) {
            // const newTreeData = formatAccountTreeData(res.data.result)
          setTags([...res.data]);
        }
    }

    const transactionsOptionsRequest = async () => {
        let url = `${apiUrl}/transactions`;
        let res = await Request('GET', url, null);
        // console.log('res', res);
        if ( res.status === 200 ) {
            // const newTreeData = formatAccountTreeData(res.data.result)
            setTransactions([...res.data]);
        }
    }
    // const { tableProps: accountTableProps, filters, setFilters } = useTable<IAccount>({
    //     resource: "accounts",
    //     filters: {
    //         initial: [{
    //             field: "type",
    //             operator: "eq",
    //             value: "all",
    //         }]
    //     },
    //     sorters: {
    //         mode: "off",
    //     },
    //     syncWithLocation: false,
    //     pagination: {
    //         mode: "off"
    //       },
    // });

    // const {selectProps: tagsSelectProps} = useSelect<ITag>({
    //     resource: "tags",
    //     optionLabel: "label" as any,
    //     optionValue: "label" as any
    // })

    // const {selectProps: transactionsSelectProps} = useSelect<ITransaction>({
    //     resource: "transactions",
    //     optionLabel: "code" as any,
    //     optionValue: "code" as any,
    //     searchField: "code" as any,
    //     onSearch: (value) => [
    //         {
    //           field: "code",
    //           operator: "startswith",
    //           value,
    //         },
    //       ],
        
    // })

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
        ( async () => {
            await accountOptionsRequest();
            await tagsOptionsRequest();
            await transactionsOptionsRequest();
        })()
    },[])


    const onLoadData: TreeSelectProps['loadData'] = async (record) => {
        const account = accountTreeData.find(account => account.id === record.id);

        // console.log('record',record, account);
        setSelectedAccount(record);
        if (account && ! account.isLeaf) {
            await accountOptionsRequest({type: 'all', parent: record.id});

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

        setFormula(prev => `${prev}{{T|${value}}}`);
        insertTemplate(`{{T|${value}}}`);
        // textAreaRef.current?.focus({
        //     cursor: 'end',
        //   });
    }
    const handleTransactionSelect = (value) => {

        setFormula(prev => `${prev}{{TR|${value}}}`);
        insertTemplate(`{{TR|${value}}}`);
        // textAreaRef.current?.focus({
        //     cursor: 'end',
        //   });
    }

    const handleAccountsSelect = (value) => {
        // console.log('ref',textAreaRef);
        setFormula(prev => `${prev}{{A|${value}}}`);
        insertTemplate(`{{A|${value}}}`);
        // setFilters([
        //     {
        //         field: 'type',
        //         operator: 'eq',
        //         value: 'all',
        //     }
        // ], 'replace');
        // textAreaRef.current?.focus({
        //       cursor: 'end',
        //     });
    }

    return (
        <div>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                    {/* <AutoComplete
                        options={formulaOptions}
                        style={{ width: 200 }}
                        placeholder="Formula"
                        onSelect={(value) => setFormula(prev => `${prev} ${value}()`)}
                        filterOption={(inputValue, option) => 
                            (option!.value as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    /> */}
                    <Select
                        showSearch
                        options={tags.map(tag => ({label: tag.label, value: tag.label}))}
                        style={{ width: 200 }}
                        placeholder="Tags"
                        onSelect={handleTagsSelect}
                        filterOption={(inputValue, option) => 
                            (option!.value as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                    <TreeSelect
                        treeDataSimpleMode
                        style={{ width: 200 }}
                        popupMatchSelectWidth={false}
                        placeholder="Accounts"
                        treeData={accountTreeData}
                        loadData={onLoadData}
                        onSelect={handleAccountsSelect}
                        showSearch
                        filterTreeNode={(search, item) => {

                            return (item?.title as any).toLowerCase().startsWith(search.toLowerCase())
                        }
                            
                        }
                        onSearch={handleSearch}
                    />
                    <Select
                        options={transactions.map(transaction => ({label: transaction.code, value: transaction.code}))}
                        filterOption={(inputValue, option) => {
                            // console.log('option', option);
                            return (option!.label as string).toUpperCase().startsWith(inputValue.toUpperCase())
                        }
                        }
                        style={{ width: 200 }}
                        placeholder="Transactions"
                        showSearch
                        onSelect={handleTransactionSelect}
                        />
                </Space>
                <Input.TextArea
                    rows={4}
                    value={formula}
                    onChange={e => setFormula(e.target.value)}
                    placeholder="Example: SUM({x}, {y})"
                    ref={textAreaRef}
                />
            </Space>
        </div>
    );
};

