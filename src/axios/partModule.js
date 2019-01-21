import Axios from './index'

/**
 * 获取当前机构下的区域
*/

function getRegion(orgId, pageIndex, pageSize) {
  const options = {
    url: '/api/regions',
    data: {
      pageIndex: pageIndex,
      orgId: orgId,
      pageSize: pageSize,
    }
  }
  return Axios.getData(options)
}

/**
 * 新建区域
*/

function establishRegion(values) {
  const options = {
    url: '/api/regions',
    data: {
      name: values.name,
      orgId: values.orgId,
    }
  }
  return Axios.postData(options)
}

/**
 * 编辑区域
*/

function renameRegion(values) {
  const options = {
    url: `/api/regions/${values.id}`,
    data: {
      name: values.name,
      orgId: values.orgId
    }
  }
  return Axios.putData(options)
}

/**
 * 删除区域
*/

function deleteRegion(id, orgId) {
  const options = {
    url: `/api/regions/${id}?orgId=${orgId}`,
    data: {
      orgId: orgId
    }
  }
  return Axios.deleteData(options)
}

export default {
  getRegion,
  establishRegion,
  renameRegion,
  deleteRegion,
}