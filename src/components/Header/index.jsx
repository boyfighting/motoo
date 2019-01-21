import React from "react";
import { Icon, Dropdown, Menu, Avatar, message } from "antd";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import union from "lodash/union";

import "./index.scss";
import { connect } from "react-redux";
import actions from "../../axios/deviceModule";
import PropTypes from "prop-types";
import { getManageOrgsId } from "../../redux/action/index";

const { getManageOrgs } = actions;
class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    profile: {},
    orgs: [],
    onlyManaged: 1 //  1 只获取有管理权限的机构，0 获取用户所在的全部机构，默认：0
  };

  componentDidMount() {
    const profile = this.context.profile;
    console.log(profile);
    if (!profile) {
      this.context.router.history.push("/login");
    }
  }

  componentWillMount() {
    getManageOrgs(this.state.onlyManaged).then(res => {
      if (res.Result === 200) {
        const otherOrg = {
          name: "白晓波",
          id: "5",
          role: "OWNER"
        };
        const orgs = union(res.Data, [otherOrg]);
        console.log(orgs);
        this.props.dispatch.getManageOrgsId(orgs[0].id);
        this.setState({
          orgs
        });
      }
    });
  }
  onSelect = org => {
    this.props.dispatch.getManageOrgsId(org.key);
  };

  logout = () => {
    window.localStorage.clear();
    message.success("退出登录成功！");
  };

  render() {
    const { collapsed } = this.props;
    const { orgs } = this.state;
    const profile = this.context.profile;
    const { nickname, avatar, org } = profile;
    const organizeMenu = (
      <Menu onClick={this.onSelect}>
        {orgs
          ? orgs.map((org, index) => {
              return (
                <Menu.Item key={org.id}>
                  <span className="defaultSpan">
                    <Icon type="logout" />
                    <span style={{ marginLeft: "14px" }}>{org.name}</span>
                  </span>
                </Menu.Item>
              );
            })
          : ""}
      </Menu>
    );
    const userMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="avascript:void(0)">
            <Icon type="setting" />
            <span style={{ marginLeft: "14px" }}>设置</span>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="avascript:void(0)">
            <Icon type="edit" />
            <span style={{ marginLeft: "14px" }}>修改我的机构名</span>
          </a>
        </Menu.Item>
        <Menu.Item>
          <Icon type="logout" />
          <Link
            style={{ display: "inline-block" }}
            to="/login"
            onClick={this.logout}
          >
            退出登录
          </Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="header">
        <Icon
          className="trigger"
          type={collapsed ? "menu-unfold" : "menu-fold"}
          onClick={this.props.toggle}
        />
        <div className="profile">
          <Dropdown overlay={organizeMenu}>
            <span className="defaultSpan" style={{ marginRight: "24px" }}>
              <span style={{ marginRight: "14px" }}>当前机构: </span>
              <span>{org.name}</span>
            </span>
          </Dropdown>
          <Dropdown overlay={userMenu}>
            <span className="defaultSpan">
              <Avatar src={avatar} style={{ marginRight: "10px" }} />
              <span>{nickname}</span>
            </span>
          </Dropdown>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  organization: PropTypes.object,
  profile: PropTypes.object
};

Header.contextTypes = {
  organization: PropTypes.object,
  profile: PropTypes.object
};

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
        getManageOrgsId: getManageOrgsId
      },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
