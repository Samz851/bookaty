import React, { useEffect, useState } from 'react';
import { Select, TreeSelect, Space } from 'antd';
import type { GetProp, TreeSelectProps } from 'antd';
import { useSelect, useTable } from "@refinedev/antd"; // Import necessary hooks
import { useApiUrl } from "@refinedev/core";  // Add this line
import { Request } from "@/helpers/httpHelper";
import { ITag, IAccount, ITransaction, IFormula } from "@/interfaces";
import { debounce } from 'lodash';

type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number];

interface PlaceHoldersInputProps {
    handleTagsSelect: (value: any) => void;
    handleAccountsSelect: (value: any) => void;
    handleTransactionSelect: (value: any) => void;
    includeFormula?: boolean;
    handleFormulaSelect?: (value: any) => void;
}

const PlaceHoldersInput: React.FC<PlaceHoldersInputProps> = ({
    handleTagsSelect, 
    handleAccountsSelect, 
    handleTransactionSelect, 
    includeFormula = false,
    handleFormulaSelect
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [accountTreeData, setAccountTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
    const [ selectedAccount, setSelectedAccount ] = useState<DefaultOptionType | null>(null);


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

    const {selectProps: formulasSelectProps} = useSelect<IFormula>({
        resource: "formula",
        optionLabel: "code" as any,
        optionValue: "code" as any,
        searchField: "code" as any,
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
        // console.log('tree data', accountTableProps.dataSource)
        if ( ! accountTableProps.loading) {
            const newAccountData = formatAccountTreeData(accountTableProps.dataSource as any)
            // console.log('new account data', newAccountData)
            setAccountTreeData([...accountTreeData, ...newAccountData]);

        }
    },[accountTableProps.dataSource])

    useEffect(() => {
        getData();
    }, [searchTerm]);

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

    

    return (
        <Space>
            <Select
                showSearch
                options={tagsSelectProps.options}
                style={{ width: 200 }}
                placeholder="Tags"
                onSelect={handleTagsSelect}
                loading={tagsSelectProps.loading}
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
                loading={accountTableProps.loading ? true : false}
                showSearch
                filterTreeNode={(search, item) => {
                    return (item?.title as any).toLowerCase().startsWith(search.toLowerCase());
                }}
                onSearch={handleSearch}
            />
            <Select
                {...transactionsSelectProps}
                loading={transactionsSelectProps.loading}
                filterOption={(inputValue, option) => {
                    return (option!.label as string).toUpperCase().startsWith(inputValue.toUpperCase());
                }}
                style={{ width: 200 }}
                placeholder="Transactions"
                showSearch
                onSelect={handleTransactionSelect}
            />
            {
                includeFormula && (
                    <Select
                        {...formulasSelectProps}
                        loading={formulasSelectProps.loading}
                        placeholder="Formulas"
                        showSearch
                        onSelect={handleFormulaSelect}
                    />
                )
            }
        </Space>
    );
};

export default PlaceHoldersInput;