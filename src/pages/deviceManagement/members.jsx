import React, { Component } from "react";
import {
  Table,
  Divider,
  Popconfirm,
  Modal,
  Form,
  Input,
  Avatar,
  Select
} from "antd";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import actions from "../../axios/deviceModule";
import PropTypes from "prop-types";
import union from "lodash/union";

// import './index.scss'
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;

const {
  getDeviceGroupMember,
  deleteDeviceGroupMember,
  renameGroupMemberAuthority,
  getOneUser,
  addMember
} = actions;

class EditMemberAuthority extends Component {
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

  /**
   * 编辑成员权限
   * @param{ accountId, groupId, role }
   *
   * */

  handleOk = () => {
    const { postForm, record, groupId, changeRole } = this.props;
    const { accountId } = record;
    this.props.form.validateFields((errors, values) => {
      if (parseInt(values.role) === record.role) {
        return false;
      }
      const data = {
        accountId: accountId,
        groupId: groupId,
        role: values.role
      };
      postForm(data).then(res => {
        console.log(res);
      });
      const changedUser = {
        userId: record.userId,
        role: parseInt(values.role)
      };
      changeRole(changedUser);
    });
    this.hideModal();
  };

  handleCancel = () => {
    this.hideModal();
  };

  render() {
    const {
      form: { getFieldDecorator },
      record,
      children
    } = this.props;
    const { role } = record;
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
        {<span onClick={this.showModal}>{children}</span>}
        <Modal
          visible={this.state.visible}
          title="编辑权限"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="权限" {...formItemLayout}>
              {getFieldDecorator("role", {
                initialValue: role,
                rules: [{ required: true, message: "请选择权限名称!" }]
              })(
                <Select style={{ width: "100%" }}>
                  <Option value="1">设备内容管理权</Option>
                  <Option value="2">设备插播权</Option>
                  <Option value="3">管理员</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const EditMemberAuthorityForm = Form.create()(EditMemberAuthority);

class MemberManagement extends Component {
  state = {
    members: [],
    isFetching: false,
    memberTable: false,
    groupId: ""
  };

  componentDidMount() {
    const soundboxGroupId = this.props.match.params.id;
    this.setState({
      isFetching: true,
      groupId: soundboxGroupId
    });

    /**
     * 获取当前设备组下的所有成员
     * @param
     * {soundboxGroupId: 设备组id}
     */

    getDeviceGroupMember(soundboxGroupId).then(res => {
      if (res.Data.item) {
        this.setState({
          members: res.Data.item,
          isFetching: false
        });
      } else {
        this.setState({
          members: "",
          isFetching: false
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {}

  /**
   * 删除成员
   * @param id: 成员的id
   */

  handleDelete = user => {
    const data = {
      groupId: this.state.groupId,
      users: [
        {
          userId: user.userId,
          accountId: user.accountId
        }
      ]
    };
    deleteDeviceGroupMember(data).then(res => {
      const members = this.state.members.filter(
        member => member.userId !== user.userId
      );
      this.setState({
        members
      });
    });
  };

  /**
   * 获取一个用户
   * @param {
   *  type 查找类型：0 accountId, 1 userId, 2 phone 默认为 2
   *  value  电话号码
   * }
   */

  getOneUser = phone => {
    const data = {
      type: 2,
      phone: phone
    };
    this.setState({
      memberTable: true
    });
    getOneUser(data).then(res => {
      this.setState({
        oneUser: [res.Data]
      });
    });
  };

  /**
   * 为设备组添加一个成员并设置成员的权限
   */

  setRole = key => {
    const organization = this.context.organization;
    const { id } = organization;
    const user = this.state.oneUser;
    const data = {
      orgId: id,
      groupId: this.state.groupId,
      users: [
        {
          userId: user[0].id,
          accountId: user[0].accountid,
          role: key
        }
      ]
    };
    addMember(data).then(res => {
      const { members } = this.state;
      if (res.Result === 200) {
        user[0].role = res.Data[0].role;
        this.setState({
          members: union(user, members)
        });
      }
    });
    this.setState({
      memberTable: false
    });
  };

  changeRole = values => {
    const members = this.state.members.filter(member =>
      member.userId === values.userId
        ? (member.role = values.role)
        : member.role
    );
    this.setState({
      members
    });
  };

  render() {
    const paginationProps = {
      defaultPageSize: 6,
      hideOnSinglePage: true,
      showQuickJumper: true
    };
    const columns = [
      {
        title: "",
        dataIndex: "avatar",
        render(record) {
          return <Avatar src={record} />;
        }
      },
      {
        title: "姓名",
        dataIndex: "nickname",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "电话",
        dataIndex: "phone"
      },
      {
        title: "权限",
        dataIndex: "role",
        render(text) {
          switch (text) {
            case 1:
              return <span>设备内容管理权</span>;
            case 2:
              return <span>设备插播权</span>;
            case 3:
              return <span>管理员</span>;
            default:
              break;
          }
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              {this.state.memberTable ? (
                <span>
                  <span className="defaultSpan" onClick={() => this.setRole(1)}>
                    设备内容管理权
                  </span>
                  <Divider type="vertical" />
                  <span className="defaultSpan" onClick={() => this.setRole(2)}>
                    设备插播权
                  </span>
                  <Divider type="vertical" />
                  <span className="defaultSpan" onClick={() => this.setRole(3)}>
                    管理员
                  </span>
                </span>
              ) : (
                <span>
                  <EditMemberAuthorityForm
                    record={record}
                    groupId={this.state.groupId}
                    changeRole={this.changeRole}
                    postForm={renameGroupMemberAuthority}
                  >
                    <span className="defaultSpan">修改权限</span>
                  </EditMemberAuthorityForm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={`确定要删除 ${record.nickname} ?`}
                    onCancel={this.onCancel}
                    onConfirm={() => this.handleDelete(record)}
                  >
                    <span className="defaultSpan">删除</span>
                  </Popconfirm>
                </span>
              )}
            </span>
          );
        }
      }
    ];
    const first = {
      title: "设备分组",
      path: "/admin/devicemanagement/devicegroup"
    };
    return (
      <div>
        <BreadcrumbCustom
          first={first}
          second="成员管理"
          pathname={this.props.location.pathname}
        />
        <div
          style={{ margin: "24px", padding: "24px 32px", background: "#fff" }}
        >
          <Search
            placeholder="输入电话号码"
            enterButton="搜索"
            size="large"
            ref="search"
            onSearch={value => {
              this.getOneUser(value);
            }}
          />
          <Table
            dataSource={
              this.state.memberTable ? this.state.oneUser : this.state.members
            }
            columns={columns}
            rowKey={record => record.id}
            loading={this.state.isFetching ? true : false}
            pagination={paginationProps}
          />
        </div>
      </div>
    );
  }
}

MemberManagement.propTypes = {
  organization: PropTypes.object
};

MemberManagement.contextTypes = {
  organization: PropTypes.object
};

export default MemberManagement;
