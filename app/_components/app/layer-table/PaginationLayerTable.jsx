import React, { useState } from "react";
import ControlledTable from "./ControlledTable";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
const ROWS_PER_PAGE = 10;

export default function PaginationLayerTable() {
  const [rows, setRows] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [columnDefs, setColumnDefs] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const { layerInfo } = useMapViewStore();
  const getRows = async (numRows, startRow) => {
    try {
      const response = await fetch(
        `/api/layers/get-layer-table-data?layerUid=${layerInfo.layerUid}&offset=${startRow}&length=${numRows}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setTotalRows(data.totalData);
      setColumnDefs(
        Object.keys(data.data[0] || {}).map((key) => ({
          headerName: key,
          field: key,
        }))
      );
      return data.data;
    } catch (error) {
      console.error("Error fetching rows:", error);
    }
  };
  return (
    <ControlledTable
      rows={rows}
      columnDefs={columnDefs}
      getRows={getRows}
      totalCount={totalRows}
      onChange={setRows}
      onPageNumberChange={setPageNumber}
      pageSize={ROWS_PER_PAGE}
      pageNumber={pageNumber}
      pagination={true}
      getRowNodeId={(data) => data?.name || data?.index}
    />
  );
}
