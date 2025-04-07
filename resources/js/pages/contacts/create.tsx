import { useSearchParams } from "react-router-dom";

import { useModalForm, useSelect } from "@refinedev/antd";
import {
    HttpError, useGetToPath,
    useGo,
    useTranslate
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
    LeftOutlined
} from "@ant-design/icons";
import {
    Form,
    Input, Modal, Select
} from "antd";

import { ICompany } from "@/interfaces";


type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    name: string;
    email: string;
    phone_number: string;
    type: string;
    company_id?: number;
};

export const ContactCreatePage = ({ isOverModal }: Props) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();

    const { formProps, modalProps, close, onFinish } = useModalForm<ICompany, HttpError, FormValues
    >({
        action: "create",
        defaultVisible: true,
        resource: "contacts",
        redirect: false,
        warnWhenUnsavedChanges: !isOverModal,
    });

    const { selectProps } = useSelect<ICompany>({
        resource: "companies",
        optionLabel: "company_name",
        optionValue: "id"
    })

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
            title={t("contacts.form.add")}
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
                            email: values.email,
                            phone_number: values.phone_number,
                            type: values.type,
                            company_id: values.company_id
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
            >
                <Form.Item
                    label={t("contacts.fields.name")}
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("contacts.fields.email")}
                    name="email"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("contacts.fields.phone_number")}
                    name="phone_number"
                    rules={[{required: true}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("contacts.fields.type")}
                    name="type"
                    rules={[{required: true}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("contacts.fields.company")}
                    name="company_id"
                    // rules={[{required: true}]}
                >
                    <Select
                        style={{ width: 300 }}
                        {...selectProps}
                    />
                </Form.Item>
                
            </Form>
        </Modal>
    );
};
