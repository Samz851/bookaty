import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";

import { Create, SaveButton, useForm, useModalForm, useSelect, useTable } from "@refinedev/antd";
import {
    BaseOption,
    HttpError, useBack, useGetToPath,
    useGo, useNavigation, useParsed, useTranslate,
    useUpdate
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
    LeftOutlined, PlusOutlined
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

import { CreateContextType, CreateFormPropsType, IAccount, IAccountFilterVariables, ITag } from "@/interfaces";

import { useEffect, useState } from "react";
// import { BaseOptionType, DefaultOptionType } from "antd/es/select";

type FormValues = {
    name: string;
    parent_id: number;
    description: string;
    tags: number[];
};
type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number];


export const AccountCreateForm = () => {
    // console.log(`Create Account`, props);
    const { key } = useLocation();
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const back = useBack()
    const t = useTranslate();
    const { create } = useNavigation();
    const [ createForms, goToCreateForm, openForms, setOpenForms ] = useOutletContext<CreateContextType>();
    const [ accountsOptions, setAccountsOptions ] = useState<IAccount[] | []>([]);
    const [ expandedAccount, setExpandedAccount ] = useState('');
    const { resource } = useParsed();
    const { form, formProps, onFinish, formLoading, saveButtonProps } = useForm<IAccount, HttpError, FormValues
    >({
        action: "create",
        resource: "accounts",
        redirect: false,
    });

    const [accountTreeData, setAccountTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
    const [ selectedAccount, setSelectedAccount ] = useState<DefaultOptionType | null>(null);

    // useEffect(() => {
    //     if ( ! formLoading ) {
    //         setOpenForms([...openForms, resource?.name])
    //     }
    // }, [formLoading])
    const { tableProps: AccountselectProps, filters, setFilters, sorters } = useTable<
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
            ],
        },
        sorters: {
            mode: "off",
        },
        syncWithLocation: false,
        pagination: {
            mode: "off"
          },
    });

    const { selectProps, queryResult } = useSelect<ITag>({
        resource: 'tags',
        optionLabel: "label",
  optionValue: "id",
    })
    // const handleChange = (value: BaseOption, option: DefaultOptionType) => {
    //     console.log(`selected ${value}`, value, typeof value);
    //   };
    const onExpandAccount = (keys) => {
        console.log(keys);
        let parentID = keys.pop();
        setExpandedAccount(parentID);
        setFilters([{field: 'parent', operator: 'eq', value: parentID}], 'merge');
    }

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
    useEffect(()=>{
        // console.log('tags', queryResult, selectProps);
        // if ( ! AccountselectProps.loading ) {
        //     if ( accountsOptions.length === 0 ) {
        //         setAccountsOptions([...AccountselectProps.dataSource as any]);
        //     } else if ( expandedAccount !== '' ) {
        //         setAccountsOptions((prevAccounts) => {
        //             const updateAccounts = (accounts) => {
        //                 return [...(accounts as any)?.map(account => {
        //                     if ( expandedAccount.startsWith(account.code) ) {
        //                         if ( expandedAccount === account.code ) {
        //                             return {
        //                                 ...account,
        //                                 children: [...AccountselectProps.dataSource as any]
        //                             }
        //                         }
        //                         if ( expandedAccount.length > account.code.length ) {
        //                             return {
        //                                 ...account,
        //                                 children: updateAccounts(account.children)
        //                             }
        //                         }
        //                     } else {
        //                         return account;
        //                     }
        //                 })]
        //             }
        //             return [...updateAccounts(prevAccounts)];
    
        //         })
        //     }
        // }


        if ( ! AccountselectProps.loading) {
            const newAccountData = formatAccountTreeData(AccountselectProps.dataSource as any)
            console.log('new account data', newAccountData)
            console.log('account tree data', accountTreeData)
            setAccountTreeData([...accountTreeData, ...newAccountData]);

        }

    }, [AccountselectProps.dataSource, queryResult.data]);

    useEffect(() => {
        const prevForm = createForms.find( (form) => form.key === key );
        if ( prevForm ) {
            form.setFieldsValue( prevForm.values || {});
        } else {
            // setOpenForms([...openForms, `accounts - ${key}`]);
        }
    }, []);
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

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    try {
                        const data = await onFinish({
                            name: values.name,
                            parent_id: values.parent_id,
                            description: values.description,
                            tags: values.tags
                        });
                        back();
                    } catch (error) {
                        Promise.reject(error);
                    }
                }}
            >
                <Form.Item
                    label={t("accounts.fields.name")}
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Please enter account name" />
                </Form.Item>
                <Form.Item
                    label={t("branches.fields.description")}
                    name="description"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("accounts.fields.parent")}
                    name="parent_id"
                    rules={[{ required: true }]}
                >
                    <TreeSelect
                        treeDataSimpleMode
                        style={{ width: '100%' }}
                        // loadData={loadMoreAccounts as any}
                        // fieldNames={{label: "code_label", "value": "id"}}
                        // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        popupMatchSelectWidth
                        treeData={accountTreeData}
                        placeholder="Please select"
                        // onChange={onChangeType}
                        loadData={onLoadData}
                        allowClear={true}
                        // onTreeExpand={onExpandAccount}
                        dropdownRender={(menu) => (
                            <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space style={{ padding: '0 8px 4px' }}>
                                <Button type="text" icon={<PlusOutlined />} onClick={() => goToCreateForm(form.getFieldsValue(true), 'branches')}>
                                Add item
                                </Button>
                            </Space>
                            </>
                        )}
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
                <SaveButton/>
            </Form>
        </Create>
    );
};
