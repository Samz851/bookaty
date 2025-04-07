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

import { CreateContextType, ITag, ITax } from "@/interfaces";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    label: string;
    description?: string;
};

export const TagCreateForm = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const t = useTranslate();
    const back = useBack();
    const [ createForms, goToCreateForm, openForms, setOpenForms ] = useOutletContext<CreateContextType>();


    const { formProps, form, onFinish, saveButtonProps } = useForm<ITag, HttpError, FormValues
    >({
        action: "create",
        resource: "tags",
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
                            label: values.label,
                            description: values.description,
                        });
                        back();

                    } catch (error) {
                        Promise.reject(error);
                    }
                }}
            >
                <Form.Item
                    label={t("tags.fields.label")}
                    name="label"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("tags.fields.description")}
                    name="description"
                    rules={[{ required: false }]}
                >
                    <Input.TextArea />

                </Form.Item>
            </Form>
        </Create>
    );
};
