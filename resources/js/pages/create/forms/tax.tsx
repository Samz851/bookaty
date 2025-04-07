import { useOutletContext, useSearchParams } from "react-router-dom";

import { Create, useForm, useModalForm } from "@refinedev/antd";
import {
    HttpError, useBack, useGetToPath,
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

import { CreateContextType, ITax } from "@/interfaces";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    name: string;
    rate: number;
};

export const TaxCreateForm = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();
    const back = useBack();
    const [ createForms, goToCreateForm, openForms, setOpenForms ] = useOutletContext<CreateContextType>();


    const { formProps, form, onFinish, saveButtonProps } = useForm<ITax, HttpError, FormValues
    >({
        action: "create",
        resource: "taxes",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                layout="vertical"
                form={form}
                onFinish={async (values) => {
                    try {
                        const data = await onFinish({
                            name: values.name,
                            rate: values.rate / 100,
                        });
                        back();

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
        </Create>
    );
};
