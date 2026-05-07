import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import MethodGet from "../../config/service";
import { Grid, MenuItem } from "@mui/material";
import ModelosContext from "../../context/Modelos/ModelosContext";

export default function EditModelos({ open, handleClose, id }) {
  const { UpdateModelos } = useContext(ModelosContext);
  const [modelo, saveModelo] = useState(null);
  useEffect(() => {
    let url = `/modelos/${id}`;
    MethodGet(url)
      .then((res) => {
        saveModelo(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data, e) => {
    data.id = id;
    UpdateModelos(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar modelo</DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter") {
            e.preventDefault();
          }
        }}
      >
        <DialogContent>
          {modelo && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  defaultValue={modelo.nombre_segmento}
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
                  defaultValue={modelo.nombre_tipo_unidad}
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
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            sx={{
              backgroundColor: "#1565c0",
              color: "white",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
