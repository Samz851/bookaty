import { IAccount } from "@/interfaces";
import { Column, Row } from "@silevis/reactgrid";

  
  export const getColumns = (): Column[] => [
    { columnId: "id", width: 150 },
    { columnId: "name", width: 150 },
    { columnId: "balance", width: 150 }
  ];
  
  const headerRow: Row = {
    rowId: "header",
    cells: [
      { type: "header", text: "id" },
      { type: "header", text: "name" },
      { type: "header", text: "balance" }
    ]
  };

export const getRows = (displayAccounts: IAccount[]): Row[] => [
    headerRow, 
    ...displayAccounts.map<Row>((account, idx) => ({
        rowId: idx,
        cells: [
            {type: 'text', text: account.code},
            {type: 'text', text: account.name},
            {type: 'text', text: account.balance?.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
        ]
    }))
]