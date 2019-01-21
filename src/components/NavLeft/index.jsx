import React from "react";
import { Menu, Layout, Icon } from "antd";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { switchMenu } from "./../../redux/action";

import MenuConfig from "../../routes/menuConfig";
import "./index.scss";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
class NavLeft extends React.Component {
  state = {
    currentKey: "",
    collapsed: false,
    defaultOpenKeys: "",
    defaultSelectKeys: ""
  };
  // 菜单点击
  handleClick = ({ item, key }) => {
    if (key === this.state.currentKey) {
      return false;
    }
    // 事件派发，自动调用reducer，通过reducer保存到store对象中
    const { dispatch } = this.props;
    dispatch.switchMenu(key);
    this.setState({
      currentKey: key
    });
    // hashHistory.push(key);
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  componentWillMount() {
    if (this.props.pathname.includes("/admin/devicemanagement")) {
      const defaultOpenKeys = "/admin/devicemanagement";
      this.setState({
        defaultOpenKeys
      });
    }
    const menuTreeNode = this.renderMenu(MenuConfig);
    this.setState({
      menuTreeNode,
      defaultSelectKeys: this.props.pathname
    });
  }
  // 菜单渲染
  renderMenu = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
            key={item.key}
          >
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key}>
          <NavLink to={item.key} replace>
            <Icon type={item.icon} />
            <span>{item.title}</span>
          </NavLink>
        </Menu.Item>
      );
    });
  };

  render() {
    return (
      <Sider
        trigger={null}
        collapsed={this.props.collapsed}
        width="256"
        style={{ height: "100vh" }}
      >
        <div className="logo">
          <a className="logoHref" href="/">
            <img src="/assets/logo.png" alt="logo" />
            <h1>魔图音箱</h1>
          </a>
        </div>
        <Menu
          onClick={this.handleClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[this.state.defaultSelectKeys]}
          defaultOpenKeys={[this.state.defaultOpenKeys]}
          inlineCollapsed={this.props.collapsed}
        >
          {this.state.menuTreeNode}
        </Menu>
      </Sider>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    // records: (state.copyrightRecord.views.records.ids || []).map(
    //   id => state.entities.copyrightRecords[id]
    // )
    // records: getRecord(state, ownProps)
    // channel:state.getIn("channel")
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    dispatch: bindActionCreators(
      {
        switchMenu: switchMenu
      },
      dispatch
    )
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavLeft);
