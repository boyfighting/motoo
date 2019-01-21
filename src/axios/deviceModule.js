import Axios from "./index";

/**
 * 获取当前登录用户可管理的机构
 */

function getManageOrgs(onlyManaged) {
  const options = {
    url: "/api/manageOrgs",
    data: {
      onlyManaged: onlyManaged
    }
  };
  return Axios.getData(options);
}

/**
 * 获取当前机构下所有的音响组
 */

function getSoundBoxGroup(id) {
  const options = {
    url: `/api/org/${id}/groups`,
    data: {
      pageIndex: 1,
      pageSize: 10
    }
  };
  return Axios.getData(options);
}

/**
 *  创建设备组
 *
 */
function creatGroup(values) {
  const options = {
    url: "/api/groups",
    data: {
      orgId: values.orgId,
      name: values.name
    }
  };
  return Axios.postData(options);
}

/**
 * 修改音响组
 */

function renameSoundBoxGroup(value) {
  const options = {
    url: `/api/groups/${value.groupId}`,
    data: {
      name: value.name,
      orgId: value.orgId
    }
  };
  return Axios.putData(options);
}

/**
 * 删除设备组
 */

function deleteSoundBoxGroup(values) {
  const options = {
    url: `/api/groups/${values.id}`,
    data: {
      orgId: values.orgId
    }
  };
  return Axios.deleteData(options);
}

/**
 * 获取当前音响组下所有的成员
 */

function getDeviceGroupMember(id) {
  const options = {
    url: `/api/groups/${id}/members`,
    data: {
      pageIndex: 1,
      pageSize: 10
    }
  };
  return Axios.getData(options);
}

/**
 * 获取当前机构下未分组的设备
 */

function getDeviceUnGroup(values) {
  const options = {
    url: `/api/devices`,
    data: {
      orgId: values.orgId,
      onlyUnGrouped: values.onlyUnGrouped,
      pageIndex: 1,
      pageSize: 10
    }
  };
  return Axios.getData(options);
}

/**
 * 获取当前机构下未分组的设备
 */

function getDeviceGroup(values) {
  const options = {
    url: `/api/devices`,
    data: {
      groupId: values.groupId,
      pageIndex: 1,
      pageSize: 10
    }
  };
  return Axios.getData(options);
}

/**
 *
 * @param {*key*name} values
 */
function updateDevice(values) {
  const options = {
    url: `/api/devices/${values.key}/updateName`,
    data: {
      name: values.name
    }
  };
  return Axios.putData(options);
}

/**
 * 删除设备
 */

function deleteDevice(values) {
  const options = {
    url: `/api/groups/${values.groupId}/devices/${values.deviceId}`,
    data: {
      orgId: values.orgId
    }
  };
  return Axios.deleteData(options);
}

/**
 * 将未分组的设备加入设备组
 */
function addDevToGroup(values) {
  const options = {
    url: `/api/groups/${values.groupId}/devices`,
    data: {
      orgId: 4,
      deviceIds: values.deviceIds
    }
  };
  return Axios.postData(options);
}

/**
 * 删除设备组成员
 */

function deleteDeviceGroupMember(values) {
  const options = {
    url: `/api/groups/${values.groupId}/members`,
    data: {
      users: values.users
    }
  };
  return Axios.deleteData(options);
}

/**
 * 修改组成员权限
 */

function renameGroupMemberAuthority(values) {
  const options = {
    url: `/api/groups/${values.groupId}/members/${values.accountId}`,
    data: {
      role: values.role
    }
  };
  return Axios.putData(options);
}

/**
 * 获取一个用户
 */

function getOneUser(values) {
  const options = {
    url: "/api/user/one",
    data: {
      type: values.type,
      value: values.phone
    }
  };
  return Axios.getData(options);
}

/**
 * 为设备组添加成员
 */

function addMember(values) {
  const options = {
    url: `/api/groups/${values.groupId}/members`,
    data: {
      orgId: values.orgId,
      users: values.users
    }
  };
  return Axios.postData(options);
}

/**
 * A_Area - 创建区域
 */
function createArea(values) {
  const options = {
    url: "/api/areas",
    data: {
      orgId: values.orgId,
      name: values.name,
      mapData: values.mapData
    }
  };
  return Axios.postData(options);
}

/**
 * A_Area - 获取区域
 */
function getArea(values) {
  const options = {
    url: "/api/areas",
    data: {
      orgId: values.orgId,
      pageIndex: values.pageIndex,
      pageSize: values.pageSize
    }
  };
  return Axios.getData(options);
}

/**
 * SoundboxGroup - 获取某个机构下所有的音箱
 */
function getSoundBox(values) {
  const options = {
    url: `/api/soundbox/${values}/boxs`,
    data: {}
  };
  return Axios.mzGetSoundData(options);
}

/**
 *A_Area - 删除区域
 */
function deleteArea(id) {
  const options = {
    url: `/api/areas/${id}`,
    data: {
      id: id
    }
  };
  return Axios.deleteData(options);
}

/**
 *A_Device - 向音箱推应急广播音频
 */
function pushRadio(values) {
  const options = {
    url: "/api/instantPlay",
    data: {
      audioUrl: values.audioUrl,
      soundBoxs: values.soundBoxs,
      groups: values.groups
    }
  };
  return Axios.postData(options);
}

// 调用拇指云token接口=====》获取音频左侧分类---个人
function getMzVoiceList(values) {
  const options = {
    data: {
      folderFormatType: "audio",
      count: "3",
      nextId: "",
      folderType: "-1,0"
    }
  };
  return Axios.mzGetData(options);
}

// 调用拇指云token接口=====》获取音频左侧分类---公共
function getMzVoiceListPublic(values) {
  const options = {
    data: {
      folderFormatType: "audio",
      count: "20",
      nextId: "",
      folderType: "4"
    }
  };
  return Axios.mzGetData(options);
}

// 调用拇指云token接口=====》获取音频右侧表格内容
function getMzVoices(values) {
  const options = {
    data: {
      id: values,
      fileType: "audio,voice",
      isUp: 1,
      pageindex: 1,
      pagesize: 9999999
    }
  }
  return Axios.mzGetvoices(options)
}

export default {
  getManageOrgs,
  creatGroup,
  getSoundBoxGroup,
  renameSoundBoxGroup,
  deleteSoundBoxGroup,
  getDeviceGroupMember,
  getDeviceGroup,
  getDeviceUnGroup,
  updateDevice,
  deleteDevice,
  addDevToGroup,
  deleteDeviceGroupMember,
  renameGroupMemberAuthority,
  getOneUser,
  addMember,
  createArea,
  getArea,
  deleteArea,
  getMzVoiceList,
  getMzVoices,
  getMzVoiceListPublic,
  pushRadio,
  getSoundBox
};
