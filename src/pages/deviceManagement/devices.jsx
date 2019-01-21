import React, { Component } from "react";
import { Table, Divider, Popconfirm, Form, Modal, Input, message } from "antd";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import actions from "../../axios/deviceModule";
import { connect } from "react-redux";
import loadGroup from "../../redux/action/groups";
import { bindActionCreators } from "redux";
import merge from "lodash/merge";

// import './index.scss'
const FormItem = Form.Item;
const { getDeviceGroup, deleteDevice, updateDevice } = actions;

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
          message.error("网络请求失败");
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

class DevixeManagement extends Component {
  state = {
    devices: [],
    unGroupDevices: [],
    isFetching: false,
    orgId: "",
    groups: []
  };

  componentDidMount() {
    // const organization = this.context.organization;
    // const { id } = organization;
    const {
      actions: {
        groupAction: { loadGroup }
      }
    } = this.props;
    const groupId = this.props.match.params.id;
    this.setState({
      isFetching: true,
      groupId: groupId
    });

    /**
     * 获取当前设备组下的所有设备
     * @param
     * {groupId: 设备组id}
     */

    getDeviceGroup({ groupId: groupId }).then(res => {
      if (res.Result === 200) {
        this.setState({
          devices: res.Data.items,
          isFetching: false
        });
      }
    });
    setTimeout(() => {
      loadGroup(this.props.orgId, 1, 10);
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      groups: nextProps.groups,
      orgId: nextProps.orgId
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
        const devices = this.state.devices.filter(
          device => device.deviceId !== deviceId
        );
        this.setState({
          devices
        });
      }
    });
  };

  onEdit = values => {
    const devices = this.state.devices.filter(device =>
      values.id === device.deviceId ? (device.name = values.name) : device.name
    );
    this.setState({
      devices
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
            {/**<DeviceModalForm
              record={record}
              orgId={this.state.orgId}
              groups={this.state.groups}
              onAdd={this.onAdd}
            >
              
            </DeviceModalForm> */}
            <EditDeviceModalForm
              record={record}
              postForm={updateDevice}
              onEdit={this.onEdit}
            >
              <span className="defaultSpan">编辑</span>
            </EditDeviceModalForm>

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
    const first = {
      title: "设备分组",
      path: "/admin/devicemanagement/devicegroup"
    };
    const paginationProps = {
      defaultPageSize: 5,
      hideOnSinglePage: true,
      showQuickJumper: true
    };
    return (
      <div>
        <BreadcrumbCustom
          first={first}
          second="设备管理"
          pathname={this.props.location.pathname}
        />
        <div
          style={{ margin: "24px", padding: "24px 32px", background: "#fff" }}
        >
          <Table
            dataSource={this.state.devices}
            columns={columns}
            rowKey={record => record.deviceKey}
            loading={this.state.isFetching ? true : false}
            pagination={paginationProps}
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
)(DevixeManagement);
