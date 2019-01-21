import React, { Component } from "react";
class DeviceManagement extends Component {
  state = {
    organizationGuid: ""
  };
  componentDidMount() {
    const organization = JSON.parse(localStorage.getItem("organization"));
    const organizationGuid = organization.organizationGuid;
    this.setState({
      organizationGuid: organizationGuid
    });
  }
  render() {
    return (
      <div
        className="deviceManage"
        organizationguid={this.state.organizationGuid}
      >
        {this.props.children}
      </div>
    );
  }
}
export default DeviceManagement;
