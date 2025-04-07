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
    Row,
    DatePicker
} from "antd";

import { IAccount, ITransaction, ITransactionFilterVariables } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

export const TransactionsList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl, create, show } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();

    const { tableProps, filters, sorters } = useTable<
        ITransaction,
        HttpError,
        ITransactionFilterVariables
    >({
        filters: {
            initial: [

            ]
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
                // <ExportButton key={useId()} onClick={triggerExport} loading={isLoading} />,
                <CreateButton
                    {...props.createButtonProps}
                    key="create"
                    size="large"
                    onClick={() => create("transactions", "push")}
                >
                    {t("transactions.form.add")}
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
                        <PaginationTotal total={total} entityName="transactions" />
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
                    key="date"
                    dataIndex="date"
                    title={t("transactions.fields.date")}
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
                    title={t("transactions.fields.description")}
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
                    key="amount"
                    dataIndex={["amount"]}
                    title={t("transactions.fields.amount")}
                />
                <Table.Column<IAccount[]>
                    key="debit_account"
                    dataIndex={["debit_accounts"]}
                    title={t("transactions.fields.debit_account")}
                    render={(value) =>
                            value.map((account) => (
                                <Row key={account?.id}>
                                    <Typography.Text
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ({account.id}) {account?.name}
                                    </Typography.Text>
                                </Row>
                            ))
                    }
                />
                <Table.Column<IAccount>
                    key="credit_account"
                    dataIndex={["credit_accounts"]}
                    title={t("transactions.fields.credit_account")}
                    render={(value) =>
                        value.map((account) => (
                            <Row key={account?.id}>
                                <Typography.Text
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    ({account.id}) {account?.name}
                                </Typography.Text>
                            </Row>
                        ))
                    }
                />
                <Table.Column
                    key="notes_pr"
                    dataIndex={["noteable", "id"]}
                    title={t("transactions.fields.notes_pr")}
                />
                <Table.Column<ITransaction>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => show("transactions", record.code, 'push')}
                        />
                    )}
                />
            </Table>
            {children}
        </List>
    );
};
