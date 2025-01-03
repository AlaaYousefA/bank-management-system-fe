import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import "@fontsource/poppins";

const formatDateTime = (isoString) => {
  if (!isoString) return "Invalid date";
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

const TransactionTable = ({ transactions }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  fontFamily: "'Poppins', sans-serif",
                }}
                align="right"
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell
                  sx={{
                    color: "#333",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {formatDateTime(transaction.transactionDate)}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#333",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: transaction.type === "income" ? "green" : "red",
                      fontWeight: "bold",
                      fontFamily: "'Poppins', sans-serif",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {transaction.type === "income" ? (
                      <>
                        <span style={{ marginRight: "4px" }}>+</span> Income
                      </>
                    ) : (
                      <>
                        <span style={{ marginRight: "4px" }}>-</span> Outcome
                      </>
                    )}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color:
                      transaction.status === "COMPLETED"
                        ? "green"
                        : transaction.status === "FAILED"
                        ? "red"
                        : "orange",
                    fontFamily: "'Poppins', sans-serif",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {transaction.status === "COMPLETED" && (
                    <FaCheckCircle style={{ marginRight: 4 }} />
                  )}
                  {transaction.status === "FAILED" && (
                    <FaTimesCircle style={{ marginRight: 4 }} />
                  )}
                  {transaction.status === "PENDING" && (
                    <FaHourglassHalf style={{ marginRight: 4 }} />
                  )}
                  {capitalizeFirstLetter(transaction.status)}
                </TableCell>
                <TableCell
                  sx={{
                    color: transaction.type === "income" ? "green" : "red",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "bold",
                  }}
                  align="right"
                >
                  {transaction.type === "income"
                    ? `+${transaction.amount}`
                    : `-${transaction.amount}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          fontFamily: "'Poppins', sans-serif",
        }}
      />
    </Paper>
  );
};

export default TransactionTable;
