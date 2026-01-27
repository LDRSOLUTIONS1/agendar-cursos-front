import React, { useReducer } from "react";
import CalendarioContext from "./CalendarioContext";
import CalendarioReducer from "./CalendarioReducer";
import MethodGet from "../../config/service";
import { GET_ALL_CALENDARIO } from "../../types";
const CalendarioState = ({ children }) => {
  const initialState = {
    fechas: [],
    fecha: null,
    ErrorsApi: [],
    success: false,
  };
  const [state, dispatch] = useReducer(CalendarioReducer, initialState);

  const GetFechas = async () => {
    try {
      const type_user = localStorage.getItem("type_user");
      const user_id = localStorage.getItem("user_id");

      let url = "/course-schedules/dates";

      if (type_user === "1") {
        url = `course-schedules/dates/admin/${user_id}`;
      } else if (type_user === "2" || type_user === "3" || type_user === "7") {
        url = `/course-schedules/dates/${user_id}`;
      }

      const res = await MethodGet(url);
      dispatch({
        type: GET_ALL_CALENDARIO,
        payload: res.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CalendarioContext.Provider
      value={{
        fechas: state.fechas,
        fecha: state.fecha,
        ErrorsApi: state.ErrorsApi,
        success: state.success,
        GetFechas,
      }}
    >
      {children}
    </CalendarioContext.Provider>
  );
};

export default CalendarioState;
