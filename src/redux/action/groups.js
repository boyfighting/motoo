import axios from "axios";

const LOADGROUP = "LOADGROUP";
const LOADGROUPfAIL = "LOADGROUPfAIL";

function loadGroup(orgId, pageIndex, pageSize) {
  return (dispatch, getState) => {
    return axios({
      url: `/api/org/${orgId}/groups`,
      headers: {
        newtoken: localStorage.getItem("token")
      },
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    }).then(res => {
      if (res.data.Result === 200) {
        dispatch({
          type: LOADGROUP,
          groups: res.data.Data.items
        });
      } else {
        dispatch({
          type: LOADGROUPfAIL,
          groups: []
        });
      }
    });
  };
}

export default {
  loadGroup
};
