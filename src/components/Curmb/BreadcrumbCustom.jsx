/**
 * Created by hao.cheng on 2017/4/22.
 */
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

class BreadcrumbCustom extends React.Component {
  componentDidMount() {
  }
  render() {
    const first = typeof this.props.first === 'object' ? <Breadcrumb.Item><Link to={this.props.first.path} replace>{this.props.first.title}</Link></Breadcrumb.Item> || '' : <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item>;
    const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
    return (
      <div style={{ margin: '3px 0 0 0', padding: '24px 16px', background: '#fff' }}>
        <Breadcrumb >
          <Breadcrumb.Item><Link to={'/admin/devicemanagement/registerdevice'} replace>首页</Link></Breadcrumb.Item>
          {first}
          {second}
        </Breadcrumb>
      </div>
    )
  }
}

export default BreadcrumbCustom;
