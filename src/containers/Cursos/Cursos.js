import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Layout from "../../components/layout/Layout";
import RecipeReviewCard from "../../components/Cards/RecipeReviewCard";
import CursosContext from "../../context/Cursos/CursosContext";
import AddCursos from "./AddCursos";
import CategoriasContext from "../../context/Categorias/CategoriasContext";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import ModelosContext from "../../context/Modelos/ModelosContext";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const Cursos = () => {
  const [searchNombre, setSearchNombre] = useState("");
  const [searchTipoCategoria, setSearchTipoCategoria] = useState("");
  const [searchTipoModelo, setSearchTipoModelo] = useState("");
  const { categorias, GetCategories } = useContext(CategoriasContext);
  const { modelos, GetModelos } = useContext(ModelosContext);
  const { cursos, GetCursos } = useContext(CursosContext);
  const type_user = localStorage.getItem("type_user");

  const [openModal, setOpenModal] = useState(false);
  const handleClickOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  useEffect(() => {
    GetCursos(searchNombre, searchTipoCategoria, searchTipoModelo);
  }, [searchNombre, searchTipoCategoria, searchTipoModelo]);

  useEffect(() => {
    GetCategories();
    GetModelos();
  }, []);

  const titles = {
    1: "Cursos",
    2: "Mis cursos instructor",
    3: "Todos los cursos",
    7: "Todos los cursos",
  };

  const cursosActivos = cursos.filter((c) => c.status === 1);
  const cursosInactivos = cursos.filter((c) => c.status === 2);

  const renderCourses = (courses) => {
    if (!courses) {
      return (
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (courses.length === 0) {
      return (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No hay cursos {tabValue === 0 ? "activos" : "inactivos"}.
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm:
              courses.length === 1
                ? "1fr"
                : courses.length === 2
                ? "repeat(2, 1fr)"
                : "repeat(2, 1fr)",
            md:
              courses.length <= 3
                ? `repeat(${courses.length}, 1fr)`
                : "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          justifyItems: "center",
        }}
      >
        {courses.map((curso) => (
          <RecipeReviewCard
            key={curso.id}
            curso={curso}
            categorias={categorias}
          />
        ))}
      </Box>
    );
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {titles[type_user] && (
          <Grid item xs={12}>
            <Typography
              fontWeight="bold"
              fontFamily="monospace"
              variant="h5"
              sx={{ color: "black", mb: 1 }}
            >
              {titles[type_user]}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
              gap: 2,
              mb: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="tabs cursos"
              sx={{ flex: 1 }}
            >
              <Tab label="Activos" {...a11yProps(0)} />
              <Tab label="Inactivos" {...a11yProps(1)} />
            </Tabs>

            {type_user === "1" && (
              <Button
                onClick={handleClickOpen}
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
                <AddIcon sx={{ mr: 1 }} />
                Agregar
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Buscar por nombre del curso"
            variant="outlined"
            size="small"
            fullWidth
            value={searchNombre}
            onChange={(e) => setSearchNombre(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Filtrar por tipo de categoría"
            value={searchTipoCategoria}
            onChange={(e) => setSearchTipoCategoria(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Filtrar por tipo de modelo"
            value={searchTipoModelo}
            onChange={(e) => setSearchTipoModelo(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            {modelos.map((modelo) => (
              <MenuItem key={modelo.id} value={modelo.id}>
                {modelo.nombre_segmento} {""}
                {modelo.nombre_tipo_unidad}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <CustomTabPanel value={tabValue} index={0}>
            {renderCourses(cursosActivos)}
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            {renderCourses(cursosInactivos)}
          </CustomTabPanel>
        </Grid>
      </Grid>

      <AddCursos
        modal={openModal}
        handleClose={handleClose}
        categorias={categorias}
        modelos={modelos}
      />
    </Layout>
  );
};

export default Cursos;
