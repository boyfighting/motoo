import { GET_MANAGEORGS_ID, SWITCH_MENU } from "../action";

export const getManageOrgsId = (state = null, action) => {
  switch (action.type) {
    case GET_MANAGEORGS_ID:
      return action.manageOrgsId;

    default:
      return state;
  }
};

const initialState = {
  isFetching: false,
  codes: []
};

export const getCode = (state = initialState, action) => {
  switch (action.type) {
    case "LOAADEVICECODESTART":
      return {
        codes: [],
        isFetching: action.isFetching
      };
    case "LOAADEVICECODE":
      return {
        codes: action.codes,
        isFetching: action.isFetching
      };
    case "LOAADEVICECODEERROR":
      return state;

    default:
      return state;
  }
};

export const getPart = (state = [], action) => {
  switch (action.type) {
    case "LOADPART":
      return action.parts;
    case "LOADPARTfAIL":
      return state;

    default:
      return state;
  }
};

export const getGroup = (state = [], action) => {
  switch (action.type) {
    case "LOADGROUP":
      return action.groups;
    case "LOADGROUPfAIL":
      return state;

    default:
      return state;
  }
};

export const switchMenu = (state = null, action) => {
  switch (action.type) {
    case SWITCH_MENU:
      return action.menuName;

    default:
      return state;
  }
};

export const loadManageOrgs = (state = [], action) => {
  switch (action.type) {
    case "LOADMANAGEORG":
      return action.orgs;
    default:
      return state;
  }
};
