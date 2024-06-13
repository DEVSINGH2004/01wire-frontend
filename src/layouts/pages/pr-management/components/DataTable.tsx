import { useMemo, useEffect, useState } from "react";
// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";


// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";

// Material Dashboard 2 PRO React TS examples components
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

// Declaring props types for DataTable
interface Props {
  entriesPerPage?:
    | false
    | {
        defaultValue: number;
        entries: number[];
      };
  canSearch?: boolean;
  showTotalEntries?: boolean;
  table: {
    columns?: { [key: string]: any }[];
    rows: { [key: string]: any }[];
  };
  pagination?: {
    variant: "contained" | "gradient";
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  };
  isSorted?: boolean;
  noEndBorder?: boolean;
  showHeader?: boolean;
}

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
  showHeader,
}: Props): JSX.Element {
  let defaultValue: any;
  let entries: any[];

  if (entriesPerPage) {
    defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : "10";
    entries = entriesPerPage.entries ? entriesPerPage.entries : ["10", "25", "50", "100"];
  }

  const columns = useMemo<any>(() => table?.columns, [table]) || [];
  const data = useMemo<any>(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  // useTable({ columns, data: data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  }: any = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value: any) => setPageSize(value);

  // Render the paginations
  const renderPagination = pageOptions.map((option: any) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }: any) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option: any) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }: any) => gotoPage(Number(value.value - 1));

  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }
  return (
    <>
    <Card sx={{ minHeight: "300px" }}>
    <TableContainer sx={{ boxShadow: "none" }}>
      <Table {...getTableProps()}>
        {showHeader && (
          <MDBox component="thead" bgColor="#F8F8FC">
            {headerGroups.map((headerGroup: any, key: any) => (
              <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, key: any) => (
                  
                    <MDBox
                    key={key}
                      
      component="th"
      width={column.width ? column.width : "auto"}
      py={1.5}
      px={2}
   
    >
      <MDBox
        position="relative"
                        textAlign={column.align}
      align={column.align ? column.align : "left"}
                        
        color="#606F7B"
        sx={() => ({
          fontSize: "14px",
          fontWeight: "400"
        })}
      >
                           {column.render("Header")}
      </MDBox>
    </MDBox>
                ))}
              </TableRow>
            ))}
          </MDBox>
        )}
        <TableBody {...getTableBodyProps()}>
          {page.map((row: any, key: any) => {
            prepareRow(row);
            return (
              <TableRow key={key} {...row.getRowProps()}>
                {row.cells.map((cell: any, key: any) => (
                  <DataTableBodyCell
                    key={key}
                    noBorder={noEndBorder && rows.length - 1 === key}
                    align={cell.column.align ? cell.column.align : "left"}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </DataTableBodyCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      </TableContainer>
  </Card>
      
       <MDBox
       display="flex"
       flexDirection={{ xs: "column", sm: "row" }}
       justifyContent="space-between"
       alignItems={{ xs: "flex-start", sm: "center" }}
       p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
     >
       {pageOptions.length > 1 && (
         <MDPagination
           variant={pagination.variant ? pagination.variant : "gradient"}
           color={pagination.color ? pagination.color : "info"}
         >
           {canPreviousPage && (
             <MDPagination item onClick={() => previousPage()}>
               <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
             </MDPagination>
           )}
           {renderPagination.length > 6 ? (
             <MDBox width="5rem" mx={1}>
               <MDInput
                 inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                 value={customizedPageOptions[pageIndex]}
                 onChange={(event: any) => {
                   handleInputPagination(event);
                   handleInputPaginationValue(event);
                 }}
               />
             </MDBox>
           ) : (
             renderPagination
           )}
           {canNextPage && (
             <MDPagination item onClick={() => nextPage()} variant="gradient">
               <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
             </MDPagination>
           )}
         </MDPagination>
       )}
      </MDBox>
      </>
  );
}

// Declaring default props for DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: ["5", "10", "15", "20", "25"] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  showHeader: true,
};

export default DataTable;
