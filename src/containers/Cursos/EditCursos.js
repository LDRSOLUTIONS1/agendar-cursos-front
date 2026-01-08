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
import CursosContext from "../../context/Cursos/CursosContext";
import ModelosContext from "../../context/Modelos/ModelosContext";

export default function EditCursos({ open, handleClose, id, categorias }) {
  const { modelos, GetModelos } = React.useContext(ModelosContext);
  const { UpdateCursos } = useContext(CursosContext);
  const [course, saveCourse] = useState(null);

  React.useEffect(() => {
    GetModelos();
  }, []);

  useEffect(() => {
    let url = `/course/${id}`;
    MethodGet(url)
      .then((res) => {
        saveCourse(res.data);
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
    UpdateCursos(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Curso</DialogTitle>
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
          {course && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título del curso"
                  defaultValue={course.title}
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
                  defaultValue={course.description}
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
                  label="Selecciona la categoría"
                  defaultValue={course.category_id}
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
                  defaultValue={course.model_id}
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
                  defaultValue={course.modality}
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
                  defaultValue={course.duration}
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
