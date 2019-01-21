import React, { Component } from "react";
import {
  Table,
  Divider,
  Popconfirm,
  Form,
  Select,
  Modal,
  Input,
  message
} from "antd";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import { bindActionCreators } from "redux";
import merge from "lodash/merge";
import loadGroup from "../../redux/action/groups";
import actions from "../../axios/deviceModule";

import { connect } from "react-redux";
const { getDeviceUnGroup, addDevToGroup, deleteDevice, updateDevice } = actions;
const FormItem = Form.Item;
const Option = Select.Option;

class EditDeviceModal extends Component {
  state = { visible: false, currentValue: "" };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };
  onChange = e => {
    const currentValue = e.target.value;
    this.setState({
      currentValue
    });
  };
  handleOk = () => {
    const { record, postForm, onEdit } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (values.deviceName === record.name) {
        return false;
      }
      const data = {
        key: record.deviceKey,
        name: values.deviceName
      };
      postForm(data).then(res => {
        if (res.Result === 200) {
          onEdit(res.Data);
          this.setState({
            visible: false
          });
        } else {
          this.setState({
            visible: false
          });
          message.error("网络请求错误！！！");
        }
      });
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
      children,
      record
    } = this.props;
    const { name } = record;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    return (
      <div style={{ display: "inline-block" }}>
        <span onClick={this.showModal}>{children}</span>
        <Modal
          visible={this.state.visible}
          title="选择分组"
          onCancel={this.hideModal}
          onOk={this.handleOk}
        >
          <Form>
            <FormItem label="设备组" {...formItemLayout}>
              {getFieldDecorator("deviceName", {
                initialValue: name,
                rules: [{ required: true, message: "请输入正确的区域名称!" }]
              })(<Input onChange={this.onChange} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const EditDeviceModalForm = Form.create()(EditDeviceModal);

class DeviceModal extends Component {
  state = {
    visible: false
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  hideModal = () => {
    this.setState({
      visible: false
    });
  };
  handleOk = () => {
    const { record, orgId, onAdd } = this.props;
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }

      const { deviceId } = record;
      const { groupId } = values;
      const deviceIds = [deviceId];
      addDevToGroup({ deviceIds, groupId, orgId }).then(res => {
        debugger;
        if (res.Result === 200) {
          onAdd(record);
        } else {
          message.error("数据请求错误");
          this.setState({
            visible: false
          });
        }
      });
      this.setState({
        visible: false
      });
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
      children,
      groups
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const groupSelect = groups.map((group, index) => {
      return (
        <Option key={index} value={group.id}>
          {group.name}
        </Option>
      );
    });
    return (
      <div style={{ display: "inline-block" }}>
        <span onClick={this.showModal}>{children}</span>
        <Modal
          visible={this.state.visible}
          title="选择分组"
          onCancel={this.hideModal}
          onOk={this.handleOk}
        >
          <Form>
            <FormItem label="设备组" {...formItemLayout}>
              {getFieldDecorator("groupId", {
                rules: [{ required: true, message: "请输入正确的区域名称!" }]
              })(
                <Select placeholder="请选择要加入的设备组">
                  {groupSelect}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const DeviceModalForm = Form.create()(DeviceModal);

class UnGroupDevice extends Component {
  state = {
    unGroupDevices: [],
    isFetching: false
  };
  componentDidMount() {
    const {
      actions: {
        groupAction: { loadGroup }
      }
    } = this.props;
    this.setState({
      isFetching: true
    });
    setTimeout(() => {
      getDeviceUnGroup({ orgId: this.props.orgId, onlyUnGrouped: true }).then(
        res => {
          if (res.Result === 200) {
            this.setState({
              unGroupDevices: res.Data.items,
              isFetching: false
            });
          }
        }
      );
      loadGroup(this.props.orgId, 1, 10);
    }, 1000);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      groups: nextProps.groups
    });
  }

  handleDelete = record => {
    const { groupId } = this.state;
    const { deviceId } = record;
    const data = {
      orgId: this.props.orgId,
      groupId,
      deviceId
    };
    deleteDevice(data).then(res => {
      if (res.Result === 200) {
      }
    });
  };

  onAdd = values => {
    const unGroupDevices = this.state.unGroupDevices.filter(
      unGroupDevice => unGroupDevice.deviceId !== values.deviceId
    );
    this.setState({
      unGroupDevices
    });
  };
  onEdit = values => {
    const unGroupDevices = this.state.unGroupDevices.filter(unGroupDevice =>
      values.id === unGroupDevice.deviceId
        ? (unGroupDevice.name = values.name)
        : unGroupDevice.name || ""
    );
    this.setState({
      unGroupDevices
    });
  };
  render() {
    const columns = [
      {
        title: "设备名称",
        dataIndex: "name",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "权限",
        dataIndex: "role"
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => (
          <span>
            <EditDeviceModalForm
              record={record}
              postForm={updateDevice}
              onEdit={this.onEdit}
            >
              <span className="defaultSpan">编辑</span>
            </EditDeviceModalForm>

            <Divider type="vertical" />

            <DeviceModalForm
              record={record}
              orgId={this.state.orgId}
              groups={this.state.groups}
              onAdd={this.onAdd}
            >
              <span className="defaultSpan">加入设备组</span>
            </DeviceModalForm>

            <Divider type="vertical" />

            <Popconfirm
              title={`确定要删除 ${record.name} ?`}
              onCancel={this.onCancel}
              onConfirm={() => this.handleDelete(record)}
            >
              <span className="defaultSpan">删除</span>
            </Popconfirm>
          </span>
        )
      }
    ];
    const paginationProps = {
      defaultPageSize: 5,
      hideOnSinglePage: true,
      showQuickJumper: true
    };
    return (
      <div>
        <BreadcrumbCustom first="未分组设备" />
        <div
          style={{ margin: "24px", padding: "24px 32px", background: "#fff" }}
        >
          <Table
            dataSource={this.state.unGroupDevices}
            columns={columns}
            rowKey={record => record.deviceId}
            pagination={paginationProps}
            loading={this.state.isFetching ? true : false}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { manageOrgsId, getGroup } = state;
  return {
    orgId: manageOrgsId,
    groups: getGroup
  };
};

const mapDispatchToProps = dispatch => {
  const groupAction = { groupAction: bindActionCreators(loadGroup, dispatch) };
  const actions = merge({}, groupAction);
  return {
    actions
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnGroupDevice);
// export default UnGroupDevice;
