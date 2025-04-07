import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";

import { Create, useForm, useModalForm, useSelect, useTable } from "@refinedev/antd";
import {
    HttpError, useBack, useGetToPath,
    useGo,
    useList,
    useTranslate
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
    LeftOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {
    Button,
    Divider,
    Form,
    GetProp,
    Input,
    Modal, Select, Space, TreeSelect,
    TreeSelectProps
} from "antd";

import { CreateContextType, CreateFormPropsType, IAccount, IAccountFilterVariables, IAccountsBranch, ITag } from "@/interfaces";

import { useEffect, useState } from "react";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    name: string;
    description: string;
    parent_id?: any;
    tags: number[];

};

type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number];

// type AccountsBranchesTree = IAccountsBranch & DataNode;
export const AccountsBranchCreateForm = () => {
    const { key } = useLocation();
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const back = useBack();
    const [ createForms, goToCreateForm, openForms, setOpenForms ] = useOutletContext<CreateContextType>();

    const [typeValue, setTypeValue] = useState<string>();

    const t = useTranslate();

    const initValues = {parent: searchParams.get('parent') ?? ''};

    const { formProps, form, formLoading, onFinish, saveButtonProps } = useForm<IAccountsBranch, HttpError, FormValues
    >({
        action: "create",
        resource: "branches",
    });

    // const { data } = useList<IAccountsBranch>({
    //     resource: "accounts",
    //     filters: [
    //         {
    //             field: 'type',
    //             operator: 'eq',
    //             value: 'all'
    //         }
    //     ]
    // });

    const { tableProps: accountTableProps, filters, setFilters, sorters } = useTable<
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

    const formatAccountTreeData = (data: IAccount[]) => {
        return data?.map(account => {
            // console.log('account', account)
            return {
            title: account.code,
            value: account.id,
            key: account.id,
            isLeaf: account.has_children === true ? false : true,
            pId: account.parent_id ? account.parent_id : 0,
            id: account.id
        }
        }
    ) ?? [];
    }

        const [accountTreeData, setAccountTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
        
        const [ selectedAccount, setSelectedAccount ] = useState<DefaultOptionType | null>(null);
    
    // const [ accounts, setAccounts ] = useState<IAccount[] | undefined>([...tableProps.dataSource as any ?? []]);
    const [ expandedAccount, setExpandedAccount ] = useState('');
    // const accountBranches = data?.data ?? [];

    // useEffect(()=>{
    //     console.log(tableProps);
    //     if ( ! tableProps.loading ) {
    //         if ( expandedAccount !== '' ) {
    //             setAccounts((prevAccounts) => {
    //                 const updateAccounts = (accounts) => {
    //                     return [...(accounts as any)?.map(account => {
    //                         if ( expandedAccount.startsWith(account.code) ) {
    //                             if ( expandedAccount === account.code ) {
    //                                 return {
    //                                     ...account,
    //                                     children: [...tableProps.dataSource as any]
    //                                 }
    //                             }
    //                             if ( expandedAccount.length > account.code.length ) {
    //                                 return {
    //                                     ...account,
    //                                     children: updateAccounts(account.children)
    //                                 }
    //                             }
    //                         } else {
    //                             return account;
    //                         }
    //                     })]
    //                 }
    //                 return [...updateAccounts(prevAccounts)];
    
    //             })
    //         } else {
    //             setAccounts([...tableProps.dataSource as any]);
    //         }
    //     }

    // }, [tableProps.dataSource]);

    useEffect(()=>{
        // console.log('tree data', accountTableProps.dataSource)
        if ( ! accountTableProps.loading) {
            const newAccountData = formatAccountTreeData(accountTableProps.dataSource as any)
            // console.log('new account data', newAccountData)
            setAccountTreeData([...accountTreeData, ...newAccountData]);

        }
    },[accountTableProps.dataSource])

    // const onLoadData = (record) => {
    //     console.log('on load data node', record);
    //     setExpandedAccount(record.code);
    //     setFilters([
    //         {
    //             field: 'type',
    //             operator: 'eq',
    //             value: 'all',
    //         },
    //         {
    //             field: 'parent',
    //             operator: 'eq',
    //             value: record.id,
    //         }
    //     ], 'replace');
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //           resolve(undefined);
    //         }, 300);
    //       })
    // }

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

    useEffect(() => {
        const prevForm = createForms.find( (form) => form.key === key );
        if ( prevForm ) {
            form.setFieldsValue( prevForm.values || {});
        } else {
            setOpenForms([...openForms, `branches - ${key}`]);
        }
    }, []);

    return (
        // <Modal
        //     {...modalProps}
        //     mask={!isOverModal}
        //     onCancel={() => {
        //         close();
        //         go({
        //             to:
        //                 searchParams.get("to") ??
        //                 getToPath({
        //                     action: "list",
        //                 }) ??
        //                 "",
        //             query: {
        //                 to: undefined,
        //             },
        //             options: {
        //                 keepQuery: true,
        //             },
        //             type: "replace",
        //         });
        //     }}
        //     title={t("branches.form.add")}
        //     width={512}
        //     closeIcon={<LeftOutlined />}
        // >
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    try {
                        const data = await onFinish({
                            name: values.name,
                            description: values.description,
                            parent_id: values.parent_id,
                            tags: values.tags
                        });
                        back();

                        
                    } catch (error) {
                        Promise.reject(error);
                    }
                }}
                initialValues={initValues}
            >
                <Form.Item
                    label={t("branches.fields.name")}
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("branches.fields.description")}
                    name="description"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("branches.fields.parent")}
                    name="parent_id"
                    // rules={[{ required: true }]}
                >
                    <TreeSelect
                        treeDataSimpleMode
                        style={{ width: '100%' }}
                        // value={typeValue}
                        // fieldNames={{label: "code_label", "value": "code", children: "children"}}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={accountTreeData}
                        placeholder="Please select"
                        // treeDefaultExpandAll
                        loadData={onLoadData}
                        // onChange={onChangeType}
                        allowClear={true}
                        disabled={accountTreeData?.length === 0}
                        // defaultValue={initValue}
                        />

                </Form.Item>
                <Form.Item
                    label="tags"
                    name="tags"
                    rules={[{ required: false }]}
                >
                        <Select
      mode="multiple"
      allowClear
      style={{ width: '100%' }}
      placeholder="Please select"
    //   onChange={handleChange}
    //   options={queryResult?.data?.data as any}
    {...selectProps}
    dropdownRender={(menu) => (
        <>
        {menu}
        <Divider style={{ margin: '8px 0' }} />
        <Space style={{ padding: '0 8px 4px' }}>
            <Button type="text" icon={<PlusOutlined />} onClick={() => goToCreateForm(form.getFieldsValue(true), 'tags')}>
            Add item
            </Button>
        </Space>
        </>
    )}
      
    />

                </Form.Item>
            </Form>
        </Create>
        // </Modal>
    );
};
