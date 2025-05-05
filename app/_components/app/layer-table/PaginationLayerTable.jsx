import React, { useState, useEffect } from "react";
import ControlledTable from "./ControlledTable";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import useTableQueryStore from "@/helpers/hooks/store/useTableQueryStore";
const ROWS_PER_PAGE = 10;

export default function PaginationLayerTable() {
  const [rows, setRows] = useState([]);
  const [rowsFTS, setRowsFTS] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [totalRowsFTS, setTotalRowsFTS] = useState(0);
  const [columnDefs, setColumnDefs] = useState([]);
  const { layerInfo } = useMapViewStore();
  const {
    ftsQuery, 
    searchSubmit, 
  } = useTableQueryStore();
  const [ftsQueryBody, setFtsQueryBody] = React.useState({
    fts_input: null,
    with_geom: 'false',
    offset: 0,
    length: 0,
  });

  useEffect(() => {
    const handleFtsQueryChange = () => {
      if (ftsQuery) {
        setFtsQueryBody({
          fts_input: ftsQuery.value,
          with_geom: false,
        });
      }
    };

    handleFtsQueryChange();
  }, [ftsQuery]);
  
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

  const getRowsFTS = async (numRows, startRow) => {
    try {
      const body = JSON.stringify({
        fts_input: ftsQuery.value,
        with_geom: false,
        offset: startRow,
        length: numRows,
      })
      const response = await fetch(
        `/api/layers/get-fts-query-data?layerUid=${layerInfo.layerUid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.msg.includes("FTS query successful")) {
        setTotalRows(data.totalData);
        setColumnDefs(
          Object.keys(data.data[0] || {}).map((key) => ({
            headerName: key,
            field: key,
          }))
        );
        return data.data;
      }
      else {
        setTotalRows(-1);
        return null;
      }
    } catch (error) {
      console.error("Error fetching rows:", error);
    }
  };
  return (
    <ControlledTable
      rows={(searchSubmit && ftsQuery && ftsQuery.value !== '') ? rowsFTS : rows}
      columnDefs={columnDefs}
      getRows={(searchSubmit && ftsQuery && ftsQuery.value !== '') ? getRowsFTS : getRows}
      totalCount={(searchSubmit && ftsQuery && ftsQuery.value !== '') ? totalRowsFTS : totalRows}
      onChange={(searchSubmit && ftsQuery && ftsQuery.value !== '') ? setRowsFTS : setRows}
      onPageNumberChange={setPageNumber}
      pageSize={ROWS_PER_PAGE}
      pageNumber={pageNumber}
      pagination={true}
      getRowNodeId={(data) => data?.name || data?.index}
    />
  );
}
