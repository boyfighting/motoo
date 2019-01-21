import Axios from './index'

/**
 * 发送验证码
 */

function sendSMSCode(phone) {
  const options = {
    url: '/api/smsCode',
    data: {
      phone: phone,
    }
  }
  return Axios.postData(options)
}

/**
 * 验证码登录
 */

function SmsCodeLogin(phone, code) {
  const options = {
    url: '/api/user/login',
    data: {
      phone: phone,
      code: code,
    }
  }
  return Axios.postData(options)
}

/**
 * 密码登录
 */

function passwordLogin(phone, password) {
  const options = {
    url: '/api/user/login',
    data: {
      phone: phone,
      password: password,
    }
  }
  return Axios.postData(options)
}

export default {
  sendSMSCode,
  SmsCodeLogin,
  passwordLogin
}