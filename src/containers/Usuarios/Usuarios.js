import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, Button, Grid } from "@mui/material";
import Layout from "../../components/layout/Layout";
import UsuariosContext from "../../context/Usuarios/UsuariosContext";
import TablePersonasFisicas from "../../components/Tables/TablePersonasFisicas";
import TablePersonasMorales from "../../components/Tables/TablePersonasMorales";
import AddPersonasFisicas from "./AddPersonasFisicas";
import AddPersonasMorales from "./AddPersonasMorales";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import CategoriasContext from "../../context/Categorias/CategoriasContext";
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

export default function Usuarios() {
  const { usersFisicos, GetUsersFisicos, usersMorales, GetUsersMorales } =
    useContext(UsuariosContext);

  const { categorias, GetCategories } = React.useContext(CategoriasContext);

  const [tabValue, setTabValue] = useState(0);
  const [openFisica, setOpenFisica] = useState(false);
  const [openMoral, setOpenMoral] = useState(false);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleOpenFisica = () => setOpenFisica(true);
  const handleCloseFisica = () => setOpenFisica(false);
  const handleOpenMoral = () => setOpenMoral(true);
  const handleCloseMoral = () => setOpenMoral(false);

  useEffect(() => {
    GetUsersFisicos();
    GetUsersMorales();
    GetCategories();
  }, []);

  const renderTable = () => {
    if (tabValue === 0)
      return (
        <TablePersonasFisicas users={usersFisicos} categorias={categorias} />
      );
    return (
      <TablePersonasMorales users={usersMorales} categorias={categorias} />
    );
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", p: 2 }}>
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
            p: 1,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="usuarios tabs"
          >
            <Tab label="Personas Físicas" {...a11yProps(0)} />
            <Tab label="Personas Morales" {...a11yProps(1)} />
          </Tabs>

          <Button
            onClick={tabValue === 0 ? handleOpenFisica : handleOpenMoral}
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
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderTable()}
            </Grid>
          </Grid>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderTable()}
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Box>

      <AddPersonasFisicas
        modal={openFisica}
        handleCloseFisica={handleCloseFisica}
        users={usersFisicos}
        categorias={categorias}
      />
      <AddPersonasMorales
        modal={openMoral}
        handleCloseMoral={handleCloseMoral}
        users={usersMorales}
        categorias={categorias}
      />
    </Layout>
  );
}
