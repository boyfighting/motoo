import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Popconfirm,
  InputNumber,
  message
} from "antd";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import "./index.scss";
import merge from "lodash/merge";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import union from "lodash/union";
// import { getManageOrgsId } from "../../redux/action/index";
import loadCode from "../../redux/action/code";
import loadPart from "../../redux/action/parts";
import loadGroup from "../../redux/action/groups";

import actions from "../../axios/activationCode";

const { createDeviceCode, deleteDeviceCode } = actions;

const FormItem = Form.Item;
const Option = Select.Option;
// const { getDeviceCode } = actions;

class CodeModal extends Component {
  state = {
    visible: false,
    duration: 0
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    const { orgId, addCode } = this.props;
    const { duration } = this.state;
    this.props.form.validateFields((errors, values) => {
      values.orgId = orgId;
      values.expiredSec = duration;
      createDeviceCode(values).then(res => {
        if (res.Result === 200) {
          addCode(res.Data);
        } else {
          message.warning("创建激活码失败");
        }
      });
    });
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  durationChange = duration => {
    this.setState({
      duration
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      children,
      parts,
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
    const partSelect = parts.map((part, index) => {
      return (
        <Option value={part.id} key={part.id}>
          {part.name}
        </Option>
      );
    });

    const groupSelect = groups.map((group, index) => {
      return (
        <Option value={group.id} key={group.id}>
          {group.name}
        </Option>
      );
    });

    return (
      <div>
        {<span onClick={this.showModal}>{children}</span>}
        <Modal
          visible={this.state.visible}
          title="编辑"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="激活权限" {...formItemLayout}>
              {getFieldDecorator("activeType", {
                initialValue: "LOGIN",
                rules: [{ required: true, message: "请选择权限名称!" }]
              })(
                <Select>
                  <Option value="LOGIN">LOGIN</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="设备类型" {...formItemLayout}>
              {getFieldDecorator("devType", {
                rules: [{ required: true, message: "请选择设备类型!" }]
              })(
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="选择设备类型"
                >
                  <Option value="BOX">拇指魔盒</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="设备分组" {...formItemLayout}>
              {getFieldDecorator("deviceGroup", {
                rules: [{ required: true, message: "请选择设备分组!" }]
              })(
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="请选择一个分组"
                >
                  {groupSelect}
                </Select>
              )}
            </FormItem>
            <FormItem label="设备区域" {...formItemLayout}>
              {getFieldDecorator("devicePart", {
                rules: [{ required: true, message: "请选择设备区域!" }]
              })(
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="请选择一个区域"
                >
                  {partSelect}
                </Select>
              )}
            </FormItem>
            <FormItem label="有效时长" {...formItemLayout}>
              {getFieldDecorator("expiredSec", {
                rules: [{ required: true, message: "请输入效时长!" }]
              })(
                <div>
                  <InputNumber
                    min={0}
                    max={7243600}
                    defaultValue={7243600}
                    onChange={this.durationChange}
                  />
                  <span style={{ marginLeft: "6px" }}>秒</span>
                </div>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const CodeModalForm = Form.create()(CodeModal);

class AuthorizationCode extends Component {
  state = {
    orgId: "",
    codes: [],
    parts: [],
    groups: [],
    isFetching: false
  };
  componentDidMount() {
    const {
      actions: {
        codeAction: { loadCode },
        partAction: { loadPart },
        groupAction: { loadGroup }
      }
    } = this.props;
    setTimeout(() => {
      loadCode(this.props.orgId);
      loadPart(this.props.orgId, 1, 10);
      loadGroup(this.props.orgId, 1, 10);
    }, 1000);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      orgId: nextProps.orgId,
      codes: nextProps.codes,
      parts: nextProps.parts,
      groups: nextProps.groups,
      isFetching: nextProps.isFetching
    });
  }
  handleDelete = record => {
    deleteDeviceCode(record.id, this.state.orgId).then(res => {
      if (res.Result === 200) {
        const codes = this.state.codes.filter(code => code.id !== record.id);
        this.setState({
          codes
        });
      }
    });
  };
  onCancel = () => {};
  addCode = res => {
    const newCode = union([res], this.state.codes);
    this.setState({
      codes: newCode
    });
  };
  onChange = (pagination, filters, sorter) => {
    console.log("params", pagination, filters, sorter);
  };
  render() {
    const paginationProps = {
      defaultPageSize: 4,
      hideOnSinglePage: true,
      showQuickJumper: true
    };
    const columns = [
      {
        title: "激活码",
        dataIndex: "code",
        render(text) {
          return (
            <div className="code" style={{ width: "200px" }}>
              {text}
            </div>
          );
        }
      },
      {
        title: "有效期",
        dataIndex: "expiredAt",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.age - b.age
      },
      {
        title: "机构",
        dataIndex: "org",
        render(text) {
          return text ? <span>{text.name}</span> : "";
        }
      },
      {
        title: "类型",
        dataIndex: "devType"
      },
      {
        title: "分组",
        dataIndex: "group",
        render(text) {
          return text ? <span>{text.name}</span> : "";
        }
      },
      {
        title: "区域",
        dataIndex: "region",
        render(text) {
          return text ? <span>{text.name}</span> : "";
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => (
          <Popconfirm
            title={`确定要删除 ${record.code} ?`}
            onCancel={this.onCancel}
            onConfirm={() => this.handleDelete(record)}
          >
            <span className="defaultSpan">删除</span>
          </Popconfirm>
        )
      }
    ];

    return (
      <div className="authorizationCode">
        <BreadcrumbCustom first="生成授权码" />
        <div className="codeManagement">
          <div className="pageName">激活码管理</div>
          <CodeModalForm
            parts={this.state.parts}
            groups={this.state.groups}
            orgId={this.state.orgId}
            addCode={this.addCode}
          >
            <Button type="primary">新建</Button>
          </CodeModalForm>
        </div>
        <div
          style={{ margin: "24px", padding: "24px 32px", background: "#fff" }}
        >
          <Table
            columns={columns}
            dataSource={this.state.codes}
            onChange={this.onChange}
            rowKey={record => record.id}
            pagination={paginationProps}
            loading={this.state.isFetching ? true : false}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { manageOrgsId, getCode, getPart, getGroup } = state;
  return {
    orgId: manageOrgsId,
    codes: getCode.codes,
    isFetching: getCode.isFetching,
    parts: getPart,
    groups: getGroup

    // records: (state.copyrightRecord.views.records.ids || []).map(
    //   id => state.entities.copyrightRecords[id]
    // )
    // records: getRecord(state, ownProps)
    // channel:state.getIn("channel")
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const codeAction = { codeAction: bindActionCreators(loadCode, dispatch) };
  const partAction = { partAction: bindActionCreators(loadPart, dispatch) };
  const groupAction = { groupAction: bindActionCreators(loadGroup, dispatch) };
  const actions = merge({}, codeAction, partAction, groupAction);
  return {
    actions
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizationCode);
