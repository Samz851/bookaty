import { useSearchParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
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
    Input, Modal
} from "antd";

import { ICompany } from "@/interfaces";



type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    company_name: string;
    currency: string;
    address: string;
    contact_information?: string;
};

export const CompanyCreatePage = ({ isOverModal }: Props) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();

    const { formProps, modalProps, close, onFinish } = useModalForm<ICompany, HttpError, FormValues
    >({
        action: "create",
        defaultVisible: true,
        resource: "companies",
        redirect: false,
        warnWhenUnsavedChanges: !isOverModal,
    });


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
            title={t("companies.form.add")}
            width={512}
            closeIcon={<LeftOutlined />}
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={async (values) => {
                    try {
                        const data = await onFinish({
                            company_name: values.company_name,
                            currency: values.currency,
                            contact_information: values.contact_information,
                            address: values.address
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
                    label={t("companies.fields.company_name")}
                    name="company_name"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Please enter company name" />
                </Form.Item>
                <Form.Item
                    label={t("companies.fields.currency")}
                    name="currency"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("companies.fields.contact_information")}
                    name="contact_information"
                    rules={[{required: true}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("companies.fields.address")}
                    name="address"
                    rules={[{required: true}]}
                >
                    <Input />
                </Form.Item>
                
            </Form>
        </Modal>
    );
};
