import React, { Component } from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
//具体导航的名称
const breadcrumbNameMap = {
  // '/home': '首页',
  "/devicemanagement/registerdevice": " 注册设备",
  "/devicemanagement/devicegroup": "  设备分组",
  "/channelManagement": "频道管理",
  "/resourcemanagement": " 资源管理",
  "/authorize": "管理员授权",
  "/partManagement": "区域管理",
  "/authorizationcode": " 授权码生成",
  "/emergencyBroadcast ": " 应急广播"
};
class BreadcrumbCustom extends Component {
  //利用PropTypes记住所跳转每个页面的位置
  static contextTypes = {
    router: PropTypes.object
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      pathSnippets: null,
      extraBreadcrumbItems: null
    };
  }
  getPath() {
    //对路径进行切分，存放到this.state.pathSnippets中
    const pathSnippets = this.context.router.history.location.pathname
      .split("/")
      .filter(i => i);
    console.log(pathSnippets);
    // this.setState({
    //   pathSnippets: this.context.router.history.location.pathname.split('/').filter(i => i),
    // })
    //将切分的路径读出来，形成面包屑，存放到this.state.extraBreadcrumbItems
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      console.log(url);
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        </Breadcrumb.Item>
      );
    });

    this.setState({
      extraBreadcrumbItems
    });
  }

  componentWillMount() {
    //首次加载的时候调用，形成面包屑
    this.getPath();
  }
  componentWillReceiveProps() {
    //任何子页面发生改变，均可调用，完成路径切分以及形成面包屑
    this.getPath();
  }
  render() {
    const breadcrumbItems = [
      <Breadcrumb.Item key="home">
        <Link to="/">首页</Link>
      </Breadcrumb.Item>
    ].concat(this.state.extraBreadcrumbItems);
    return (
      <span>
        <Breadcrumb
          style={{ background: "#fff", margin: "3px 0", padding: "24px 10px" }}
        >
          {breadcrumbItems}
        </Breadcrumb>
      </span>
    );
  }
}

export default BreadcrumbCustom;
