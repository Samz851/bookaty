import {
    useTranslate,
    HttpError,
    getDefaultFilter, useGo,
    useNavigation
} from "@refinedev/core";
import {
    List,
    useTable, FilterDropdown, CreateButton
} from "@refinedev/antd";
import {
    Table, Typography,
    theme, Input, Button,
    Layout,
    TreeSelect,
    Skeleton,
    Spin
} from "antd";

import { IAccount, IAccountFilterVariables } from "@/interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PropsWithChildren, useEffect, useState } from "react";
import { useStyles } from './styled'
import { useLocation } from "react-router-dom";
import { Key } from "antd/es/table/interface";

import debounce from "lodash/debounce";
import { title } from "process";

const { SHOW_PARENT } = TreeSelect;


const { Header, Footer, Sider, Content } = Layout;


const SearchInput = ({term, setTerm}) => {
    const onSearch = e => setTerm(e.target.value); 
    const onSearchDebounce = debounce(onSearch, 1000);
    return (
        <Input 
            value={term} 
            onPressEnter={ onSearchDebounce } 
            placeholder="Enter Code"
            />
    )
}


const SelectField = ({loading, data, selected, onChange, onLoad}) => {

    const tProps = {
        // treeDataSimpleMode: {
        //     id: 'id',
        //     pid: 'parent_id',
        //     title: 'name',
        // },
        treeData: data,
        // value: selected,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Please select',
        style: {
          width: '100%',
        },
      };
      

    return loading ? (<Spin />) : (
        // <Skeleton loading={loading}>
        <TreeSelect 
        fieldNames={{ value: 'id', label: 'name' }} {...tProps} />
        // </Skeleton>
    )
}

export const SelectAccount = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { show, createUrl } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();
    const { styles} = useStyles();
    const [ term, setTerm ] = useState('');

    const { tableProps, filters, setFilters, sorters } = useTable<
        IAccount,
        HttpError,
        IAccountFilterVariables
    >({
        resource: "accounts",
        filters: {
            initial: [
                {
                    field: "type",
                    operator: "eq",
                    value: "all",
                }
            ]
        },
        sorters: {
            mode: "off",
        },
        syncWithLocation: false,
        pagination: {
            mode: "off"
          },
    });

    const [ accounts, setAccounts ] = useState<IAccount[] | undefined>([...tableProps.dataSource as any ?? []]);
    const [ expandedAccount, setExpandedAccount ] = useState('');
    const [ expandedRows, setExpandedRows ] = useState<Key[]>();
    const [ selectedRowKeys, setSelectedRowKeys ] = useState<Key[]>([]);
    const [ selectedAccounts, setSelectedAccounts ] = useState([]);
    const genTreeNode = (parentId, isLeaf = false) => {
        const random = Math.random();
        return {
          id: random,
          parent_id: parentId,
        //   value: random,
            name: isLeaf ? 'Tree Node' : 'Expand to load',
          isLeaf,
        };
      };
      const onLoadData = ({ id }) =>
        new Promise((resolve) => {
          setTimeout(() => {
            const newAccounts = [...(accounts as any)?.map(account => {
                if ( account.id === id ) {
                    account.children = [genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]
                }
                return account;
            })]
            setAccounts(newAccounts );
            resolve(undefined);
          }, 300);
        });
    // const [ loading, ]
    useEffect(()=>{
        console.log(tableProps);
        if ( ! tableProps.loading ) {
            if ( expandedAccount !== '' ) {
                setAccounts((prevAccounts) => {
                    const updateAccounts = (accounts) => {
                        return [...(accounts as any)?.map(account => {
                            if ( expandedAccount.startsWith(account.code) ) {
                                if ( expandedAccount === account.code ) {
                                    return {
                                        ...account,
                                        children: [...tableProps.dataSource as any]
                                    }
                                }
                                if ( expandedAccount.length > account.code.length ) {
                                    return {
                                        ...account,
                                        children: updateAccounts(account.children)
                                    }
                                }
                            } else {
                                return account;
                            }
                        })]
                    }
                    return [...updateAccounts(prevAccounts)];
    
                })
            } else {
                setAccounts([...tableProps.dataSource as any]);
            }
        }

    }, [tableProps.dataSource]);


    const onExpandAccount = (expanded: boolean, record: IAccount) => {
        setExpandedAccount(record?.code ?? '');
        if ( ! record.children?.length && record.has_children ){
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
    }

    const addExpandedKeysValue = (keys) => {
        let key = keys.pop();
        console.log(key);
        console.log(! expandedRows, expandedRows?.length, expandedRows)
        console.log(keys);
        if ( ! expandedRows ) {
            setExpandedRows([key]);
        } else if ( key.startsWith(expandedRows[0]) ) {
            setExpandedRows([...expandedRows, key]);
        } else {
            setExpandedRows([key]);
        }
    }

    const isExpandable = (record: IAccount) => {
        console.log('expandable', record);
        return record.has_children ?? false;
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: IAccount[]) => {
          console.log(`selectedRowKeys: ${newSelectedRowKeys}`, 'selectedRows: ', selectedRows);
          setSelectedRowKeys(newSelectedRowKeys)
        },
        getCheckboxProps: (record: IAccount) => ({
          disabled: ! selectedRowKeys.includes(record.code as Key) && selectedRowKeys.some( key =>  record.code?.startsWith(key as string)), // Column configuration not to be checked
          name: record.name,
        }),
    }
    return (
        <List
            breadcrumb={false}
            headerButtons={(props) => [
                // <ExportButton key={useId()} onClick={triggerExport} loading={isLoading} />,
                <CreateButton
                    {...props.createButtonProps}
                    key="create"
                    size="large"
                    onClick={() => {
                        return go({
                            to: `${createUrl("accounts")}`,
                            query: {
                                to: pathname,
                            },
                            options: {
                                keepQuery: true,
                            },
                            type: "replace",
                        });
                    }}
                >
                    {t("accounts.form.add")}
                </CreateButton>,
            ]}
        >
            <Table
                {...tableProps}
                dataSource={accounts}
                className={styles.expanded}
                rowKey="code"
                scroll={{ x: true }}
                rowSelection={rowSelection}
                expandable={{
                    onExpand: onExpandAccount,
                    // onExpandedRowsChange: (keys) => addExpandedKeysValue(keys),
                    rowExpandable: isExpandable,
                    indentSize: 30,
                    expandedRowClassName: (record) => record.taxonomy,
                    // expandedRowKeys: expandedRows
                }}
            >
                <Table.Column
                    key="code"
                    dataIndex="code"
                    title="ID #"
                    rowScope="row"
                    render={(value) => (
                        <Typography.Text
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            {value}
                        </Typography.Text>
                    )}
                    // onCell={(record: IAccount, index) => { 
                    //     console.log(index, record);
                    //     if ( record.has_children && record.children?.length ) {
                    //         return { 
                    //             rowSpan: record.children.length + 1,
                    //             colSpan: record.code.split(/(.{2})/).filter(O=>O).length
                    //         }
                    //     }
                    //     return { }
                    // }}
                />
                <Table.Column
                    key="name"
                    dataIndex="name"
                    title={t("users.fields.name")}
                    defaultFilteredValue={getDefaultFilter(
                        "name",
                        filters,
                        "contains",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                style={{ width: "100%" }}
                                placeholder={t("users.filter.name.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="parent"
                    dataIndex={["parent", "name"]}
                    title={t("accounts.fields.parent")}
                    defaultFilteredValue={getDefaultFilter(
                        "parent",
                        filters,
                        "contains",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                style={{ width: "100%" }}
                                placeholder={t("users.filter.gsm.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="balance"
                    dataIndex={["accounts_balance"]}
                    title={t("accounts.fields.balance")}
                    render={(_, record) => _.balance.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
                />
                <Table.Column<IAccount>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => show('accounts', record.id, "push")}
                        />
                    )}
                />
            </Table>
            {children}
        </List>
    //     <Layout>
    //   <Header>
    //     <SearchInput term={term} setTerm={setTerm} />
    //   </Header>
    //   <Content>
    //     <SelectField loading={tableProps.loading} data={accounts} selected={selectedAccounts} onChange={(newValue) => setSelectedAccounts(newValue)} onLoad={onLoadData} />
    //   </Content>
    //   <Footer>Footer</Footer>
    // </Layout>
    );
};
