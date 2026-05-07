import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { motion, AnimatePresence } from "framer-motion";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E3F2FD",
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
      borderBottom: "1px solid #000000ff",
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

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#ff0000ff";
    case 2:
      return "#008000";
    case 3:
      return "#ff0000ff";
    case 4:
      return "#0000CD";

    default:
      return "#808080";
  }
};

export default function TableCursos({ agendas }) {
  return (
    <>
      <TableContainerResponsive component={Paper} sx={{ overflowX: "auto" }}>
        <Table aria-label="tabla de categorias">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Curso</StyledTableCell>
              <StyledTableCell>Modelo</StyledTableCell>
              <StyledTableCell>Fecha y hora solicitada</StyledTableCell>
              <StyledTableCell>Localidad</StyledTableCell>
              <StyledTableCell>Solicitante</StyledTableCell>
              <StyledTableCell>Instructor</StyledTableCell>
              <StyledTableCell>Propietario</StyledTableCell>
              <StyledTableCell>Estatus</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {agendas.length > 0 ? (
                agendas.map((agenda) => (
                  <StyledTableRow
                    key={agenda.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#E3F2FD" }}
                  >
                    <StyledTableCell data-label="ID">
                      {agenda.id}
                    </StyledTableCell>
                    <StyledTableCell data-label="Curso">
                      {agenda.course.title} {agenda.course.description}{" "}
                      {agenda.course.modality}
                    </StyledTableCell>
                    <StyledTableCell data-label="Modelo">
                      {agenda.course.models
                        ? `${agenda.course.models.nombre_segmento || ""} ${
                            agenda.course.models.nombre_tipo_unidad || ""
                          }`.trim()
                        : "Sin modelo"}
                    </StyledTableCell>
                    <StyledTableCell data-label="Fecha y hora solicitada">
                      {agenda.start_date &&
                        new Date(agenda.start_date).toLocaleString("es-ES", {
                          dateStyle: "long",
                          timeStyle: "short",
                          hour12: true,
                        })}

                      {agenda.end_date && (
                        <>
                          {" "}
                          a{" "}
                          {new Date(agenda.end_date).toLocaleString("es-ES", {
                            dateStyle: "long",
                            timeStyle: "short",
                            hour12: true,
                          })}
                        </>
                      )}
                    </StyledTableCell>
                    <StyledTableCell data-label="Localidad ">
                      {agenda.state.name} {""}
                      {agenda.municipality.name}
                    </StyledTableCell>
                    <StyledTableCell data-label="Solicitante">
                      {agenda.reservations?.[0]?.student ? (
                        <>
                          {agenda.reservations[0].student.name || ""}{" "}
                          {agenda.reservations[0].student.first_last_name || ""}{" "}
                          {agenda.reservations[0].student.second_last_name ||
                            ""}{" "}
                          {agenda.reservations[0].student.razon_social || ""}
                        </>
                      ) : (
                        "Sin Cliente"
                      )}
                    </StyledTableCell>
                    <StyledTableCell data-label="Instructor">
                      {agenda.instructor ? (
                        `${agenda.instructor.name || ""} ${
                          agenda.instructor.first_last_name || ""
                        } ${agenda.instructor.second_last_name || ""}`.trim()
                      ) : (
                        <span style={{ color: "red" }}>Sin Instructor</span>
                      )}
                    </StyledTableCell>
                    <StyledTableCell data-label="Propietario">
                      {agenda.admins && agenda.admins.length > 0 ? (
                        `${agenda.admins[0].name || ""} ${
                          agenda.admins[0].first_last_name || ""
                        } ${agenda.admins[0].second_last_name || ""}`.trim()
                      ) : (
                        <span style={{ color: "red" }}>Sin Propietario</span>
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      data-label="Estatus"
                      style={{
                        color: getStatusColor(
                          agenda.reservations?.[0]?.status || 0,
                        ),
                      }}
                    >
                      {{
                        1: "Pendiente de confirmación",
                        2: "Confirmada",
                        3: "Cancelada",
                        4: "Realizada",
                      }[agenda.reservations?.[0]?.status] || "Desconocido"}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay cursos disponibles
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
