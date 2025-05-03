import { useSearchParams } from "react-router-dom";
import { useModalForm, useSelect } from "@refinedev/antd";
import dayjs from "dayjs";
import {
    HttpError,
    useGetToPath,
    useGo,
    useNavigation,
    useTranslate
} from "@refinedev/core";

import {
    LeftOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Switch,
    Typography,
    Upload
} from "antd";

import { IBill, IContact } from "@/interfaces";
import { useState } from "react";
import { useStyles } from "./styled";
import ImageAnnotation from "@/components/imageAnnotation";

type Props = {
    isOverModal?: boolean;
};

type FormValues = {
    date: string;
    description: string;
    amount: number;
    status: string;
    due_date: string;
    notes: string;
    vendor_id: number;
    attachments: any[];
};

export const BillCreatePage = ({ isOverModal }: Props) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const { create } = useNavigation();
    const t = useTranslate();
    const { styles } = useStyles();
    const [isScan, setIsScan] = useState(false);

    const { form, formProps, modalProps, close, onFinish } = useModalForm<IBill, HttpError, FormValues>({
        action: "create",
        defaultVisible: true,
        resource: "bills",
        redirect: false,
        warnWhenUnsavedChanges: !isOverModal,
    });

    const { selectProps: vendorSelectProps } = useSelect<IContact>({
        resource: "contacts",
        optionLabel: "name",
        optionValue: "id",
        filters: [
            {
                field: "type",
                operator: "eq",
                value: "vendor"
            }
        ]
    });
    const words = ["test", "test2", "test3"];
    const handleAnnotationsChange = (annotations) => {
        console.log('Annotations:', annotations);
      };
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
            title={t("bills.form.add")}
            width="90vw"
            closeIcon={<LeftOutlined />}
        >
            {isScan ? (
                <Form
                    {...formProps}
                    onFinish={async (values) => {
                        console.log(values);
                    }}
                >
                    <ImageAnnotation words={words} onAnnotationsChange={handleAnnotationsChange} />
                </Form>
            ) : (
                <Form
                    {...formProps}
                onFinish={async (values) => {
                    try {
                        const data = await onFinish({
                            date: values.date.toString(),
                            description: values.description,
                            amount: values.amount,
                            status: values.status,
                            due_date: values.due_date.toString(),
                            notes: values.notes,
                            vendor_id: values.vendor_id,
                            attachments: values.attachments
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
                <Row justify={"space-between"} align={"middle"} gutter={18}>
                    <Col span={16}>
                        <Form.Item
                            label={t("bills.fields.description")}
                            name="description"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t("bills.fields.notes")}
                            name="notes"
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={t("bills.fields.date")}
                            name="date"
                            rules={[{ required: true }]}
                            initialValue={dayjs()}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            label={t("bills.fields.due_date")}
                            name="due_date"
                            rules={[{ required: true }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label={t("bills.fields.amount")}
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                step={0.01}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={t("bills.fields.status")}
                            name="status"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Select.Option value="pending">Pending</Select.Option>
                                <Select.Option value="paid">Paid</Select.Option>
                                <Select.Option value="overdue">Overdue</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={t("bills.fields.vendor")}
                            name="vendor_id"
                            rules={[{ required: true }]}
                        >
                            <Select {...vendorSelectProps} />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Form.Item
                    label={t("bills.fields.attachments")}
                    name="attachments"
                    valuePropName="fileList"
                >
                    <Upload
                        listType="picture"
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>
                            {t("bills.fields.upload")}
                        </Button>
                    </Upload>
                </Form.Item>
            </Form>)}
            <Button onClick={() => setIsScan(true)}>Scan</Button>
        </Modal>
    );
}; 