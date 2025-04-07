import { IAccountsBranch } from '@/interfaces';
import Tree from 'rsuite/Tree';
import 'rsuite/Tree/styles/index.css';
import { ItemDataType } from 'rsuite/esm/@types/common';
import { PropsWithChildren, useRef } from 'react';
import { useGo, useList, useNavigation, useTranslate } from '@refinedev/core';
import { useLocation } from 'react-router-dom';
import { CreateButton, List } from '@refinedev/antd';
import { Button, Flex, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useStyles } from './styled';

type AccountsBranchesTree = IAccountsBranch & ItemDataType;

export const AccountsBranchesListPage = () => {
    const treeRef = useRef<HTMLInputElement>(null);
    const go = useGo();
    const { pathname } = useLocation();
    const { show, createUrl } = useNavigation();
    const t = useTranslate();
    const { styles } = useStyles();
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

    const branches = data?.data ?? [];

    console.log(branches.length, branches)

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
                data={branches} 
                ref={treeRef}
                defaultExpandAll
                virtualized
                renderTreeNode={(item) => 
                    <Flex justify='space-between'>
                        <Typography.Link
                            strong
                            onClick={() => show('branches', item.key as any, "push")}
                        >
                            {item.label}
                        </Typography.Link>
                        {
                            item.tree_path.split('->').length < 5 &&
                            <Button
                                icon={<PlusCircleOutlined/>}
                                onClick={() => addType(item.value)}
                            />
                        }

                    </Flex> 
                }
            />
            {/* {children} */}
        </List>
    )
}