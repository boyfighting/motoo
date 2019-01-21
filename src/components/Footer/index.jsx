import React from 'react'
import { Icon } from 'antd'
import './index.scss'
export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="global">
          <div className="links">
            <a href="http://muzhiyun.cn">拇指云</a>
            <a href="http://infomedia.com">英夫美迪</a>
            <a href="/#">帮助</a>
          </div>
          <div className="copyright">
            Copyright <Icon type="copyright" /> 2018 英夫美迪科技股份有限公司
                </div>
        </div>
      </div>
    );
  }
}