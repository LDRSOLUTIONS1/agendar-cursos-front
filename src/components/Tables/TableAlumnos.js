import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F3F8FE",
    color: "black",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableContainerResponsive = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& thead": {
      display: "none",
    },
    "& tbody tr": {
      display: "block",
      marginBottom: "15px",
    },
    "& td": {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 5px",
      borderBottom: "1px solid rgb(0, 0, 0)",
      "&:before": {
        content: "attr(data-label)",
        fontWeight: "bold",
        textTransform: "uppercase",
      },
      "&:last-child": {
        borderBottom: 0,
      },
    },
  },
}));

export default function TableAlumnos({ alumnos }) {
  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>Lista de Participantes</h2>
      <TableContainerResponsive component={Paper} sx={{ overflowX: "auto" }}>
        <Table aria-label="tabla de participantes">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nombres</StyledTableCell>
              <StyledTableCell>Correo</StyledTableCell>
              <StyledTableCell>Teléfono</StyledTableCell>
              <StyledTableCell>Empresa</StyledTableCell>
              <StyledTableCell>Puesto</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {alumnos.length > 0 ? (
                alumnos.map((alumno) => (
                  <StyledTableRow
                    key={alumno.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#E3F2FD" }}
                  >
                    <StyledTableCell data-label="ID">
                      {alumno.id}
                    </StyledTableCell>
                    <StyledTableCell data-label="Nombres">
                      {alumno.full_name}
                    </StyledTableCell>
                    <StyledTableCell data-label="Correo">
                      {alumno.email}
                    </StyledTableCell>
                    <StyledTableCell data-label="Teléfono">
                      {alumno.phone}
                    </StyledTableCell>
                    <StyledTableCell data-label="Empresa">
                      {alumno.company}
                    </StyledTableCell>
                    <StyledTableCell data-label="Puesto">
                      {alumno.position}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay participantes registrados.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainerResponsive>
    </>
  );
}
