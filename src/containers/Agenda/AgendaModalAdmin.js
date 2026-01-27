import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { Grid, TextField, Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  LocalizationProvider,
  StaticDatePicker,
  StaticTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useContext } from "react";
import AgendaContext from "../../context/Agenda/AgendaContext";
import "dayjs/locale/es";
import SelectState from "../../components/SelectOptions/SelectState";
import SelectMunicipality from "../../components/SelectOptions/SelectMunicipality";
import { useEffect } from "react";
import { useState } from "react";
import MethodGet from "../../config/service";
import UsuariosContext from "../../context/Usuarios/UsuariosContext";

export default function AgendaModalAdmin({ open, handleClose, id }) {
  const { clients, GetClients } = useContext(UsuariosContext);
  const { AddAgendasAdmin } = useContext(AgendaContext);
  let type_user = localStorage.getItem("type_user");
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    MethodGet("/course-schedules/dates")
      .then((res) => setFechas(res.data))
      .catch(console.log);
  }, []);

  const [state, saveState] = useState(null);
  const detectarCambiosState = (value) => {
    saveState(value.value);
  };

  const [municipality, saveMunicipality] = useState(null);
  const detectarCambiosMunicipality = (value) => {
    saveMunicipality(value.value);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [value, setValue] = useState(dayjs());

  const onSubmit = (data) => {
    data.course_id = id;
    data.start_date = value.format("YYYY-MM-DD HH:mm:ss");
    data.state_id = state;
    data.municipality_id = municipality;
    AddAgendasAdmin(data);
    handleClose();
  };

  useEffect(() => {
    GetClients();
  }, []);

  const countEventsByDate = (date) => {
    if (!Array.isArray(fechas)) return 0;
    return fechas.filter((e) => dayjs(e.start_date).isSame(date, "day")).length;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (!inputValue) return;
    const [hour, minute] = inputValue.split(":").map(Number);
    setValue((prev) => dayjs(prev).hour(hour).minute(minute));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle> Me interesa este curso</DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter")
            e.preventDefault();
        }}
      >
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="es"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    Selecciona la fecha
                  </Typography>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={value}
                    onChange={(newValue) =>
                      setValue(
                        newValue.hour(value.hour()).minute(value.minute())
                      )
                    }
                    // shouldDisableDate={(date) => {
                    //   const today = dayjs();
                    //   const day = date.day();
                    //   const isPastDate = date.isBefore(today, "day");

                    //   const alreadyThree = countEventsByDate(date) >= 6;

                    //   if (Number(type_user) === 1) {
                    //     return isPastDate || alreadyThree;
                    //   } else {
                    //     const isWeekend = day === 0 || day === 6;
                    //     return isWeekend || isPastDate || alreadyThree;
                    //   }
                    // }}
                    shouldDisableDate={(date) => {
                      const day = date.day();
                      const alreadyThree = countEventsByDate(date) >= 6;

                      if (Number(type_user) === 1) {
                        return alreadyThree;
                      } else {
                        const isWeekend = day === 0 || day === 6;
                        return isWeekend || alreadyThree;
                      }
                    }}
                  />
                  <Typography variant="subtitle1">
                    Selecciona la hora
                  </Typography>
                  <TextField
                    type="time"
                    fullWidth
                    value={value.format("HH:mm")}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Backspace" || e.key === "Delete") &&
                        e.target.value === ""
                      ) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{
                      step: 60,
                      min: "06:00",
                      max: "22:00",
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Selecciona el nombre del cliente"
                defaultValue=""
                {...register("student_id", {
                  required: "Debes seleccionar el nombre del cliente",
                })}
                error={!!errors.student_id}
                helperText={errors.student_id?.message}
              >
                <MenuItem value="">
                  <em>-- Selecciona un nombre --</em>
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name} {client.first_last_name}{" "}
                    {client.second_last_name}
                    {client.razon_social}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <SelectState detectarCambiosState={detectarCambiosState} />
            </Grid>
            {state !== null && (
              <Grid item xs={12}>
                <SelectMunicipality
                  detectarCambiosMunicipality={detectarCambiosMunicipality}
                  state_id={state}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ingresa la referencia del lugar donde tomarás el curso."
                multiline
                rows={2}
                {...register("location", {
                  required: "La localidad es obligatoria",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
                error={!!errors.location}
                helperText={errors.location?.message}
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
            Agendar curso
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
