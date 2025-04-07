import React, { useRef, useEffect } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { HotTable, HotTableClass } from "@handsontable/react";
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();

const ExcelTable: React.FC = () => {
  const hotTableRef = useRef<HotTableClass>(null);
  const data: Handsontable.CellValue[][] = [
    ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
    ['2019', 10, 11, 12, 13],
    ['2020', 20, 11, 14, 13],
    ['2021', 30, 15, 12, 13],
  ];

//   useEffect(() => {
//     const hot = new Handsontable(hotTableRef.current!.hotInstance!, {
//       data: Handsontable.helper.createSpreadsheetData(10, 10),
//       rowHeaders: true,
//       colHeaders: true,
//       contextMenu: true,
//       formulas: true,
//       licenseKey: "non-commercial-and-evaluation" // for non-commercial use
//     });

//     return () => hot.destroy();
//   }, []);

  return (
    <div>
      <h1>Excel Style Table</h1>
      <HotTable 
            data={data}
            rowHeaders={true}
            colHeaders={true}
            contextMenu={true}
            formulas={{
              engine: HyperFormula,
            }}
            licenseKey="non-commercial-and-evaluation"
      ref={hotTableRef} />
    </div>
  );
};

export default ExcelTable;
