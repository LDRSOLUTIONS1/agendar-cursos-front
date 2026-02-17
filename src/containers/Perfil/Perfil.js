import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import Layout from "../../components/layout/Layout";
import AuthContext from "../../context/Auth/AuthContext";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import LockResetIcon from "@mui/icons-material/LockReset";
import ResetPassword from "./ResetPassword";
import EditInfo from "./EditInfo";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileMultimedia from "./AttachFileMultimedia";
import { motion } from "framer-motion";

const Perfil = () => {
  const { user_me, UserMe } = useContext(AuthContext);
  const type_user = localStorage.getItem("type_user");

  useEffect(() => {
    if (user_me === null) {
      UserMe();
    }
  }, []);

  const [saludo, setSaludo] = useState("");
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) setSaludo("buenos días");
    else if (hora >= 12 && hora < 18) setSaludo("buenas tardes");
    else setSaludo("buenas noches");
  }, []);

  const [id_user, saveUser] = useState(null);
  const [modalMultimedia, openModalMultimedia] = useState(false);
  const handleOpenMultimedia = (id) => {
    openModalMultimedia(true);
    saveUser(id);
  };
  const handleCloseMultimedia = () => {
    openModalMultimedia(false);
    saveUser(null);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const [openModalInfo, setOpenModalInfo] = React.useState(false);
  const handleClickOpenInfo = () => {
    setOpenModalInfo(true);
  };
  const handleCloseInfo = () => {
    setOpenModalInfo(false);
  };

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "90vh", p: 2 }}
      >
        {user_me && (
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Card
              sx={{ borderRadius: 4, boxShadow: 4, p: 2 }}
              component={motion.tr}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <CardContent>
                <Typography
                  align="center"
                  fontWeight="bold"
                  fontFamily="monospace"
                  variant="h5"
                  sx={{ color: "black" }}
                >
                  Hola {saludo}, {user_me.name} {user_me.first_last_name}{" "}
                  {user_me.second_last_name} {user_me.razon_social}
                </Typography>
                <br />
                <Typography
                  align="center"
                  fontWeight="bold"
                  fontFamily="monospace"
                  variant="h6"
                  sx={{ color: "black" }}
                >
                  Bienvenido a Training Center.
                </Typography>
                <br />

                <Box display="flex" justifyContent="center" mb={2}>
                  <img
                    src={
                      user_me.image_profile?.url ||
                      `https://ldrhsys.ldrhumanresources.com/Cliente/img/avatars/${user_me.url}.png` ||
                      user_me.imageProfile?.url
                    }
                    alt="Foto de perfil"
                    style={{
                      width: 225,
                      height: 200,
                      borderRadius: "10%",
                      objectFit: "cover",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>
                <Button
                  onClick={() => handleOpenMultimedia(user_me.id)}
                  fullWidth
                  variant="contained"
                  sx={{
                    mb: 2,
                    bgcolor: "#F3E5F5",
                    color: "black",
                    "&:hover": {
                      bgcolor: "#F3E5F5",
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
                  <FlipCameraIosIcon sx={{ mr: 1 }} />
                  Cambiar foto de perfil
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="h6"
                  align="center"
                  fontWeight="bold"
                  gutterBottom
                >
                  Información personal
                </Typography>

                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Soy:{" "}
                    {{
                      1: "Administrador",
                      2: "Instructor",
                      3: "Cliente",
                      6: "Subadministrador",
                    }[user_me.type_user] || "Desconocido"}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Persona:{" "}
                    {{
                      4: "Física",
                      5: "Moral",
                    }[user_me.type_person] || "Desconocido"}
                  </Typography>

                  {user_me.type_person === 4 && (
                    <>
                      <Typography variant="body1" gutterBottom>
                        Fecha de nacimiento:{" "}
                        {
                          new Date(user_me.birth_date)
                            .toISOString()
                            .split("T")[0]
                        }
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        CURP: {user_me.curp}
                      </Typography>
                    </>
                  )}

                  {user_me.type_person === 5 && (
                    <>
                      <Typography variant="body1" gutterBottom>
                        Representante legal: {user_me.representante_legal}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Domicilio fiscal: {user_me.domicilio_fiscal}
                      </Typography>
                    </>
                  )}

                  <Typography variant="body1" gutterBottom>
                    RFC: {user_me.rfc}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Correo: {user_me.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Teléfono: {user_me.phone}
                  </Typography>
                  {(type_user === "1" ||
                    type_user === "2" ||
                    type_user === "6") && (
                    <Typography variant="body1" gutterBottom>
                      Número de colaborador: {user_me.collaborator_number}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      onClick={handleClickOpenInfo}
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: "#FFF3E0",
                        color: "black",
                        "&:hover": {
                          bgcolor: "#FFF3E0",
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
                      <EditNoteIcon sx={{ mr: 1 }} />
                      Editar mi Información
                    </Button>
                  </Grid>
                  {type_user === "3" && (
                    <Grid item xs={12}>
                      <Button
                        onClick={handleClickOpen}
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: "#E3F2FD",
                          color: "black",
                          "&:hover": {
                            bgcolor: "#E3F2FD",
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
                        <LockResetIcon sx={{ mr: 1 }} />
                        Cambiar mi contraseña
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            {id_user !== null && (
              <AttachFileMultimedia
                open={modalMultimedia}
                handleClose={handleCloseMultimedia}
                id={id_user}
                id_User={user_me.id}
              />
            )}
            <ResetPassword modal={openModal} handleClose={handleClose} />
            <EditInfo
              User={user_me}
              modal={openModalInfo}
              handleClose={handleCloseInfo}
            />
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Perfil;
