import axios from "axios";
export const LOAADEVICECODE = "LOAADEVICECODE";
export const LOAADEVICECODESTART = "LOAADEVICECODESTART";
const LOAADEVICECODEERROR = "LOAADEVICECODEERROR";

function loadCode(id) {
  return (dispatch, getState) => {
    dispatch({
      type: LOAADEVICECODESTART,
      codes: [],
      isFetching: true
    });
    return axios({
      url: "/api/activationCodes",
      headers: {
        newtoken: localStorage.getItem("token")
      },
      params: {
        orgId: id
      }
    }).then(res => {
      if (res.data.Result === 200) {
        dispatch({
          type: LOAADEVICECODE,
          codes: res.data.Data,
          isFetching: false
        });
      } else {
        dispatch({
          type: LOAADEVICECODEERROR,
          codes: [],
          isFetching: false
        });
      }
    });
  };
}

export default {
  loadCode
};
