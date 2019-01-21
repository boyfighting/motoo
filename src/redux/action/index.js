/*
 * action 类型
 */
import axios from "axios";

export const SWITCH_MENU = "SWITCH_MENU";
// 菜单点击切换，修改面包屑名称
export function switchMenu(res) {
  return {
    type: SWITCH_MENU,
    menuName: res
  };
}

export const GET_MANAGEORGS_ID = "GET_MANAGEORGS_ID";
export function getManageOrgsId(res) {
  return {
    type: GET_MANAGEORGS_ID,
    manageOrgsId: res
  };
}

export const LOADMANAGEORG = "LOADMANAGEORG";
export function loadManageOrgs(onlyManaged) {
  return dispatch => {
    axios({
      url: "/api/manageOrgs",
      headers: {
        newtoken: localStorage.getItem("token")
      },
      params: {
        onlyManaged: onlyManaged
      }
    }).then(res => {
      if (res.Result === 200) {
        dispatch({
          type: LOADMANAGEORG,
          orgs: res.Data
        });
      }
    });
  };
}
