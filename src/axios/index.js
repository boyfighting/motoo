import JsonP from "jsonp";
import axios from "axios";
// import { Modal } from 'antd'

// axios.defaults.withCredentials =true;

// axios.defaults.baseURL

// const Token = window.localStorage.getItem('Token')
// console.log(Token)
// if(Token){
//   axios.defaults.baseURL = 'http://motootest.muzhiyun.cn'
// }else {
//   axios.defaults.baseURL = 'http://testapi.muzhiyun.cn'
// }

/**
 * 拦截器  先判断token是否存在，然后添加到headers
 */

// axios.interceptors.request.use(
//   config => {
//     console.log(config)
//     let token = localStorage.getItem("token");
//     if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
//       config.headers.newtoken = `${token}`;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   });

export default class Axios {
  static jsonp(options) {
    return new Promise((resolve, reject) => {
      JsonP(
        options.url,
        {
          param: "callback"
        },
        function(err, response) {
          if (response.status === "success") {
            resolve(response);
          } else {
            reject(response.messsage);
          }
        }
      );
    });
  }
  static getData(options) {
    return new Promise((resolve, reject) => {
      axios
        .get(options.url, {
          params: options.data,
          headers: {
            newtoken: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  static postData(options) {
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: "post",
        data: options.data,
        headers: {
          newtoken: localStorage.getItem("token")
        }
      })
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  static putData(options) {
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: "put",
        data: { ...options.data },
        headers: {
          newtoken: localStorage.getItem("token")
        }
      })
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  static deleteData(options) {
    return new Promise((resolve, reject) => {
      axios
        .delete(options.url, {
          data: { ...options.data },
          headers: {
            newtoken: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  static mzGetData(options) {
    return new Promise((resolve, reject) => {
      axios
        .get("http://studioapi.muzhiyun.cn/api/folders/materials", {
          params: options.data,
          headers: {
            token: localStorage.getItem("mzcloudToken")
          }
        })
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  static mzGetvoices(options) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `http://studioapi.muzhiyun.cn/api/materials/folder/${
            options.data.id
          }`,
          {
            params: options.data,
            headers: {
              token: localStorage.getItem("mzcloudToken")
            }
          }
        )
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  static mzGetSoundData(options) {
    return new Promise((resolve, reject) => {
      axios
        .get(options.url, {
          params: options.data,
          headers: {
            token: localStorage.getItem("mzcloudToken")
          }
        })
        .then(
          response => {
            resolve(response.data);
          },
          err => {
            reject(err);
          }
        )
        .catch(error => {
          reject(error);
        });
    });
  }
}
