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
    bill_number: string;
    date: string;
    due_date: string;
    description: string;
    total_amount: number;
    tax_amount: number;
    currency: string;
    status: string;
    payment_terms: string;
    notes: string;
    vendor_id: number;
    tax_id: number;
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

    const { selectProps: taxSelectProps } = useSelect({
        resource: "taxes",
        optionLabel: "name",
        optionValue: "id",
    });

    const currencies = [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
    ];

    const statuses = [
        { value: 'unpaid', label: 'Unpaid' },
        { value: 'partially_paid', label: 'Partially Paid' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
    ];

    const words = [
        "bill_number",
        "date",
        "due_date",
        "description",
        "total_amount",
        "tax_amount",
        "currency",
        "status",
        "payment_terms",
        "notes",
        "vendor_id",
        "tax_id",
        "attachments"
    ];
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
                            bill_number: values.bill_number,
                            date: values.date.toString(),
                            due_date: values.due_date.toString(),
                            description: values.description,
                            total_amount: values.total_amount,
                            tax_amount: values.tax_amount,
                            currency: values.currency,
                            status: values.status,
                            payment_terms: values.payment_terms,
                            notes: values.notes,
                            vendor_id: values.vendor_id,
                            tax_id: values.tax_id,
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
                            label={t("bills.fields.bill_number")}
                            name="bill_number"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
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
                        <Form.Item
                            label={t("bills.fields.payment_terms")}
                            name="payment_terms"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            label={t("bills.fields.total_amount")}
                            name="total_amount"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                step={0.01}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={t("bills.fields.tax_amount")}
                            name="tax_amount"
                            initialValue={0}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                step={0.01}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={t("bills.fields.currency")}
                            name="currency"
                            initialValue="USD"
                        >
                            <Select options={currencies} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={t("bills.fields.status")}
                            name="status"
                            rules={[{ required: true }]}
                            initialValue="unpaid"
                        >
                            <Select options={statuses} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("bills.fields.vendor")}
                            name="vendor_id"
                            rules={[{ required: true }]}
                        >
                            <Select {...vendorSelectProps} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("bills.fields.tax")}
                            name="tax_id"
                        >
                            <Select {...taxSelectProps} />
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