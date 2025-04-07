import {
    useTranslate, useGo,
    useNavigation,
    useList
} from "@refinedev/core";
import {
    List, CreateButton
} from "@refinedev/antd";
import {
    Typography,
    theme, Button, Tree,
    Flex
} from "antd";

import { useStyles } from "./styled";
import { IAccountsBranch } from "@/interfaces";
import { DownCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { DataNode } from "antd/es/tree";

type AccountsBranchesTree = IAccountsBranch & DataNode;

export const AccountsBranchesList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { styles } = useStyles();
    const { pathname } = useLocation();
    const { show, createUrl } = useNavigation();
    const t = useTranslate();
    const { token } = theme.useToken();
    const { data } = useList<AccountsBranchesTree>({
        resource: "branches",
        filters: [
            {
                field: 'tree',
                operator: 'eq',
                value: true
            }
        ]
    });

    const accountTypes = data?.data ?? [{
        key: 1,
        title: t('branches.form.first'),
        id: 1,
        name: '',
        description: '',
        code: '0000'
    }];


    const addType = (parent?) => {
        return go({
            to: `${createUrl("branches")}`,
            query: {
                to: pathname,
                parent: parent
            },
            options: {
                keepQuery: true,
            },
            type: "replace",
        });
    }

    return (
        <List
            breadcrumb={false}
            headerButtons={(props) => [
                // // <ExportButton key={useId()} onClick={triggerExport} loading={isLoading} />,
                <CreateButton
                    {...props.createButtonProps}
                    key="create"
                    size="large"
                    onClick={() => addType()}
                >
                    {t("branches.form.add")}
                </CreateButton>,
            ]}
        >
            <Tree
                className={styles.treeNode}
                selectable={false}
                defaultExpandAll={true}
                blockNode={true}
                switcherIcon={<DownCircleOutlined />}
                showLine={false}
                treeData={accountTypes as any}
                titleRender={(item) =>
                    <Flex justify="space-between">
                        <Typography.Link
                        strong
                        onClick={() => show("branches", item.key as any, "push")}
                        style={{
                            whiteSpace: "nowrap",
                            color: token.colorTextHeading,
                        }}
                        >
                            {item?.title as any}
                        </Typography.Link>
                        <Button
                            icon={<PlusCircleOutlined/>}
                            onClick={() => addType(item.key)} 
                        />
                    </Flex>
                }
            />
           
            {children}
        </List>
    );

};
