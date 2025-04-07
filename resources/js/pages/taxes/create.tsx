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
    Input,
    InputNumber,
    Modal
} from "antd";

import { ITax } from "@/interfaces";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    name: string;
    rate: number;
};

export const TaxCreatePage = ({ isOverModal }: Props) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();


    const { formProps, modalProps, close, onFinish } = useModalForm<ITax, HttpError, FormValues
    >({
        action: "create",
        defaultVisible: true,
        resource: "taxes",
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
            title={t("taxes.form.add")}
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
                            rate: values.rate / 100,
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
                    label={t("taxes.fields.name")}
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("taxes.fields.rate")}
                    name="rate"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        prefix="%"
                        min={0}
                        max={100}
                        step={1}
                        precision={2}
                    />

                </Form.Item>
            </Form>
        </Modal>
    );
};
