import React, { useState } from "react";
import ControlledTable from "./ControlledTable";

const COLUMN_DEFS = [
    {
      headerName: "Name",
      field: "name",
      flex: 2
    },
    {
      headerName: "Value",
      field: "value",
      flex: 1
    }
  ];
  
  const ROWS_PER_PAGE = 10;
  const TOTAL_ROWS = 100;
  
  const delay = (callback, delay = 1000) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve(callback());
      }, delay)
    );

export default function DemoPaginationTable() {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
  
    const getRows = (numRows, startRow) =>
      delay(
        () =>
          [...Array(numRows)].map((item, i) => ({
            name: (Math.random() + 1).toString(36).substring(7),
            value: startRow + i
          })),
        1000
      );

    return (
        <ControlledTable
            rows={rows}
            columnDefs={COLUMN_DEFS}
            getRows={getRows}
            totalCount={TOTAL_ROWS}
            onChange={setRows}
            onPageNumberChange={setPageNumber}
            pageSize={ROWS_PER_PAGE}
            pageNumber={pageNumber}
            pagination={true}
            getRowNodeId={(data) => data?.name || data?.index}
        />
    )
}