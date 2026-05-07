import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Grid, MenuItem, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import ModelosContext from "../../context/Modelos/ModelosContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8, 
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function AddModelos({ modal, handleClose }) {
  const { AddModelos } = React.useContext(ModelosContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    AddModelos(data);
    handleClose();
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={modal}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Agregar modelo
      </BootstrapDialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter")
            e.preventDefault();
        }}
      >
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de segmento"
                {...register("nombre_segmento", {
                  required: "El nombre de segmento es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 caracteres" },
                  maxLength: { value: 200, message: "Máximo 200 caracteres" },
                })}
                error={!!errors.nombre_segmento}
                helperText={errors.nombre_segmento?.message}
              />
            </Grid> 
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de unidad"
                {...register("nombre_tipo_unidad", {
                  required: "El nombre de unidad es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 caracteres" },
                  maxLength: { value: 200, message: "Máximo 200 caracteres" },
                })}
                error={!!errors.nombre_tipo_unidad}
                helperText={errors.nombre_tipo_unidad?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            type="submit"
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
            whileTap={{ scale: 0.9 }}
          >
            Agregar modelo
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
}
