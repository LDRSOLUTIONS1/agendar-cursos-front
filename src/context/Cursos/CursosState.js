import React, { useReducer } from "react";
import CursosContext from "./CursosContext";
import CursosReducer from "./CursosReducer";
import headerConfig from "../../config/imageHeaders";
import MethodGet, {
  MethodPost,
  MethodPut,
  MethodDelete,
} from "../../config/service";
import Swal from "sweetalert2";
import {
  GET_ALL_CURSOS,
  ADD_CURSOS,
  UPDATE_CURSOS,
  DELETE_CURSOS,
  ADD_CURSO_FAVORITO,
  DELETE_CURSO_FAVORITO,
  DELETE_CURSOS_IMG,
} from "../../types";

const CursosState = ({ children }) => {
  const initialState = {
    cursos: [],
    curso: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(CursosReducer, initialState);

  const handleError = (error) => {
    const data = error.response?.data;

    if (data?.errors) {
      const mensajes = Object.values(data.errors).flat().join("\n");
      Swal.fire({
        title: "Error de validación",
        icon: "warning",
        text: mensajes,
      });
    } else if (data?.mensaje || data?.error) {
      Swal.fire({
        title: data.error || "Error",
        icon: "error",
        text: data.mensaje || data.error,
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Ocurrió un error inesperado",
      });
    }
  };

  const GetCursos = async (nombre = "", category_id = "", model_id = "") => {
    try {
      const type_user = localStorage.getItem("type_user");
      const user_id = localStorage.getItem("user_id");

      let url = "/course";

     if (type_user === "2") {
        url = `/indexTypeUserCourse/${user_id}`;
      }

      const params = new URLSearchParams();
      if (nombre.trim()) params.append("nombre", nombre);
      if (category_id) params.append("category_id", category_id);
      if (model_id) params.append("model_id", model_id);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await MethodGet(url);
      dispatch({ type: GET_ALL_CURSOS, payload: res.data });
    } catch (error) {
      handleError(error);
    }
  };

  const AddCursos = (data) => {
    MethodPost("/course", data)
      .then((res) => {
        dispatch({ type: ADD_CURSOS, payload: res.data });
        Swal.fire({
          title: "Listo",
          text: "Curso agregado con éxito",
          icon: "success",
        });
        GetCursos();
      })
      .catch(handleError);
  };

  const UpdateCursos = (data) => {
    MethodPut(`/course/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_CURSOS, payload: res.data });
        Swal.fire({
          title: "Listo",
          text: "Curso actualizado con éxito",
          icon: "success",
        });
        GetCursos();
      })
      .catch(handleError);
  };

  const DeleteCursos = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El curso seleccionado será eliminado",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodDelete(`/course/${id}`)
          .then((res) => {
            dispatch({ type: DELETE_CURSOS, payload: id });
            Swal.fire({
              title: "Eliminado",
              text: res.data.mensaje,
              icon: "success",
            });
            GetCursos();
          })
          .catch(handleError);
      }
    });
  };

  const DeleteImg = (courseId, imageId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La imagen seleccionada será eliminada",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodDelete(`/courses/${courseId}/images/${imageId}`)
          .then((res) => {
            dispatch({ type: DELETE_CURSOS_IMG, payload: imageId });
            Swal.fire({
              title: "Eliminado",
              text: res.data.message,
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
            GetCursos();
          })
          .catch((error) => {
            console.error("Error al eliminar la imagen:", error);

            const msg =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Ocurrió un error al eliminar la imagen.";

            Swal.fire({
              title: "Error",
              text: msg,
              icon: "error",
            });
          });
      }
    });
  };

  const ChangePhotoCourse = (data) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres agregar esta imagen?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("image", data.image);
        MethodPost(`/courses/${data.id}/images`, formData, { headerConfig })
          .then(() => {
            Swal.fire({
              title: "Foto",
              text: "Modificada correctamente",
              icon: "success",
            }).then(() => window.location.reload());
          })
          .catch((error) => {
            if (error.response) {
              const status = error.response.status;
              const data = error.response.data;
              if (status === 422 && data.errors) {
                const messages = Object.values(data.errors).flat().join("\n");
                Swal.fire({
                  title: "Error de validación",
                  icon: "warning",
                  text: messages,
                });
              } else if (status === 404) {
                Swal.fire({
                  title: "Curso no encontrado",
                  icon: "error",
                  text: data.error || "No se encontró el curso.",
                });
              } else {
                Swal.fire({
                  title: "Error",
                  icon: "error",
                  text: data.message || "Ocurrió un error al subir la imagen.",
                });
              }
            } else {
              Swal.fire({
                title: "Error de conexión",
                icon: "error",
                text: "No se pudo conectar con el servidor.",
              });
            }
          });
      }
    });
  };

  const AddCursoFavorito = (course_id) => {
    MethodPost("/favorites", { course_id })
      .then(() => {
        dispatch({ type: ADD_CURSO_FAVORITO, payload: course_id });
        Swal.fire({
          title: "Listo",
          text: "Curso agregado a favoritos",
          icon: "success",
        });
        GetCursos();
      })
      .catch(handleError);
  };

  const DeleteCursoFavorito = (course_id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El curso será eliminado de tus favoritos",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodDelete(`/favorites/${course_id}`)
          .then(() => {
            dispatch({ type: DELETE_CURSO_FAVORITO, payload: course_id });
            Swal.fire({
              title: "Eliminado",
              text: "Curso eliminado de favoritos",
              icon: "success",
            }).then(() => window.location.reload());
            GetCursos();
          })
          .catch(handleError);
      }
    });
  };

  const EnableCurso = (course_id) => {
    Swal.fire({
      title: "¿Habilitar curso?",
      text: "El curso volverá a estar disponible para los usuarios.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2E7D32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, habilitar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodPut(`/courses/${course_id}/enable`)
          .then(() => {
            Swal.fire({
              title: "Curso habilitado",
              text: "El curso ahora está activo.",
              icon: "success",
            }).then(() => GetCursos());
          })
          .catch(handleError);
      }
    });
  };

  const DisabledCurso = (course_id) => {
    Swal.fire({
      title: "¿Deshabilitar curso?",
      text: "El curso dejará de estar disponible para los usuarios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodPut(`/courses/${course_id}/disable`)
          .then(() => {
            Swal.fire({
              title: "Curso deshabilitado",
              text: "El curso ha sido marcado como inactivo.",
              icon: "success",
            }).then(() => GetCursos());
          })
          .catch(handleError);
      }
    });
  };

  return (
    <CursosContext.Provider
      value={{
        cursos: state.cursos,
        curso: state.curso,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetCursos,
        AddCursos,
        UpdateCursos,
        DeleteCursos,
        ChangePhotoCourse,
        AddCursoFavorito,
        DeleteCursoFavorito,
        EnableCurso,
        DisabledCurso,
        DeleteImg,
      }}
    >
      {children}
    </CursosContext.Provider>
  );
};

export default CursosState;
