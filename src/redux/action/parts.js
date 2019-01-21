import axios from "axios";

const LOADPART = 'LOADPART';
const LOADPARTfAIL = 'LOADPARTfAIL';


function loadPart(orgId, pageIndex, pageSize) {
  return (dispatch, getState) => {
    return axios({
      url: "/api/regions",
      headers: {
        newtoken: localStorage.getItem("token")
      },
      params: {
        pageIndex: pageIndex,
        orgId: orgId,
        pageSize: pageSize
      }
    }).then(res => {
      if (res.data.Result === 200) {
        dispatch({
          type: LOADPART,
          parts: res.data.Data.items
        })
      } else {
        dispatch({
          type: LOADPARTfAIL,
          parts: []
        })
      }

    })
  }
}

export default {
  loadPart
};
