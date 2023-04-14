import {
  TableRow,
  TableHead,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { StyledTableCell, StyledTableRow } from "./TableComponents";

export default function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;
  const createSortHandler = (newOrderBy, dateSort, numeric) => (event) => {
    onRequestSort(event, newOrderBy, dateSort, numeric);
  };

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell) => {
          if (headCell.isSortable) {
            return (
              <StyledTableCell
                align="center"
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(
                    headCell.id,
                    headCell.isDateSort,
                    headCell.numeric
                  )}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </StyledTableCell>
            );
          } else {
            return (
              <StyledTableCell align="center" key={headCell.id}>
                {headCell.label}
              </StyledTableCell>
            );
          }
        })}
      </StyledTableRow>
    </TableHead>
  );
}
