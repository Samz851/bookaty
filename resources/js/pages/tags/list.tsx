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

import { IAccount, ITag, ITransaction, ITransactionFilterVariables } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

export const TagsList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl, create, show } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();

    const { tableProps, filters, sorters } = useTable<
        ITag,
        HttpError
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
                    onClick={() => create("tags", "push")}
                >
                    {t("tags.form.add")}
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
                        <PaginationTotal total={total} entityName="tags" />
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
                    key="label"
                    dataIndex="label"
                    title={t("tags.fields.label")}
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
                    dataIndex="description"
                    title={t("tags.fields.description")}
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
                <Table.Column<ITag>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => show("tags", record.id, 'push')}
                        />
                    )}
                />
            </Table>
            {children}
        </List>
    );
};
