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
import UsuariosContext from "../../context/Usuarios/UsuariosContext";
import { Grid, MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function EditPersonasFisicas({
  open,
  handleClose,
  id,
  categorias,
}) {
  const { UpdateUserFisicas } = useContext(UsuariosContext);
  const [users, saveUsers] = useState(null);
  useEffect(() => {
    let url = `/usersShow/${id}`;
    MethodGet(url)
      .then((res) => {
        saveUsers(res.data);
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
    UpdateUserFisicas(data);
    handleClose();
  };
  const [passwordValues, setPasswordValues] = React.useState({
    password: "",
    showPassword: false,
  });
  const [confirmPasswordValues, setConfirmPasswordValues] = React.useState({
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = (field) => {
    if (field === "password") {
      setPasswordValues({
        ...passwordValues,
        showPassword: !passwordValues.showPassword,
      });
    } else if (field === "password_confirmation") {
      setConfirmPasswordValues({
        ...confirmPasswordValues,
        showPassword: !confirmPasswordValues.showPassword,
      });
    }
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar persona física</DialogTitle>
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
          {users && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  fullWidth
                  name="nombre"
                  variant="outlined"
                  defaultValue={users.name}
                  label="Nombre"
                  {...register("name", {
                    required: "El nombre es requerido",
                    minLength: { value: 1, message: "Mínimo 1 caracteres" },
                    maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  fullWidth
                  name="first_last_name"
                  variant="outlined"
                  defaultValue={users.first_last_name}
                  label="Apellido paterno"
                  {...register("first_last_name", {
                    minLength: { value: 1, message: "Mínimo 1 caracteres" },
                    maxLength: { value: 100, message: "Máximo 255 caracteres" },
                  })}
                  error={!!errors.first_last_name}
                  helperText={errors.first_last_name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  fullWidth
                  name="second_last_name"
                  variant="outlined"
                  defaultValue={users.second_last_name}
                  label="Apellido materno"
                  {...register("second_last_name", {
                    minLength: { value: 1, message: "Mínimo 1 caracteres" },
                    maxLength: { value: 100, message: "Máximo 255 caracteres" },
                  })}
                  error={!!errors.second_last_name}
                  helperText={errors.second_last_name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="date"
                  fullWidth
                  defaultValue={
                    users.birth_date ? users.birth_date.split("T")[0] : ""
                  }
                  label="Fecha de nacimiento"
                  InputLabelProps={{ shrink: true }}
                  {...register("birth_date", {
                    maxLength: { value: 255, message: "Máximo 255 caracteres" },
                  })}
                  error={!!errors.birth_date}
                  helperText={errors.birth_date?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  defaultValue={users.curp}
                  label="CURP"
                  {...register("curp", {
                    pattern: {
                      value: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/,
                      message: "CURP inválida",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                  }}
                  error={!!errors.curp}
                  helperText={errors.curp?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  defaultValue={users.rfc}
                  label="RFC"
                  {...register("rfc", {
                    pattern: {
                      value: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
                      message: "RFC inválido",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                  }}
                  error={!!errors.rfc}
                  helperText={errors.rfc?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  fullWidth
                  name="email"
                  variant="outlined"
                  defaultValue={users.email}
                  label="Correo electrónico"
                  {...register("email", {
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Correo inválido",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  fullWidth
                  name="phone"
                  variant="outlined"
                  defaultValue={users.phone}
                  label="Teléfono"
                  {...register("phone", {
                    minLength: { value: 10, message: "Mínimo 10 caracteres" },
                    maxLength: { value: 15, message: "Máximo 15 caracteres" },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de usuario"
                  defaultValue={users.type_user}
                  {...register("type_user", { required: "Selecciona un tipo" })}
                  error={!!errors.type_user}
                  helperText={errors.type_user?.message}
                >
                  <MenuItem value="">
                    <em>-- Selecciona --</em>
                  </MenuItem>
                  <MenuItem value={1}>Administrador</MenuItem>
                  <MenuItem value={2}>Instructor</MenuItem>
                  <MenuItem value={3}>Cliente</MenuItem>
                  <MenuItem value={6}>Subadministrador</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Selecciona una categoría"
                  defaultValue={users.category_id}
                  {...register("category_id", {
                    required: "Debes seleccionar una categoría",
                  })}
                  error={!!errors.category_id}
                  helperText={errors.category_id?.message}
                >
                  <MenuItem value="">
                    <em>-- Selecciona una categoría -</em>
                  </MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  type={passwordValues.showPassword ? "text" : "password"}
                  id="password"
                  fullWidth
                  name="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword("password")}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {passwordValues.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  label="Contraseña"
                  error={errors.password ? true : false}
                  helperText={errors?.password?.message}
                  {...register("password", {
                    minLength: {
                      value: 4,
                      message: "Minimo 4 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximo 50 caracteres",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  type={
                    confirmPasswordValues.showPassword ? "text" : "password"
                  }
                  fullWidth
                  name="password_confirmation"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            handleClickShowPassword("password_confirmation")
                          }
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {confirmPasswordValues.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  label="Confirma la contraseña"
                  error={errors.password_confirmation ? true : false}
                  helperText={errors?.password_confirmation?.message}
                  {...register("password_confirmation", {
                    minLength: {
                      value: 4,
                      message: "Minimo 4 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximo 50 caracteres",
                    },
                  })}
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
