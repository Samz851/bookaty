import { useSearchParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
import {
    HttpError, useGetToPath,
    useGo,
    useList,
    useTranslate
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
    LeftOutlined
} from "@ant-design/icons";
import {
    Form,
    Input,
    Modal, TreeSelect
} from "antd";

import { IAccountsBranch } from "@/interfaces";

import { useState } from "react";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    name: string;
    description: string;
    parent?: any;
};
// type AccountsBranchesTree = IAccountsBranch & DataNode;
export const AccountsBranchCreatePage = ({ isOverModal }: Props) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const [typeValue, setTypeValue] = useState<string>();

    const t = useTranslate();

    const initValues = {parent: searchParams.get('parent') ?? ''};

    const { formProps, modalProps, close, onFinish } = useModalForm<IAccountsBranch, HttpError, FormValues
    >({
        action: "create",
        defaultVisible: true,
        resource: "branches",
        redirect: false,
        warnWhenUnsavedChanges: !isOverModal,
    });

    const { data } = useList<IAccountsBranch>({
        resource: "branches",
        filters: [
            {
                field: 'selectOptions',
                operator: 'eq',
                value: true
            }
        ]
    });

    const accountBranches = data?.data ?? [];

    return (
        <Modal
            {...modalProps}
            mask={!isOverModal}
            onCancel={() => {
                close();
                go({
                    to:
                        searchParams.get("to") ??
                        getToPath({
                            action: "list",
                        }) ??
                        "",
                    query: {
                        to: undefined,
                    },
                    options: {
                        keepQuery: true,
                    },
                    type: "replace",
                });
            }}
            title={t("branches.form.add")}
            width={512}
            closeIcon={<LeftOutlined />}
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={async (values) => {
                    try {
                        const data = await onFinish({
                            name: values.name,
                            description: values.description,
                            parent: values.parent
                        });
                        close();
                        go({
                            to:
                                searchParams.get("to") ??
                                getToPath({
                                    action: "list",
                                }) ??
                                "",
                            query: {
                                to: undefined,
                            },
                            options: {
                                keepQuery: true,
                            },
                            type: "replace",
                        });

                        
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
                    name="parent"
                    // rules={[{ required: true }]}
                >
                    <TreeSelect
                        style={{ width: '100%' }}
                        // value={typeValue}
                        fieldNames={{label: "title", "value": "key", children: "children"}}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={accountBranches}
                        placeholder="Please select"
                        treeDefaultExpandAll
                        // onChange={onChangeType}
                        allowClear={true}
                        // defaultValue={initValue}
                        />

                </Form.Item>
                
            </Form>
        </Modal>
    );
};
