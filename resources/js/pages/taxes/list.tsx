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
    Input, Button
} from "antd";

import { ITax, ITaxFilterVariables } from "../../interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

export const TaxesList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl, createUrl } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();

    const { tableProps, filters, sorters } = useTable<
        ITax,
        HttpError,
        ITaxFilterVariables
    >({
        filters: {
            initial: [
                {
                    field: "name",
                    operator: "contains",
                    value: "",
                },
            ],
        },
        sorters: {
            initial: [
                {
                    field: "id",
                    order: "desc",
                },
            ],
        },
        syncWithLocation: true,
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
                            to: `${createUrl("taxes")}`,
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
                    {t("taxes.form.add")}
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
                        <PaginationTotal total={total} entityName="taxes" />
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
                    title={t("users.fields.name")}
                    defaultFilteredValue={getDefaultFilter(
                        "name",
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
                    key="rate"
                    dataIndex="rate"
                    title={t("taxes.fields.rate")}
                    defaultFilteredValue={getDefaultFilter(
                        "rate",
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
                    render={(value) => {
                        return (
                        <Typography.Text
                        style={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        % {(parseFloat(value) * 100).toFixed(2)}
                        </Typography.Text>
                        )
                    }
                    }
                />
                <Table.Column<ITax>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => {
                                return go({
                                    to: `${showUrl("taxes", record.id)}`,
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
