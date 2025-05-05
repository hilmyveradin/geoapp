import React, { useEffect, useCallback, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-material.css";
import useZoomToLayer from "@/helpers/hooks/useZoomToLayer";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import "./styles.css";

const LoadingBlock = ({ getRows, pageSize, startRow, onLoaded }) => {
  const [rows, setRows] = useState();

  useEffect(() => {
    let cleaningUp;
    getRows(pageSize, startRow).then((rows) => {
      if (cleaningUp) {
        return;
      }
      setRows(rows);
    });
    return () => {
      cleaningUp = true;
    };
  }, [getRows, pageSize, startRow]);

  useEffect(() => {
    if (!rows) {
      return;
    }
    onLoaded(rows, startRow);
  }, [onLoaded, rows, startRow]);

  return null;
};

const ControlledTable = ({
  rows,
  totalCount,
  getRows,
  onChange,
  onApiAvailable,
  onPageNumberChange,
  pagination,
  pageSize,
  pageNumber,
  components,
  columnDefs,
  getRowNodeId,
}) => {
  const [gridApi, setGridApi] = useState();
  const [loadingBlocks, setLoadingBlocks] = useState([]);
  let paginationProps = {};
  const { layerInfo, setZoomedLayerBbox, setHighlightedLayer } =
    useMapViewStore();
  useZoomToLayer();
  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitCellContents",
    };
  }, []);

  if (pagination) {
    paginationProps = {
      pagination,
      paginationPageSize: pageSize,
      cacheBlockSize: pageSize,
      paginationPageSizeSelector: false,
    };
  }

  const getPlaceholderItems = (startRow, length) => {
    const items = [];
    for (let index = startRow; index < length; index += 1) {
      items.push({ index, placeholder: true });
    }
    return items;
  };

  const isPlaceholder = useCallback(
    (i) => !rows[i] || rows[i].placeholder,
    [rows]
  );

  const needsLoading = useCallback(
    (startRow) => {
      if (!rows?.length) {
        // We need to load if rows are completely empty
        return true;
      }
      const max = Math.min(startRow + pageSize, rows.length);
      for (let i = startRow; i < max; i += 1) {
        if (isPlaceholder(i)) {
          return true;
        }
      }
    },
    [rows, pageSize, isPlaceholder]
  );

  if (rows?.length < totalCount) {
    // Optimization when rendering a lot of rows
    if (totalCount > 100000) {
      const quotient = parseInt(totalCount / 100000);
      for (let index = 0; index < quotient; index++) {
        rows.splice(
          rows.length,
          0,
          ...getPlaceholderItems(rows.length, 100000 * (index + 1))
        );
      }
    }
    rows.splice(
      rows.length,
      0,
      ...getPlaceholderItems(rows.length, totalCount)
    );
  }

  useEffect(() => {
    if (!gridApi || isNaN(pageNumber)) {
      return;
    }
    const currentPage = gridApi.paginationGetCurrentPage();
    if (pageNumber === currentPage) {
      return;
    }
    gridApi.paginationGoToPage(pageNumber);
  }, [gridApi, pageNumber]);

  const onGridReady = useCallback(
    ({ api }) => {
      setGridApi(api);
      if (onApiAvailable) {
        onApiAvailable(api);
      }
    },
    [onApiAvailable]
  );

  const onLoaded = useCallback(
    (newRows, startRow) => {
      // We've loaded the block. Update the rows array
      let rowsCopy = [...rows];
      rowsCopy.splice(startRow, pageSize, ...newRows);
      const newLoadingBlocks = [...loadingBlocks];
      newLoadingBlocks.splice(newLoadingBlocks.indexOf(startRow), 1);
      setLoadingBlocks(newLoadingBlocks);
      onChange(rowsCopy);
    },
    [rows, pageSize, loadingBlocks, onChange]
  );

  const onPaginationChanged = useCallback(
    ({ newPage }) => {
      if (!gridApi || !newPage) {
        return;
      }
      const currentPage = gridApi.paginationGetCurrentPage();
      if (onPageNumberChange) {
        onPageNumberChange(currentPage);
      }
    },
    [gridApi, onPageNumberChange]
  );

  useEffect(() => {
    if (!gridApi) {
      return;
    }
    // Kalau pake totalCount === 0, pas loading dianggap no rows, padahal masih nunggu request API
    // Di JS, kalau variabel integer nggak didefinisikan, otomatis dikasih nilai 0.
    if (totalCount === -1) {
      gridApi.showNoRowsOverlay();
    } else if (loadingBlocks.includes(pageNumber * pageSize)) {
      gridApi.showLoadingOverlay();
    } else {
      gridApi.hideOverlay();
    }
  }, [gridApi, pageNumber, pageSize, loadingBlocks, totalCount]);

  useEffect(() => {
    const startRow = pageNumber * pageSize;
    if (!loadingBlocks.includes(startRow) && needsLoading(startRow)) {
      // We haven't started loading the block yet. Start loading it
      setLoadingBlocks([...loadingBlocks, startRow]);
    }
  }, [loadingBlocks, pageNumber, pageSize, needsLoading]);

  const onSelectionChanged = useCallback(() => {
    var selectedRows = gridApi.getSelectedRows();
    // var response;
    const arrObjectId = [];
    selectedRows.forEach(function (selectedRow, index) {
      const id = parseInt(Object.values(selectedRow)[0]);
      arrObjectId.push(id);
    });
    async function zoomToSelectedObjects() {
      try {
        const body = {
          layerUid: layerInfo.layerUid,
          objectid: arrObjectId,
        };
        const response = await fetch("/api/maps/zoom-to-object", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        setZoomedLayerBbox(data.bbox);
        setHighlightedLayer(data.data);
      } catch (error) {
        console.log(error);
      }
    }
    if (selectedRows.length != 0) {
      zoomToSelectedObjects();
    }
  });
  const rowHeight = 25;
  const headerHeight = 30;
  return (
    <div
      aria-live="polite"
      aria-busy={loadingBlocks.includes(pageNumber * pageSize)}
      className="ag-theme-material-custom"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        components={components}
        rowData={rows}
        rowCount={totalCount}
        serverSideStoreType={"partial"}
        rowModelType={"clientSide"}
        onPaginationChanged={onPaginationChanged}
        getRowNodeId={getRowNodeId}
        onGridReady={onGridReady}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        autoSizeStrategy={autoSizeStrategy}
        rowSelection={"multiple"}
        onSelectionChanged={onSelectionChanged}
        {...paginationProps}
      />
      {loadingBlocks.map((startRow) => (
        <LoadingBlock
          key={`loadingBlock:${startRow}`}
          getRows={getRows}
          startRow={startRow}
          pageSize={pageSize}
          onLoaded={onLoaded}
        />
      ))}
    </div>
  );
};

export default ControlledTable;
