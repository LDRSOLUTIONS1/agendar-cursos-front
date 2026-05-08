import React, { useReducer } from "react";
import CategoriasContext from "./CategoriasContext";
import CategoriasReducer from "./CategoriasReducer";
import MethodGet, {
  MethodPost,
  MethodPut,
  MethodDelete,
} from "../../config/service";
import Swal from "sweetalert2";
import {
  GET_ALL_CATEGORIAS,
  ADD_CATEGORIAS,
  UPDATE_CATEGORIAS,
  DELETE_CATEGORIAS,
} from "../../types";

const CategoriasState = ({ children }) => {
  const initialState = {
    categorias: [],
    categoria: null,
    ErrorsApi: [],
    success: false,
  };

  const [state, dispatch] = useReducer(CategoriasReducer, initialState);

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

  const GetCategories = async () => {
    try {
      let url = "/categories";
      const res = await MethodGet(url);
      dispatch({ type: GET_ALL_CATEGORIAS, payload: res.data });
    } catch (error) {
      handleError(error);
    }
  };

  const AddCategorias = (data) => {
    MethodPost("/categories", data)
      .then((res) => {
        dispatch({ type: ADD_CATEGORIAS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Categoría agregada con éxito",
          icon: "success",
        });
        GetCategories();
      })
      .catch(handleError);
  };

  const UpdateCategorias = (data) => {
    MethodPut(`/categories/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_CATEGORIAS, payload: res.data });
        Swal.fire({
          title: "Éxito",
          text: "Categoría actualizada con éxito",
          icon: "success",
        });
        GetCategories();
      })
      .catch(handleError);
  };

  const DeleteCategorias = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La categoría seleccionada será eliminada",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        MethodDelete(`/categories/${id}`)
          .then((res) => {
            dispatch({ type: DELETE_CATEGORIAS, payload: id });
            Swal.fire({
              title: "Eliminado",
              text: res.data.mensaje,
              icon: "success",
            });
            GetCategories();
          })
          .catch(handleError);
      }
    });
  };

  return (
    <CategoriasContext.Provider
      value={{
        categorias: state.categorias,
        categoria: state.categoria,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetCategories,
        AddCategorias,
        UpdateCategorias,
        DeleteCategorias,
      }}
    >
      {children}
    </CategoriasContext.Provider>
  );
};

export default CategoriasState;
