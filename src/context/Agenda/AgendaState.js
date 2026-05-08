import React, { useReducer } from "react";
import AgendaContext from "./AgendaContext";
import AgendaReducer from "./AgendaReducer";
import MethodGet, { MethodPost, MethodPut } from "../../config/service";
import Swal from "sweetalert2";
import {
  GET_ALL_AGENDAS,
  ADD_AGENDAS,
  ADD_INSTRUCTOR,
  ACCEPT_AGENDATION,
  CANCELED_AGENDATION,
  UPDATE_AGENDAS,
  RESCHEDULE,
  CLASS_DONE,
  GET_ALL_AGENDAS_COUNT,
} from "../../types";
const AgendaState = ({ children }) => {
  const initialState = {
    agendas: [],
    agenda: null,
    agendasCount: [],
    ErrorsApi: [],
    success: false,
  };
  const [state, dispatch] = useReducer(AgendaReducer, initialState);

  const GetAgendas = async () => {
    try {
      const type_user = localStorage.getItem("type_user");
      const user_id = localStorage.getItem("user_id");

      let url = `/indexTypeUserAgenda/${user_id}`;

      const res = await MethodGet(url);
      dispatch({ type: GET_ALL_AGENDAS, payload: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  const GetAgendasAll = async (
    nombre = "",
    category_id = "",
    model_id = "",
  ) => {
    try {
      let url = "/courseSchedule/Allindex";

      const params = new URLSearchParams({
        ...(nombre.trim() && { nombre }),
        ...(category_id && { category_id }),
        ...(model_id && { model_id }),
      });

      if (params.toString()) url += `?${params.toString()}`;

      const res = await MethodGet(url);
      dispatch({
        type: GET_ALL_AGENDAS,
        payload: res.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const GetAgendasCount = async () => {
    try {
      const type_user = localStorage.getItem("type_user");
      const user_id = localStorage.getItem("user_id");

      let url = `/indexTypeUserAgendaCount/${user_id}`;

      const res = await MethodGet(url);
      dispatch({ type: GET_ALL_AGENDAS_COUNT, payload: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  const AddAgendas = (data) => {
    MethodPost("/courseSchedule", data)
      .then((res) => {
        dispatch({
          type: ADD_AGENDAS,
          payload: res.data,
        });
        Swal.fire({
          title: "Tu solicitud ha sido registrada.",
          text: "Pronto será revisada y nos pondremos en contacto para informarte si el curso fue aprobado.",
          icon: "success",
        });
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          const errores = error.response.data.errors;
          const mensajes = Object.values(errores).flat().join("\n");

          Swal.fire({
            title: "Error",
            icon: "warning",
            text: mensajes,
          });
        } else if (error.response?.data?.error) {
          Swal.fire({
            title: "Error",
            icon: "warning",
            text: error.response.data.error,
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Ocurrió un error inesperado",
          });
        }
      });
  };

  const AddAgendasAdmin = (data) => {
    MethodPost("/storeByAdmin", data)
      .then((res) => {
        dispatch({
          type: ADD_AGENDAS,
          payload: res.data,
        });
        Swal.fire({
          title: "Horario y reserva creados correctamente",
          text: "La reserva para el cliente invitado ha sido registrada.",
          icon: "success",
        });
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          const errores = error.response.data.errors;
          const mensajes = Object.values(errores).flat().join("\n");

          Swal.fire({
            title: "Error",
            icon: "warning",
            text: mensajes,
          });
        } else if (error.response?.data?.error) {
          Swal.fire({
            title: "Error",
            icon: "warning",
            text: error.response.data.error,
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Ocurrió un error inesperado",
          });
        }
      });
  };

  const UpdateAgendas = (data) => {
    MethodPost(`/courseSchedule/${data.id}/edit`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_AGENDAS,
          payload: res.data,
        });
        Swal.fire({
          title: "Tu solicitud ha sido actualizada.",
          text: "Pronto será revisada y nos pondremos en contacto para informarte si el curso fue aprobado.",
          icon: "success",
        });
        GetAgendas();
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          const errores = error.response.data.errors;
          const mensajes = Object.values(errores).flat().join("\n");

          Swal.fire({
            title: "Error",
            icon: "warning",
            text: mensajes,
          });
        } else if (error.response?.data?.error) {
          Swal.fire({
            title: "Error",
            icon: "warning",
            text: error.response.data.error,
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Ocurrió un error inesperado",
          });
        }
      });
  };

  const AddInstructor = (data) => {
    MethodPost(`/courses/${data.agenda_id}/assign-instructor`, data)
      .then((res) => {
        dispatch({
          type: ADD_INSTRUCTOR,
          payload: res.data,
        });
        Swal.fire({
          title: "Listo",
          text: "Instructor asignado correctamente al curso.",
          icon: "success",
        });
        GetAgendas();
      })
      .catch((error) => {
        if (error.response) {
          const data = error.response.data;
          if (data.errors) {
            const mensajes = Object.values(data.errors).flat().join("\n");
            Swal.fire({
              title: "Error de validación",
              icon: "warning",
              text: mensajes,
            });
          } else if (data.error) {
            Swal.fire({
              title: "Error",
              icon: "warning",
              text: data.error,
            });
          } else if (data.mensaje) {
            Swal.fire({
              title: "Error",
              icon: "warning",
              text: data.mensaje,
            });
          } else {
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "Ocurrió un error inesperado en la asignación.",
            });
          }
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Error de conexión con el servidor.",
          });
        }
      });
  };

  const AcceptAgendation = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿El curso seleccionado será reservado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodPost(`/reservations/${id}/confirm`)
          .then((res) => {
            Swal.fire({
              title: "Agendado",
              text: res.data.mensaje,
              icon: "success",
            });
            GetAgendas();
            dispatch({
              type: ACCEPT_AGENDATION,
              payload: id,
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: error.response?.data?.mensaje || "Ocurrió un error",
              icon: "error",
            });
          });
      }
    });
  };

  const CanceledAgendation = async (id) => {
    const { value: formValues } = await Swal.fire({
      title: "¿Estás seguro?",
      html: `
        <style>
          .swal2-html-container {
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
          }
          .swal2-textarea, .swal2-file {
            font-family: 'Poppins', sans-serif;
          }
        </style>
        <p>El curso seleccionado será cancelado. Por favor, indica la razón:</p>
        <textarea id="cancel-reason" class="swal2-textarea" placeholder="Escribe aquí la razón de la cancelación..."></textarea>
        <label style="margin-top:10px; display:block; font-weight:500;">Comprobante (opcional):</label>
        <input type="file" id="cancel-proof" accept="image/*" class="swal2-file">
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, volver",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      focusConfirm: false,

      preConfirm: () => {
        const reason = document.getElementById("cancel-reason").value.trim();
        const proofFile =
          document.getElementById("cancel-proof").files[0] || null;

        if (!reason) {
          Swal.showValidationMessage("Debes ingresar una razón");
          return false;
        }

        return { reason, proofFile };
      },
    });

    if (formValues) {
      const { reason, proofFile } = formValues;

      const formData = new FormData();
      formData.append("motivo", reason);
      if (proofFile) {
        formData.append("comprobante", proofFile);
      }

      MethodPost(`/reservations/${id}/cancel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          Swal.fire({
            title: "Cancelado",
            text: res.data.mensaje,
            icon: "success",
          });
          GetAgendas();
          dispatch({
            type: CANCELED_AGENDATION,
            payload: id,
          });
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.mensaje || "Ocurrió un error",
            icon: "error",
          });
        });
    }
  };

  const ClassDone = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿El curso seleccionado sea realizado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodPost(`/reservations/${id}/served`)
          .then((res) => {
            Swal.fire({
              title: "Realizado",
              text: res.data.mensaje,
              icon: "success",
            });
            GetAgendas();
            dispatch({
              type: CLASS_DONE,
              payload: id,
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: error.response?.data?.mensaje || "Ocurrió un error",
              icon: "error",
            });
          });
      }
    });
  };

  const Reschedule = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿El curso seleccionado será reprogramado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodPost(`/reservations/${id}/reschedule`)
          .then((res) => {
            Swal.fire({
              title: "Reprogramado",
              text: res.data.mensaje,
              icon: "success",
            });
            GetAgendas();
            dispatch({
              type: RESCHEDULE,
              payload: id,
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: error.response?.data?.mensaje || "Ocurrió un error",
              icon: "error",
            });
          });
      }
    });
  };

  const handleUploadFile = async (id) => {
    const { value: file } = await Swal.fire({
      title: "Selecciona el archivo a subir",
      html: `
      <style>
        .swal2-html-container {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
        }

        .swal2-file {
          font-family: 'Poppins', sans-serif;
          margin-top: 10px;
        }
      </style>

      <label style="margin-top:10px; display:block; font-weight:500;">
        Solo archivos .xls, .xlsx o .csv
      </label>

      <input 
        type="file" 
        id="upload-file" 
        accept=".xls,.xlsx,.csv"
        class="swal2-file"
      >
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Subir archivo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      focusConfirm: false,

      preConfirm: () => {
        const selectedFile = document.getElementById("upload-file").files[0];

        if (!selectedFile) {
          Swal.showValidationMessage("Debes seleccionar un archivo");
          return false;
        }

        return selectedFile;
      },
    });

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await MethodPost(
        `/reservations/${id}/participants`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Swal.fire({
        title: "Archivo subido",
        text: res.data.message,
        icon: "success",
      });

      GetAgendas();
    } catch (error) {
      let message = "Ocurrió un error al subir el archivo";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors)
          .flat()
          .join("\n");

        message = errors;
      }

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    }
  };

  return (
    <AgendaContext.Provider
      value={{
        agendas: state.agendas,
        agendasCount: state.agendasCount,
        agenda: state.agenda,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetAgendas,
        AddAgendas,
        AddInstructor,
        AcceptAgendation,
        CanceledAgendation,
        UpdateAgendas,
        ClassDone,
        Reschedule,
        GetAgendasCount,
        GetAgendasAll,
        AddAgendasAdmin,
        handleUploadFile,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};

export default AgendaState;
