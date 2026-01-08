import * as React from "react";
import { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Message as MessageIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Default from "../layout/img/default.webp";
import CheckIcon from "@mui/icons-material/Check";
import EditCursos from "../../containers/Cursos/EditCursos";
import ModalMultimedia from "../../containers/Cursos/ModalMultimedia";
import AgendaModal from "../../containers/Agenda/AgendaModal";
import CursosContext from "../../context/Cursos/CursosContext";
import CloseIcon from "@mui/icons-material/Close";
import AgendaModalAdmin from "../../containers/Agenda/AgendaModalAdmin";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
}));

export default function RecipeReviewCard({ curso, categorias }) {
  const {
    DeleteCursos,
    AddCursoFavorito,
    DeleteCursoFavorito,
    EnableCurso,
    DisabledCurso,
  } = useContext(CursosContext);
  const type_user = localStorage.getItem("type_user");
  const user_id = localStorage.getItem("user_id");

  const [expanded, setExpanded] = useState(true);
  const [modalMultimedia, openModalMultimedia] = useState(false);
  const [modalUpdate, OpenModalUpdate] = useState(false);
  const [modalAgendaClient, openModalAgendaClient] = useState(false);
  const [modalAgendaAdmin, openModalAgendaAdmin] = useState(false);
  const [id_user, saveUser] = useState(null);
  const [id_service, saveIdService] = useState(null);
  const [id_agendaClient, saveIdAgendaClient] = useState(null);
  const [id_agendaAdmin, saveIdAgendaAdmin] = useState(null);

  const isFavorito = (curso) =>
    curso.users_who_favorited?.some((user) => user.id.toString() === user_id);

  const handleToggleFavorito = (curso) => {
    if (isFavorito(curso)) DeleteCursoFavorito(curso.id);
    else AddCursoFavorito(curso.id);
  };

  const handleExpandClick = () => setExpanded(!expanded);

  const handleOpenMultimedia = (id) => {
    openModalMultimedia(true);
    saveUser(id);
  };
  const handleCloseMultimedia = () => {
    openModalMultimedia(false);
    saveUser(null);
  };

  const handleClickOpen = (id) => {
    OpenModalUpdate(true);
    saveIdService(id);
  };
  const handleClickClose = () => {
    OpenModalUpdate(false);
    saveIdService(null);
  };

  const handleOpenAgendaAdmin = (id) => {
    openModalAgendaAdmin(true);
    saveIdAgendaAdmin(id);
  };
  const handleCloseAgendaAdmin = () => {
    openModalAgendaAdmin(false);
    saveIdAgendaAdmin(null);
  };

  const handleOpenAgendaClient = (courseId, adminId) => {
    openModalAgendaClient(true);
    saveIdAgendaClient({ courseId, adminId });
  };
  const handleCloseAgendaClient = () => {
    openModalAgendaClient(false);
    saveIdAgendaClient(null);
  };

  const statusColor =
    curso.status === 1 ? "#37ff00" : curso.status === 2 ? "#ff0000" : "#808080";
  const statusText =
    curso.status === 1
      ? "Activo"
      : curso.status === 2
      ? "Inactivo"
      : "Desconocido";

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1565C0", color: "#ffffffff" }}>
            {curso.title?.charAt(0).toUpperCase() ?? "C"}
          </Avatar>
        }
        action={
          type_user === "3" && (
            <IconButton
              size="small"
              onClick={() => handleToggleFavorito(curso)}
            >
              <Tooltip
                title={
                  isFavorito(curso)
                    ? "Eliminar de favoritos"
                    : "Agregar a favoritos"
                }
              >
                {isFavorito(curso) ? (
                  <FavoriteIcon sx={{ color: "#FF0000" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "#FF0000" }} />
                )}
              </Tooltip>
            </IconButton>
          )
        }
        title={
          <Typography variant="subtitle1" gutterBottom>
            {curso.title}
          </Typography>
        }
        subheader={curso.category?.name}
      />

      <Link to={`/Cursos/${curso.id}`} style={{ textDecoration: "none" }}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{ position: "relative" }}
        >
          <CardMedia
            component="img"
            sx={{ width: "100%", height: { xs: 150, sm: 180, md: 200 } }}
            image={curso.image?.url || Default}
            alt={curso.title}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "4px 8px",
              borderRadius: "12px",
              backgroundColor: statusColor,
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {statusText}
          </div>
        </motion.div>

        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            Modalidad: {curso.modality}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duración: {curso.duration}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modelo: {curso.models.nombre_tipo_unidad}
          </Typography>
        </CardContent>
      </Link>
      <CardActions disableSpacing>
        {type_user === "1" && (
          <>
            <IconButton onClick={() => handleOpenMultimedia(curso.id)}>
              <Tooltip title="Agregar multimedia">
                <AddPhotoAlternateIcon
                  sx={{
                    color: "green",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                />
              </Tooltip>
            </IconButton>
            {curso.status === 2 && (
              <IconButton onClick={() => EnableCurso(curso.id)}>
                <Tooltip title="Habilitar curso">
                  <CheckIcon
                    sx={{
                      color: "#2E7D32",
                      "&:hover": { transform: "scale(1.2)", color: "#1B5E20" },
                    }}
                  />
                </Tooltip>
              </IconButton>
            )}
            {curso.status === 1 && (
              <IconButton onClick={() => DisabledCurso(curso.id)}>
                <Tooltip title="Deshabilitar curso">
                  <CloseIcon
                    sx={{
                      color: "#D32F2F",
                      "&:hover": { transform: "scale(1.2)" },
                    }}
                  />
                </Tooltip>
              </IconButton>
            )}

            <IconButton onClick={() => handleClickOpen(curso.id)}>
              <Tooltip title="Editar curso">
                <EditIcon
                  sx={{
                    color: "#e7a62f",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                />
              </Tooltip>
            </IconButton>
            <IconButton onClick={() => DeleteCursos(curso.id)}>
              <Tooltip title="Eliminar curso">
                <DeleteIcon
                  sx={{
                    color: "#FF0000",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                />
              </Tooltip>
            </IconButton>
          </>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Descripción: {curso.description}
          </Typography>

          {curso.status !== 2 && type_user === "1" && (
            <Button
              onClick={() => handleOpenAgendaAdmin(curso.id)}
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#1976D2",
                color: "white",
                "&:hover": {
                  bgcolor: "#1976D2",
                  boxShadow: 3,
                  transform: "scale(1.05)",
                },
                borderRadius: 3,
                py: 1.5,
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
              }}
              component={motion.button}
              whileTap={{ scale: 0.95 }}
            >
              <MessageIcon sx={{ mr: 1 }} />
              Agendar este curso
            </Button>
          )}
          {curso.status !== 2 && type_user === "3" && (
            <Button
              onClick={() => handleOpenAgendaClient(curso.id, curso.user_id)}
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#1976D2",
                "&:hover": { bgcolor: "#1565C0", transform: "scale(1.05)" },
              }}
            >
              <MessageIcon sx={{ mr: 1 }} />
              Me interesa este curso
            </Button>
          )}
        </CardContent>
      </Collapse>
      {id_user !== null && (
        <ModalMultimedia
          open={modalMultimedia}
          handleClose={handleCloseMultimedia}
          id={id_user}
        />
      )}
      {id_service !== null && (
        <EditCursos
          open={modalUpdate}
          handleClose={handleClickClose}
          id={id_service}
          categorias={categorias}
        />
      )}
      {id_agendaClient !== null && (
        <AgendaModal
          open={modalAgendaClient}
          handleClose={handleCloseAgendaClient}
          courseId={id_agendaClient.courseId}
          adminId={id_agendaClient.adminId}
          curso={curso}
        />
      )}
      {id_agendaAdmin !== null && (
        <AgendaModalAdmin
          open={modalAgendaAdmin}
          handleClose={handleCloseAgendaAdmin}
          id={id_agendaAdmin}
          curso={curso}
        />
      )}
    </Card>
  );
}
