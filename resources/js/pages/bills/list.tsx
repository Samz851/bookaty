import {
    useTranslate,
    HttpError,
    getDefaultFilter,
    useGo,
    useNavigation
} from "@refinedev/core";
import {
    List,
    useTable,
    FilterDropdown,
    CreateButton
} from "@refinedev/antd";
import {
    Table,
    Typography,
    theme,
    InputNumber,
    Input,
    Button,
    Row,
    DatePicker
} from "antd";

import { IBill, IBillFilterVariables } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

export const BillsList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl, create, show } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();

    const { tableProps, filters, sorters } = useTable<
        IBill,
        HttpError,
        IBillFilterVariables
    >({
        filters: {
            initial: []
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
        <List
            breadcrumb={false}
            headerButtons={(props) => [
                <CreateButton
                    {...props.createButtonProps}
                    key="create"
                    size="large"
                    onClick={() => create("bills", "push")}
                >
                    {t("bills.form.add")}
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
                        <PaginationTotal total={total} entityName="bills" />
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
                        "id",
                        filters,
                        "eq",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <InputNumber
                                addonBefore="#"
                                style={{ width: "100%" }}
                                placeholder={t("bills.filter.id.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="date"
                    dataIndex="date"
                    title={t("bills.fields.date")}
                    defaultFilteredValue={getDefaultFilter(
                        "date",
                        filters,
                        "gte",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <DatePicker />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="description"
                    dataIndex={["description"]}
                    title={t("bills.fields.description")}
                    defaultFilteredValue={getDefaultFilter(
                        "description",
                        filters,
                        "contains",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input
                                style={{ width: "100%" }}
                                placeholder={t("bills.filter.description.placeholder")}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    key="amount"
                    dataIndex={["amount"]}
                    title={t("bills.fields.total_amount")}
                />
                <Table.Column
                    key="status"
                    dataIndex={["status"]}
                    title={t("bills.fields.status")}
                />
                <Table.Column
                    key="due_date"
                    dataIndex={["due_date"]}
                    title={t("bills.fields.due_date")}
                    defaultFilteredValue={getDefaultFilter(
                        "due_date",
                        filters,
                        "gte",
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <DatePicker />
                        </FilterDropdown>
                    )}
                />
                <Table.Column<IBill>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => show("bills", record.id, 'push')}
                        />
                    )}
                />
            </Table>
            {children}
        </List>
    );
}; 