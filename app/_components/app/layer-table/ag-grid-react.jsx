'use strict';

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import React, { StrictMode, useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

export const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'athlete',
      minWidth: 170,
    },
    { field: 'age' },
    { field: 'country' },
    { field: 'year' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ]);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Group',
      minWidth: 170,
      field: 'athlete',
      valueGetter: (params) => {
        if (params.node.group) {
          return params.node.key;
        } else {
          return params.data[params.colDef.field];
        }
      },
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const rowHeight = 25;
  const headerHeight = 30;
  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className={
          "ag-theme-quartz"
        }
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true}
          groupSelectsChildren={true}
          rowSelection={'multiple'}
          rowGroupPanelShow={'always'}
          pivotPanelShow={'always'}
          pagination={true}
          onGridReady={onGridReady}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
        />
      </div>
    </div>
  );
};

    // Row Data: The data to be displayed.
    // const [rowData, setRowData] = useState([
    //   { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    //   { make: "Ford", model: "F-Series", price: 33850, electric: false },
    //   { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    // ]);
    
    // // Column Definitions: Defines the columns to be displayed.
    // const [colDefs, setColDefs] = useState([
    //   { field: "make" },
    //   { field: "model" },
    //   { field: "price" },
    //   { field: "electric" }
    // ]);
  
    // // ...
    // const rowHeight = 20;
    // return (
    //     // wrapping container with theme & size
    //     <div
    //      className="ag-theme-quartz" // applying the grid theme
    //      style={{ height: 150 }} // the grid will fill the size of the parent container
    //     >
    //       <AgGridReact
    //           rowData={rowData}
    //           columnDefs={colDefs}
    //           rowHeight={rowHeight}
    //       />
    //     </div>
    //   )
  // }
  