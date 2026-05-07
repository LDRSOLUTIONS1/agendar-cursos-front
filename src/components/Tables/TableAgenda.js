import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import { IconButton, Tooltip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useContext, useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import AddInstructor from "../../containers/Agenda/AddInstructor";
import AgendaContext from "../../context/Agenda/AgendaContext";
import EditAgenda from "../../containers/Agenda/EditAgenda";
import { motion, AnimatePresence } from "framer-motion";
import FileUploadIcon from "@mui/icons-material/FileUpload";

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

export default function TableAgenda({ agendas }) {
  const {
    AcceptAgendation,
    CanceledAgendation,
    ClassDone,
    Reschedule,
    handleUploadFile,
  } = useContext(AgendaContext);
  let type_user = localStorage.getItem("type_user");

  const [agenda_id, saveIdInstructor] = useState(null);
  const [modalInstrcutor, openModalInstructor] = useState(false);
  const handleOpenInstructor = (id) => {
    openModalInstructor(true);
    saveIdInstructor(id);
  };
  const handleCloseInstructor = () => {
    openModalInstructor(false);
    saveIdInstructor(null);
  };

  const [modalUpdate, OpenModalUpdate] = useState(false);
  const [id_service, saveIdService] = useState(null);
  const handleClickOpen = (id) => {
    OpenModalUpdate(true);
    saveIdService(id);
  };
  const handleClickClose = () => {
    OpenModalUpdate(false);
    saveIdService(null);
  };

  return (
    <>
      <TableContainerResponsive component={Paper} sx={{ overflowX: "auto" }}>
        <Table aria-label="tabla de categorias">
          <TableHead>
            <TableRow>
              <StyledTableCell>Acciones</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Curso</StyledTableCell>
              <StyledTableCell>Fecha y hora solicitada</StyledTableCell>
              <StyledTableCell>Localidad </StyledTableCell>
              <StyledTableCell>Solicitante</StyledTableCell>
              <StyledTableCell>Instructor</StyledTableCell>
              <StyledTableCell>Estatus</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                  <StyledTableCell data-label="Acciones">
                    <Link to={`/Agenda/${agenda.id}`}>
                      <IconButton size="small">
                        <Tooltip
                          title="Detalle del curso reservado"
                          placement="top"
                        >
                          <VisibilityIcon
                            sx={{
                              color: "blue",
                              transition: "0.2s",
                              "&:hover": { scale: "2" },
                            }}
                          />
                        </Tooltip>
                      </IconButton>
                    </Link>

                    {agenda.reservations?.[0]?.status === 1 &&
                      type_user === "1" &&
                      !agenda.instructor_id && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenInstructor(agenda.id)}
                        >
                          <Tooltip title="Agregar instructor" placement="top">
                            <AccountCircleIcon
                              sx={{
                                color: "brown",
                                transition: "0.2s",
                                "&:hover": { scale: "2" },
                              }}
                            />
                          </Tooltip>
                        </IconButton>
                      )}

                    {agenda.reservations?.[0]?.status === 1 &&
                      agenda.instructor_id &&
                      type_user === "1" && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenInstructor(agenda.id)}
                        >
                          <Tooltip title="Editar instrcutor" placement="top">
                            <EditIcon
                              sx={{
                                color: "#e7a62f",
                                transition: "0.2s",
                                "&:hover": { rotate: "40deg" },
                              }}
                            />
                          </Tooltip>
                        </IconButton>
                      )}

                    {agenda.reservations?.[0]?.status === 1 &&
                      agenda.instructor_id &&
                      (type_user === "1" || type_user === "2") && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            AcceptAgendation(agenda.reservations?.[0]?.id)
                          }
                        >
                          <Tooltip title="Aceptar reservación" placement="top">
                            <CheckCircleOutlineIcon
                              sx={{
                                color: "green",
                                transition: "0.2s",
                                "&:hover": { scale: "2" },
                              }}
                            />
                          </Tooltip>
                        </IconButton>
                      )}

                    {(agenda.reservations?.[0]?.status === 1 ||
                      agenda.reservations?.[0]?.status === 3) &&
                      type_user === "3" && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleClickOpen(agenda.id)}
                          >
                            <Tooltip title="Editar reservación" placement="top">
                              <EditIcon
                                sx={{
                                  color: "#e7a62f",
                                  transition: "0.2s",
                                  "&:hover": { rotate: "40deg" },
                                }}
                              />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                    {agenda.reservations?.[0]?.status === 3 &&
                      (type_user === "1" || type_user === "2") && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() =>
                              Reschedule(agenda.reservations?.[0]?.id)
                            }
                          >
                            <Tooltip
                              title="Reprogramar el curso"
                              placement="top"
                            >
                              <CachedIcon
                                sx={{
                                  color: "black",
                                  transition: "0.2s",
                                  "&:hover": { rotate: "40deg" },
                                }}
                              />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                    {/* clase realizada */}
                    {agenda.reservations?.[0]?.status === 4 && 
                      (type_user === "1" || type_user === "2") && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleUploadFile(agenda.reservations?.[0]?.id)}
                        >
                          <Tooltip title="Subir archivo" placement="top">
                            <FileUploadIcon
                              sx={{
                                color: "green",
                                transition: "0.2s",
                                "&:hover": { scale: "2" },
                              }}
                            />
                          </Tooltip>
                        </IconButton>
                      </>
                    )}

                    {agenda.reservations?.[0]?.status === 2 &&
                      (type_user === "1" || type_user === "2") && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() =>
                              ClassDone(agenda.reservations?.[0]?.id)
                            }
                          >
                            <Tooltip title="¿Clase realizada?" placement="top">
                              <StarIcon
                                sx={{
                                  color: "gold",
                                  transition: "0.2s",
                                  "&:hover": { scale: "2" },
                                }}
                              />
                            </Tooltip>
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              CanceledAgendation(agenda.reservations?.[0]?.id)
                            }
                          >
                            <Tooltip
                              title="Cancelar reservación"
                              placement="top"
                            >
                              <HighlightOffIcon
                                sx={{
                                  color: "red",
                                  transition: "0.2s",
                                  "&:hover": { scale: "2" },
                                }}
                              />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                  </StyledTableCell>

                  <StyledTableCell data-label="ID">{agenda.id}</StyledTableCell>
                  <StyledTableCell data-label="Curso">
                    {agenda.course?.title}
                    <br />
                    {agenda.course?.modality}
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
                        {agenda.reservations[0].student.second_last_name || ""}{" "}
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
                <TableCell colSpan={8} align="center">
                  No hay cursos reservados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {agenda_id !== null && (
          <AddInstructor
            modal={modalInstrcutor}
            handleClose={handleCloseInstructor}
            id={agenda_id}
          />
        )}
        {id_service !== null && (
          <EditAgenda
            open={modalUpdate}
            handleClose={handleClickClose}
            id={id_service}
            cursos={agendas}
          />
        )}
      </TableContainerResponsive>
    </>
  );
}
