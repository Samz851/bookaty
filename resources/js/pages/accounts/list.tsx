import {
    useTranslate,
    HttpError,
    getDefaultFilter, useGo,
    useNavigation,
    useUpdate
} from "@refinedev/core";
import {
    List,
    useTable, FilterDropdown, CreateButton, useSelect
} from "@refinedev/antd";
import {
    Table, Typography,
    theme, Input, Button,
    TableColumnsType,
    Row,
    Select,
    Divider,
    Space
} from "antd";

import { IAccount, IAccountFilterVariables, IAccountsBranch, ITag } from "@/interfaces";
import { EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStyles } from "./styled";
import { Key } from "antd/es/table/interface";
import { Int } from "@uiw/react-json-view/cjs/types/Int";
import { DisplayTags } from "@/components/tags";

export const AccountsList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { show, createUrl, create } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();
    const { styles} = useStyles();
    const [editTags, setEditTags] = useState(false)
    const { tableProps, filters, setFilters, sorters } = useTable<
        IAccount,
        HttpError,
        IAccountFilterVariables
    >({
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
        syncWithLocation: true,
        pagination: {
            mode: "off"
          },
    });
    const { selectProps, queryResult } = useSelect<ITag>({
        resource: 'tags',
        optionLabel: "label",
  optionValue: "id",
    })
    const [ accounts, setAccounts ] = useState<IAccount[] | undefined>([...tableProps.dataSource as any ?? []]);
    const [ expandedAccount, setExpandedAccount ] = useState('');
    const [ expandedRows, setExpandedRows ] = useState<Key[]>();

    useEffect(()=>{
        // console.log(tableProps);
        if ( ! tableProps.loading ) {
            if ( expandedAccount !== '' ) {
                setAccounts((prevAccounts) => {
                    const updateAccounts = (accounts) => {
                        return [...(accounts as any)?.map(account => {
                            if ( expandedAccount.startsWith(account.code) ) {
                                if ( expandedAccount === account.code ) {
                                    // console.log(account.code, tableProps.dataSource)
                                    return {
                                        ...account,
                                        children: [...tableProps.dataSource as any]
                                    }
                                }
                                if ( expandedAccount.length > account.code.length ) {
                                    // console.log(account.code, tableProps.dataSource)
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
                console.log(tableProps.dataSource)
                setAccounts([...tableProps.dataSource as any]);
            }
        }

    }, [tableProps.dataSource]);


    const onExpandAccount = (expanded: boolean, record: IAccount) => {
        setExpandedAccount(record.code);
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

    const { mutate: mutateAccount } = useUpdate<IAccount>({
        resource: 'accounts'
    })
    const { mutate: mutateBranch } = useUpdate<IAccountsBranch>({
        resource: 'branches'
    })

    const handleTagsUpdate = (id, tags) => {
        if ( id < 300 ) {
            mutateBranch({
                id: id,
                values: {
                    tags: [...tags.map(tag => tag.id)]
                }
            })
            return;
        } else {
            mutateAccount({
                id: id,
                values: {
                    tags: [...tags.map(tag => tag.id)]
                }
            })
            return;
        }

    }
    const columns: TableColumnsType<IAccount> = [
        {
            dataIndex: "code",
            title: "ID #",
            rowScope:"row",
            render:(value) => (
                <Typography.Text
                    style={{
                        whiteSpace: "nowrap",
                    }}
                >
                    {value}
                </Typography.Text>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{
                        color: filtered
                            ? token.colorPrimary
                            : undefined,
                    }}
                />
            ),
            defaultFilteredValue:getDefaultFilter(
                "code",
                filters,
                "contains",
            ),
            filterDropdown: (props) => (
                <FilterDropdown {...props}>
                    <Input
                        addonBefore="#"
                        style={{ width: "100%" }}
                        placeholder={t("orders.filter.id.placeholder")}
                    />
                </FilterDropdown>
            )
        },
        {
            dataIndex:"name",
            title:t("users.fields.name"),
            defaultFilteredValue:getDefaultFilter(
                "name",
                filters,
                "contains",
            ),
            filterDropdown:(props) => (
                <FilterDropdown {...props}>
                    <Input
                        style={{ width: "100%" }}
                        placeholder={t("users.filter.name.placeholder")}
                    />
                </FilterDropdown>
            )
        },
        {
            dataIndex:["accounts_balance"],
            title:"Total Debit",
            render:(_, record) => _.debit_total.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })
        },
        {
            dataIndex:["accounts_balance"],
            title:"Total Credit",
            render:(_, record) => _.credit_total.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })
        },
        {
            dataIndex:["accounts_balance"],
            title:"Balance",
            render:(_, record) => _.balance.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })
        },
        {
            dataIndex:["tags"],
            title:"tags",
            render:(_, record) => (
//                 <Row>
// <Select
//                 // disabled={!editTags}
//                 mode="multiple"
//                 allowClear
//                 style={{ width: '100%' }}
//                 placeholder="Please select"
//                 defaultValue={[...record.tags.reduce<number[]>((acc, obj) => {
//                     acc.push(obj.id);
//                     return acc;
//                   }, [])] as any}
//                 onChange={handleTagsChange}
//               //   options={queryResult?.data?.data as any}
//               {...selectProps}
//               dropdownRender={(menu) => (
//                   <>
//                   {menu}
//                   <Divider style={{ margin: '8px 0' }} />
//                   <Space style={{ padding: '0 8px 4px' }}>
//                       <Button type="text" icon={<PlusOutlined />} onClick={() => create('tags')}>
//                       Add item
//                       </Button>
//                   </Space>
//                   </>
//               )}
                
//               />
//                 <Button
//                 disabled={!editTags}
//                 icon={<EyeOutlined />}
//                 onClick={() => show('accounts', record.id, "push")}
//                     />
//                 </Row>
                <DisplayTags 
                    initialTags={record.tags}
                    recordID={record.id}
                    // handleTagsUpdate={handleTagsChange} 
                    handleTagsUpdate={handleTagsUpdate}
                />
            )
        },
        {
            fixed:"right",
            title:t("table.actions"),
            render:(_, record) => (
                <>
                <Row>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => show(record.code.length == 10 ? 'accounts' : 'branches', record.code, "push")}
                    />

                </Row>
                <Row>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => show(record.code.length == 10 ? 'accounts' : 'branches', record.code, "push")}
                    />
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => show(record.code.length == 10 ? 'accounts' : 'branches', record.code, "push")}
                    />
                </Row>
                </>

            ),
        }

    ]

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
    return (
        <List
            title={t("accounts.accounts")}
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
                expandable={{
                    onExpand: onExpandAccount,
                    // onExpandedRowsChange: (keys) => addExpandedKeysValue(keys),
                    rowExpandable: isExpandable,
                    indentSize: 30,
                    expandedRowClassName: (record) => record.taxonomy,
                    // expandedRowKeys: expandedRows
                }}
                columns={columns}
            />
                {/* <Table.Column
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
                    filterIcon={(filtered) => (
                        <SearchOutlined
                            style={{
                                color: filtered
                                    ? token.colorPrimary
                                    : undefined,
                            }}
                        />
                    )}
                    defaultFilteredValue={getDefaultFilter(
                        "code",
                        filters,
                        "contains",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                addonBefore="#"
                                style={{ width: "100%" }}
                                placeholder={t("orders.filter.id.placeholder")}
                            />
                        </FilterDropdown>
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
            </Table> */}
            {children}
        </List>
    );
};
