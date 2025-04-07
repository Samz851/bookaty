import {
    useTranslate,
    HttpError,
    getDefaultFilter, useGo,
    useNavigation
} from "@refinedev/core";
import {
    List,
    useTable, FilterDropdown, CreateButton
} from "@refinedev/antd";
import {
    Table, Typography,
    theme,
    InputNumber,
    Input, Button,
    Row
} from "antd";

import { IAccount, ICompany, IContact } from "@/interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

export const ContactsList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl, createUrl, show } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();

    const { tableProps, filters, sorters } = useTable<
        IContact,
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
            mode: "server",
          },
    });

    return (
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
                            to: `${createUrl("contacts")}`,
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
                    {t("contacts.form.add")}
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
                        <PaginationTotal total={total} entityName="contacts" />
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
                    key="name"
                    dataIndex="name"
                    title={t("contacts.fields.name")}
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
                <Table.Column
                    key="email"
                    dataIndex="email"
                    title={t("contacts.fields.email")}
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
                    key="phone_number"
                    dataIndex="phone_number"
                    title={t("contacts.fields.phone_number")}
                />
                <Table.Column
                    key="type"
                    dataIndex="type"
                    title={t("contacts.fields.type")}
                />
                <Table.Column<ICompany>
                    key="company"
                    dataIndex={["company"]}
                    title={t("contacts.fields.company")}
                    render={(value) => (
                        <Typography.Link
                        strong
                        onClick={() => show("companies", value.id, "push")}
                        style={{
                            whiteSpace: "nowrap",
                            color: token.colorTextHeading,
                        }}
                    >
                        #{value?.company_name}
                    </Typography.Link>
                    )}
                />
                <Table.Column<IAccount[]>
                    key="accounts"
                    dataIndex={["accounts"]}
                    title={t("contacts.fields.accounts")}
                    render={(value: IAccount[]) =>
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
                />
                
                <Table.Column<ICompany>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => {
                                return go({
                                    to: `${showUrl("contacts", record.id)}`,
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
                    )}
                />
            </Table>
            {children}
        </List>
    );
};
