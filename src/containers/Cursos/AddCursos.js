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
import CursosContext from "../../context/Cursos/CursosContext";
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

export default function AddCursos({ modal, handleClose, categorias, modelos }) {
  const { AddCursos } = React.useContext(CursosContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    AddCursos(data);
    handleClose();
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={modal}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Agregar curso
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
                label="Título del curso"
                {...register("title", {
                  required: "El título es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 caracteres" },
                  maxLength: { value: 200, message: "Máximo 200 caracteres" },
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción del curso"
                multiline
                rows={8}
                {...register("description", {
                  required: "La descripción es obligatoria",
                  minLength: { value: 1, message: "Mínimo 1 caracteres" },
                  maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Selecciona una categoría"
                defaultValue=""
                {...register("category_id", {
                  required: "Debes seleccionar una categoría",
                })}
                error={!!errors.category_id}
                helperText={errors.category_id?.message}
              >
                <MenuItem value="">
                  <em>-- Selecciona una categoría --</em>
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Selecciona un modelo"
                defaultValue=""
                {...register("model_id", {
                  required: "Debes seleccionar un modelo",
                })}
                error={!!errors.model_id}
                helperText={errors.model_id?.message}
              >
                <MenuItem value="">
                  <em>-- Selecciona un modelo --</em>
                </MenuItem>
                {modelos.map((modelo) => (
                  <MenuItem key={modelo.id} value={modelo.id}>
                    {modelo.nombre_segmento} {""}
                    {modelo.nombre_tipo_unidad}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Modalidad del curso"
                defaultValue=""
                {...register("modality", {
                  required: "Selecciona una modalidad ",
                })}
                error={!!errors.modality}
                helperText={errors.modality?.message}
              >
                <MenuItem value="">
                  <em>-- Selecciona --</em>
                </MenuItem>
                <MenuItem value="Presencial">Presencial</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Mixto">Mixto</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duración del curso"
                {...register("duration", {
                  required: "La Duración es obligatoria",
                  minLength: { value: 1, message: "Mínimo 1 caracteres" },
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                })}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              color: "white",
              backgroundColor: "#1976D2",
              "&:hover": {
                color: "white",
                backgroundColor: "#1976D2",
              },
            }}
          >
            Agregar curso
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
}
