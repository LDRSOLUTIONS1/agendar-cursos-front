import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import MethodGet from "../../config/service";
import { Grid, Box, Paper, Typography, Button } from "@mui/material";
import {
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Cancel as CancelIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import TableAlumnos from "../../components/Tables/TableAlumnos";

export default function VistaAgenda(props) {
  const history = useHistory();
  const { id } = props.match.params;
  const [agenda, setAgenda] = useState(null);

  useEffect(() => {
    MethodGet(`/courseSchedule/${id}`)
      .then((res) => setAgenda(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleBack = () => {
    history.goBack();
  };

  if (!agenda) return <Layout>Cargando...</Layout>;

  const statusMap = {
    1: "Pendiente de Confirmación",
    2: "Reservación Confirmada",
    3: "Reservación Cancelada",
    4: "Reservación Realizada",
  };

  const start = agenda.start_date ? new Date(agenda.start_date) : null;
  const end = agenda.end_date ? new Date(agenda.end_date) : null;
  const alumnos = agenda.reservations?.[0]?.participants || [];
  
  const InfoItem = ({ icon: Icon, label, value, color = "primary.main" }) => (
    <Box sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}>
      <Icon fontSize="small" sx={{ mr: 1, mt: "3px", color }} />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {value || <span style={{ color: "#888" }}>No registrado</span>}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Layout>
      <Grid container spacing={3} sx={{ mt: 4, px: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderLeft: "6px solid rgba(66,165,245,0.7)",
                backgroundColor: "#f3f8fe",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: "#1565c0",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SchoolIcon sx={{ mr: 1 }} />
                Información del curso
              </Typography>

              <InfoItem
                icon={TitleIcon}
                label="Título:"
                value={agenda.course?.title}
              />
              <InfoItem
                icon={DescriptionIcon}
                label="Descripción:"
                value={agenda.course?.description}
              />
              <InfoItem
                icon={AccessTimeIcon}
                label="Duración:"
                value={agenda.course?.duration}
              />
              <InfoItem
                icon={CategoryIcon}
                label="Categoría:"
                value={agenda.course?.category?.name}
              />
              <InfoItem
                icon={CategoryIcon}
                label="Modelo:"
                value={`${agenda.course?.models?.nombre_segmento}, ${agenda.course?.models?.nombre_tipo_unidad}`}
              />
              <InfoItem
                icon={PersonIcon}
                label="Propietario:"
                value={
                  agenda.course?.user?.razon_social ||
                  `${agenda.course?.user?.name || ""} ${
                    agenda.course?.user?.first_last_name || ""
                  } ${agenda.course?.user?.second_last_name || ""}`.trim()
                }
              />
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderLeft: "6px solid rgba(102,187,106,0.7)",
                backgroundColor: "#f3fcf5",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: "#2e7d32",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EventIcon sx={{ mr: 1 }} />
                Detalle de la reservación
              </Typography>

              <InfoItem
                icon={EventIcon}
                label="Fecha solicitada:"
                value={
                  start
                    ? `${start.toLocaleDateString("es-ES", {
                        dateStyle: "long",
                      })} ${start.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}${
                        end
                          ? ` a ${end.toLocaleDateString("es-ES", {
                              dateStyle: "long",
                            })} ${end.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}`
                          : ""
                      }`
                    : null
                }
              />

              <InfoItem
                icon={LocationOnIcon}
                label="Ubicación:"
                value={`${agenda.state?.name || ""} ${
                  agenda.municipality?.name || ""
                }`}
              />

              <InfoItem
                icon={PersonIcon}
                label="Estatus:"
                value={
                  agenda.reservations?.length > 0
                    ? statusMap[agenda.reservations[0].status]
                    : "Sin reservación"
                }
              />

              <InfoItem
                icon={AccessTimeIcon}
                label="Registro:"
                value={`${new Date(
                  agenda.created_at,
                ).toLocaleDateString()} ${new Date(
                  agenda.created_at,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
              />

              <InfoItem
                icon={PersonIcon}
                label="Solicitante:"
                value={
                  agenda.reservations?.length > 0
                    ? `${agenda.reservations[0].student?.name || ""} ${
                        agenda.reservations[0].student?.first_last_name || ""
                      } ${
                        agenda.reservations[0].student?.second_last_name || ""
                      }`.trim() +
                      ` | ${agenda.reservations[0].student?.phone || ""} | ${
                        agenda.reservations[0].student?.email || ""
                      }`
                    : "No registrado"
                }
              />

              <InfoItem
                icon={SchoolIcon}
                label="Instructor:"
                value={
                  agenda.instructor
                    ? `${agenda.instructor.name} ${agenda.instructor.first_last_name} ${agenda.instructor.second_last_name} | ${agenda.instructor.phone} | ${agenda.instructor.email}`
                    : "No asignado"
                }
              />

              {agenda.reservations[0]?.status === 3 && (
                <Box sx={{ mt: 2, color: "error.main" }}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CancelIcon sx={{ mr: 1 }} />
                    Motivo de cancelación:
                  </Typography>
                  <Typography variant="body2">
                    {agenda.reservations[0].cancellation_reason}
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <TableAlumnos alumnos={alumnos} />
        </Grid>

        <Grid item xs={12}>
          <Button
            onClick={handleBack}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#F3F8FE",
              color: "black",
              "&:hover": {
                bgcolor: "#F3F8FE",
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
            <ArrowBackIcon sx={{ mr: 1 }} />
            Regresar
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}
