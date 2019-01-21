import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import PropTypes from "prop-types";
import "./style/common.scss";
import NavLeft from "./components/NavLeft";
import Header from "./components/Header";
import GlobalFooter from "./components/Footer";
const { Content, Footer } = Layout;
class Admin extends React.Component {
  state = {
    currentKey: "",
    collapsed: false,
    auth: {},
    organization: {}
  };
  componentDidMount() {
    this.getChildContext();
    // const profile = localStorage.getItem('profile')
    // const auth = JSON.parse(profile);
    // this.setState({
    //   auth,
    // })
  }

  getChildContext() {
    const organization = JSON.parse(localStorage.getItem("organization"));
    const profile = JSON.parse(localStorage.getItem("profile"));
    return {
      organization: organization,
      profile: profile
    };
  }

  selectOrg = org => {
    // console.log(org)
  };

  /**
   *折叠左侧导航栏
   *
   */

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100%" }}>
        <NavLeft
          collapsed={this.state.collapsed}
          pathname={this.props.location.pathname}
        />
        <Layout>
          <Header
            selectOrg={this.selectOrg}
            toggle={this.toggle}
            collapsed={this.state.collapsed}
            auth={this.state.auth}
            organization={this.state.organization}
          />
          <Content
            style={{ minHeight: 280 }}
            organization={this.state.organization}
          >
            {this.props.children}
          </Content>
          <Footer>
            <GlobalFooter />
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

Admin.propTypes = {
  organization: PropTypes.object,
  profile: PropTypes.object
};

Admin.childContextTypes = {
  organization: PropTypes.object,
  profile: PropTypes.object
};
export default connect()(Admin);
