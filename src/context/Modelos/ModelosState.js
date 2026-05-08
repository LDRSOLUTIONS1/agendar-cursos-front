import React, { useReducer } from "react";
import ModelosContext from "./ModelosContext";
import ModelosReducer from "./ModelosReducer";
import MethodGet, {
  MethodPost,
  MethodPut,
  MethodDelete,
} from "../../config/service";
import Swal from "sweetalert2";
import {
  GET_ALL_MODELOS,
  ADD_MODELOS,
  UPDATE_MODELOS,
  DELETE_MODELOS,
} from "../../types";

const ModelosState = ({ children }) => {
  const initialState = {
    modelos: [],
    modelo: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(ModelosReducer, initialState);

  const handleError = (error) => {
    const data = error.response?.data;

    if (data?.errors) {
      const mensajes = Object.values(data.errors).flat().join("\n");
      Swal.fire({
        title: "Error de validación",
        icon: "warning",
        text: mensajes,
      });
    } else if (data?.mensaje) {
      Swal.fire({
        title: data.error || "Error",
        icon: "error",
        text: data.mensaje,
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Ocurrió un error inesperado",
      });
    }
  };

  const GetModelos = async () => {
    try {
      let url = "/modelos";
      const res = await MethodGet(url);
      dispatch({ type: GET_ALL_MODELOS, payload: res.data });
    } catch (error) {
      handleError(error);
    }
  };

  const AddModelos = (data) => {
    MethodPost("/modelos", data)
      .then((res) => {
        dispatch({ type: ADD_MODELOS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Modelo agregado con éxito",
          icon: "success",
        });
        GetModelos();
      })
      .catch(handleError);
  };

  const UpdateModelos = (data) => {
    MethodPut(`/modelos/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_MODELOS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Modelo actualizado con éxito",
          icon: "success",
        });
        GetModelos();
      })
      .catch(handleError);
  };

  const DeleteModelos = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El modelo seleccionado será eliminado",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodDelete(`/modelos/${id}`)
          .then((res) => {
            dispatch({ type: DELETE_MODELOS, payload: id });
            Swal.fire({
              title: "Eliminado",
              text: res.data.mensaje,
              icon: "success",
            });
            GetModelos();
          })
          .catch(handleError);
      }
    });
  };

  return (
    <ModelosContext.Provider
      value={{
        modelos: state.modelos,
        modelo: state.modelo,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetModelos,
        AddModelos,
        UpdateModelos,
        DeleteModelos,
      }}
    >
      {children}
    </ModelosContext.Provider>
  );
};

export default ModelosState;
