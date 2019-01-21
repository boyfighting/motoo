import Axios from './index'

/**
 * 获取设备激活码
 * @param {*} values 
 */

function getDeviceCode(id) {
  // const { orgId, groupId, regionId, devType } = values;
  const options = {
    url: '/api/activationCodes',
    data: {
      orgId: id
    }
  }
  return Axios.getData(options)
}



/**
 * 创建设备激活码
 * @param {*} values 
 */
function createDeviceCode(values) {
  const { orgId, activeType, devType, deviceGroup, devicePart, expiredSec } = values;
  const options = {
    url: '/api/activationCodes',
    data: {
      orgId,
      groupId: deviceGroup,
      regionId: devicePart,
      expiredSec,
      devType,
      activeType
    }
  }
  return Axios.postData(options)
}

/**
 * 删除设备激活码
 */

function deleteDeviceCode(id, orgId) {
  const options = {
    url: `/api/activationCodes/${id}`,
    data: {
      orgId: orgId
    }
  }
  return Axios.deleteData(options)
}

export default { getDeviceCode, createDeviceCode, deleteDeviceCode }
