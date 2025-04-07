import {
  useTranslate, useGo,
  useNavigation,
  useList
} from "@refinedev/core";
import {
  List, CreateButton
} from "@refinedev/antd";

import { IAccount } from "../../interfaces";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
// import { ReactGrid } from "@silevis/reactgrid";
import { Loader, Table } from 'rsuite';
import { RowDataType } from "rsuite/esm/Table";
// import "@silevis/reactgrid/styles.css";
import "rsuite/Table/styles/index.css";

const { Column, HeaderCell, Cell } = Table;

type AccountsTreeData = IAccount & RowDataType;
export const DisplayAccountsList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { createUrl } = useNavigation();
    const t = useTranslate();

    const { data } = useList<AccountsTreeData>({
        resource: "accounts",
        filters: [
            {
                field: 'tree',
                operator: 'eq',
                value: true
            }
        ]
    })

    const accounts = data?.data || [];

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
                            to: `${createUrl("accounts")}`,
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
                    {t("accounts.form.add")}
                </CreateButton>,
            ]}
        >
            <Table
      isTree
      defaultExpandAllRows
      bordered
      cellBordered
      rowKey="code"
      height={400}
      data={accounts as any}
      /** shouldUpdateScroll: whether to update the scroll bar after data update **/
      shouldUpdateScroll={false}
      onExpandChange={(isOpen, rowData) => {
        console.log(isOpen, rowData);
      }}
      renderTreeToggle={(icon, rowData) => {
        if (rowData?.children && rowData.children.length === 0) {
          return <Loader />;
        }
        return icon;
      }}
    >
      <Column flexGrow={1}>
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="name" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Code</HeaderCell>
        <Cell dataKey="code" />
      </Column>
      <Column flexGrow={3}>
        <HeaderCell>Description</HeaderCell>
        <Cell dataKey="description" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Balance</HeaderCell>
        <Cell dataKey="balance" />
      </Column>
    </Table>
            {children}
        </List>
    );
};
