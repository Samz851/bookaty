import React, { useEffect, useState } from 'react';
import { theme, Transfer, Tree } from 'antd';
import type { GetProp, TransferProps, TreeDataNode } from 'antd';
import { IAccount, IAccountFilterVariables } from '@/interfaces';
import { HttpError } from '@refinedev/core';
import { useTable } from '@refinedev/antd';
import { Key } from "antd/es/table/interface";


type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

// interface TreeTransferProps {
//   dataSource: TreeDataNode[];
//   targetKeys: TransferProps['targetKeys'];
//   onChange: TransferProps['onChange'];
// }

// Customize Table Transfer
const isChecked = (selectedKeys: React.Key[], eventKey: React.Key) =>
  selectedKeys.includes(eventKey);

const generateTree = (
  treeNodes: TreeDataNode[] = [],
  checkedKeys: any = [],
): TreeDataNode[] =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

const TreeTransfer = () => {
  const { token } = theme.useToken();

  
  const { tableProps, filters, setFilters, sorters } = useTable<
  IAccount,
  HttpError,
  IAccountFilterVariables
>({
  filters: {
      initial: [
          {
              field: "type",
              operator: "eq",
              value: "all",
          }
      ]
  },
  sorters: {
      mode: "off",
  },
  syncWithLocation: true,
  pagination: {
      mode: "off"
    },
});

const [ accounts, setAccounts ] = useState<IAccount[] | undefined>([...tableProps.dataSource as any ?? []]);
const [ expandedAccount, setExpandedAccount ] = useState('');
const [ expandedRows, setExpandedRows ] = useState<Key[]>();
useEffect(()=>{
    console.log(tableProps);
    if ( ! tableProps.loading ) {
        if ( expandedAccount !== '' ) {
            setAccounts((prevAccounts) => {
                const updateAccounts = (accounts) => {
                    return [...(accounts as any)?.map(account => {
                        if ( expandedAccount.startsWith(account.code) ) {
                            if ( expandedAccount === account.code ) {
                                return {
                                    ...account,
                                    children: [...tableProps.dataSource as any]
                                }
                            }
                            if ( expandedAccount.length > account.code.length ) {
                                return {
                                    ...account,
                                    children: updateAccounts(account.children)
                                }
                            }
                        } else {
                            return account;
                        }
                    })]
                }
                return [...updateAccounts(prevAccounts)];

            })
        } else {
            setAccounts([...tableProps.dataSource as any]);
        }
    }

}, [tableProps.dataSource]);

  const transferDataSource: TransferItem[] = [];
  function flatten(list: TreeDataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
//   flatten(dataSource);

  return (
    <Transfer
      targetKeys={expandedRows}
      dataSource={accounts}
      className="tree-transfer"
      render={(item) => item.code!}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...expandedRows as any];
          return (
            <div style={{ padding: token.paddingXS }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={accounts as any}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
              />
            </div>
          );
        }
      }}
    </Transfer>
  );
};

const treeData: TreeDataNode[] = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' },
    ],
  },
  { key: '0-2', title: '0-2' },
  { key: '0-3', title: '0-3' },
  { key: '0-4', title: '0-4' },
];

// const App: React.FC = () => {
//   const [targetKeys, setTargetKeys] = useState<TreeTransferProps['targetKeys']>([]);
//   const onChange: TreeTransferProps['onChange'] = (keys) => {
//     setTargetKeys(keys);
//   };
//   return <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />;
// };

export default TreeTransfer;