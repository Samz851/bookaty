import {
    useTranslate,
    HttpError,
    getDefaultFilter,
    useExport,
    useGo,
    useNavigation,
} from "@refinedev/core";
import {
    List,
    useTable,
    FilterDropdown,
    ExportButton,
    CreateButton,
    CloneButton,
    useModalForm,
} from "@refinedev/antd";
import {
    Table,
    Typography,
    theme,
    InputNumber,
    Input,
    Button,
    Row,
    Popconfirm,
    Modal,
    Form,
    DatePicker,
} from "antd";

import { IFormula, IReport } from "@/interfaces";
import { EyeOutlined, FileTextOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components";
import { PropsWithChildren, useId, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dayjs } from "dayjs";
import { clone } from "lodash";

type FormValues = {
    cycle?: Dayjs[] | undefined;
    from?: string | undefined;
    to?: string | undefined;
    template_id?: any;
}
export const FormulasList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl, createUrl, cloneUrl, clone, show,edit, editUrl } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();

    const [ selected, setSelected] = useState();

    const onPublishClick = (record) => {
        setSelected(record);
        cloneModalShow()
    }

    const {
        modalProps: cloneModalProps,
        formProps: cloneFormProps,
        show: cloneModalShow,
        close,
        onFinish
      } = useModalForm<IReport, HttpError, FormValues>({
        action: "create",
        resource: "reports",
        redirect: "edit",
        
      });

    const { tableProps, filters, sorters } = useTable<
        IFormula,
        HttpError
    >({
        filters: {
            mode: "off",
        },
        sorters: {
            mode: "off",
        },
        syncWithLocation: true,
        pagination: {
            mode: "off",
          },
    });

    return (
        <>
        <List
            breadcrumb={false}
            headerButtons={(props) => [
                // <ExportButton key={useId()} onClick={triggerExport} loading={isLoading} />,
                <CreateButton
                    {...props.createButtonProps}
                    key="create"
                    size="large"
                    onClick={() => {
                        return go({
                            to: `${createUrl("formula")}`,
                            query: {
                                to: pathname,
                            },
                            options: {
                                keepQuery: true,
                            },
                            type: "replace",
                        });
                    }}
                >
                    {t("companies.form.add")}
                </CreateButton>,
            ]}
        >
            <Table
                {...tableProps}
                rowKey="id"
                scroll={{ x: true }}
                pagination={{
                    ...tableProps.pagination,
                    showTotal: (total) => (
                        <PaginationTotal total={total} entityName="statements" />
                    ),
                }}
            >
                <Table.Column
                    key="id"
                    dataIndex="id"
                    title="ID #"
                    render={(value) => (
                        <Typography.Text
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            #{value}
                        </Typography.Text>
                    )}
                    filterIcon={(filtered) => (
                        <SearchOutlined
                            style={{
                                color: filtered
                                    ? token.colorPrimary
                                    : undefined,
                            }}
                        />
                    )}
                    defaultFilteredValue={getDefaultFilter(
                        "orderNumber",
                        filters,
                        "eq",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <InputNumber
                                addonBefore="#"
                                style={{ width: "100%" }}
                                placeholder={t("orders.filter.id.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="title"
                    dataIndex="title"
                    title={t("companies.fields.name")}
                    defaultFilteredValue={getDefaultFilter(
                        "date",
                        filters,
                        "contains",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                style={{ width: "100%" }}
                                placeholder={t("users.filter.name.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                {/* <Table.Column
                    key="currency"
                    dataIndex="currency"
                    title={t("companies.fields.currency")}
                    defaultFilteredValue={getDefaultFilter(
                        "description",
                        filters,
                        "contains",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                style={{ width: "100%" }}
                                placeholder={t("users.filter.gsm.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="contact_information"
                    dataIndex="contact_information"
                    title={t("companies.fields.contact_information")}
                />
                <Table.Column
                    key="address"
                    dataIndex="address"
                    title={t("companies.fields.address")}
                /> */}
                {/* <Table.Column<IAccount[]>
                    key="accounts"
                    dataIndex={["contacts", "accounts"]}
                    title={t("companies.fields.accounts")}
                    render={(_,value) =>
                        value.map(child => (
                            <Row key={child?.id}>

                                <Typography.Text
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    ({child.id}) {child?.name}
                                </Typography.Text>
                            </Row>
                        ))
                    }
                /> */}
                {/* <Table.Column<IContact[]>
                    key="contacts"
                    dataIndex={["contacts"]}
                    title={t("companies.fields.contacts")}
                    render={(value: IContact[]) =>
                        value.map(child => (
                            <Row key={child?.id}>

                                <Typography.Text
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    ({child.id}) {child?.name}
                                </Typography.Text>
                            </Row>
                        ))
                    }
                /> */}
                {/* <Table.Column
                    key="createdAt"
                    dataIndex="createdAt"
                    title={t("users.fields.createdAt")}
                    render={(value) => <DateField value={value} format="LLL" />}
                    sorter
                />
                <Table.Column
                    key="isActive"
                    dataIndex="isActive"
                    title={t("users.fields.isActive.label")}
                    render={(value) => {
                        return <UserStatus value={value} />;
                    }}
                    sorter
                    defaultSortOrder={getDefaultSortOrder("isActive", sorters)}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{ width: "100%" }}
                                placeholder={t(
                                    "users.filter.isActive.placeholder",
                                )}
                            >
                                <Select.Option value="true">
                                    {t("users.fields.isActive.true")}
                                </Select.Option>
                                <Select.Option value="false">
                                    {t("users.fields.isActive.false")}
                                </Select.Option>
                            </Select>
                        </FilterDropdown>
                    )}
                /> */}
                <Table.Column<IFormula>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <>
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => {
                                return go({
                                    to: `${showUrl("formula", record.id)}`,
                                    query: {
                                        to: pathname,
                                    },
                                    options: {
                                        keepQuery: true,
                                    },
                                    type: "push",
                                });
                            }}
                        />
                        <Button
                            icon={<FileTextOutlined />}
                            // recordItemId={record.id}
                            onClick={() => onPublishClick(record.id)}
                        />
                        </>
                        
                    )}
                />
            </Table>
            {children}
        </List>
        <Modal {...cloneModalProps}>
        <Form {...cloneFormProps} layout="vertical"
        onFinish={async (values) => {
            console.log(values);
            try {
                // const data = await onFinish({
                //     from: values.cycle?.[0]?.format('YYYY/MM/DD').toString() || '',
                //     to: values.cycle?.[1]?.format('YYYY/MM/DD').toString() || '',
                //     template_id: selected
                // });
                const data = await cloneFormProps?.onFinish?.({
                    from: values.cycle?.[0]?.format('YYYY/MM/DD').toString() || '',
                    to: values.cycle?.[1]?.format('YYYY/MM/DD').toString() || '',
                    template_id: selected,
                });
                if (data) {
                    console.log(data)
                    const rec = data as any;

                    console.log(editUrl("reports",rec.data.id))
                    // editUrl('reports', data.data.id);
                    // go({
                    //     to: `${editUrl("reports",rec.data.id)}`,
                    //     // query: {
                    //     //     to: pathname,
                    //     // },
                    //     options: {
                    //         keepQuery: true,
                    //     },
                    //     type: "replace",
                    // });
                }
                // close();
                // go({
                //     to:
                //         searchParams.get("to") ??
                //         getToPath({
                //             action: "list",
                //         }) ??
                //         "",
                //     query: {
                //         to: undefined,
                //     },
                //     options: {
                //         keepQuery: true,
                //     },
                //     type: "replace",
                // });

            } catch (error) {
                console.log(error);
                Promise.reject(error);
            }
        }}
        >
        <Form.Item
                    label="cycle"
                    name="cycle"
                    rules={[{ required: true }]}
                >
                    <DatePicker.RangePicker/>
                </Form.Item>
          <Form.Item
            label="template_id"
            name="template_id"
            hidden={true}
            initialValue={selected}
            >
                <Input />
            </Form.Item>
        </Form>
        </Modal>
        </>
    );
};
