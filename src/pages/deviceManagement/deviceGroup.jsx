import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Table,
  Divider,
  Modal,
  Form,
  Input,
  Icon,
  Popconfirm,
  message,
  Button
} from "antd";
import actions from "../../axios/deviceModule";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import union from "lodash/union";

const {
  getSoundBoxGroup,
  renameSoundBoxGroup,
  deleteSoundBoxGroup,
  creatGroup
} = actions;
const FormItem = Form.Item;

class EditSoundBoxGroupModal extends Component {
  state = {
    visible: false,
    newRegion: "",
    regions: []
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  /**
   * 编辑分组
   * @param {
   *    id: 区域id,
   *    name: 修改后的机构名
   * }
   * 如果值没有改变则值隐藏弹窗不发送ajax请求
   */

  handleOk = () => {
    const { record, postForm, editOrCreateGroup } = this.props;
    const { id, name } = record;
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
      const data = {
        orgId: "4",
        name: values.groupName,
        groupId: id
      };
      if (name === values.groupName) {
        return false;
      }
      postForm(data).then(res => {
        const group = {
          record,
          data: res.Data
        };
        editOrCreateGroup(group);
      });
      this.hideModal();
    });
  };
  /**
   * 实时获取区域的值
   */
  regionChange = e => {
    this.setState({
      newRegion: e.target.value
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      children,
      record
    } = this.props;
    const { name, intro } = record;
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
      <div className="formModal" style={{ display: "inline-block" }}>
        {<span onClick={this.showModal}>{children}</span>}
        <Modal
          visible={this.state.visible}
          title="编辑音响组名称"
          onOk={this.handleOk}
          onCancel={this.hideModal}
        >
          <Form>
            <FormItem label="音响组名" {...formItemLayout}>
              {getFieldDecorator("groupName", {
                initialValue: name,
                rules: [
                  {
                    required: true,
                    message: "请输入正确的音响组名!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="profile" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  onChange={this.regionChange}
                />
              )}
            </FormItem>
            <FormItem label="简介" {...formItemLayout}>
              {getFieldDecorator("intro", {
                initialValue: intro,
                rules: [
                  {
                    required: false,
                    message: "请输入正确的音响组名!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="profile" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  onChange={this.regionChange}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const EditSoundBoxGroupModalForm = Form.create()(EditSoundBoxGroupModal);

class DeviceGroup extends Component {
  state = {
    soundBoxGroup: [],
    isFetching: false
  };

  componentDidMount() {
    // const organization = this.context.organization;
    // const { id } = organization;
    // this.setState({
    //   orgId: id
    // });

    setTimeout(() => {
      this.getDevices(this.props.orgId);
    }, 1000);
    // this.getDevices(id);
  }

  componentWillReceiveProps(nextProps) {}

  /**
   * 新建设备组
   */

  createGroup = values => {
    const { data } = values;
    const group = {
      id: data.id,
      name: data.name,
      role: 5
    };
    const soundBoxGroup = union([group], this.state.soundBoxGroup);
    this.setState({
      soundBoxGroup
    });
  };

  editGroup = values => {
    const soundBoxGroup = this.state.soundBoxGroup.filter(group =>
      values.data.id === group.id ? (group.name = values.data.name) : group.name
    );
    this.setState({
      soundBoxGroup
    });
  };

  /**
   * 获取当前机构下的所有音箱组
   * @param {
   *    organizationId : 当前的机构id
   * }
   */
  getDevices = id => {
    this.setState({
      isFetching: true
    });
    getSoundBoxGroup(id)
      .then(res => {
        if (res.Result === 200) {
          const resData = res.Data.items;
          const soundBoxGroupItem = resData.map((data, index) => ({
            ...data,
            index
          }));
          this.setState({
            soundBoxGroup: soundBoxGroupItem,
            isFetching: false
          });
        } else {
          message.error("数据获取失败");
          this.setState({
            isFetching: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        message.error("网络请求错误");
        this.setState({
          isFetching: false
        });
      });
  };

  /**
   * 删除音响组
   * @param {
   * groupId: 音响组id
   * orgId: 机构id
   * }
   */

  handleDelete = record => {
    const { id } = record;
    const data = {
      orgId: "4",
      id
    };
    deleteSoundBoxGroup(data).then(res => {
      if (res.Result === 200) {
        const soundBoxGroup = this.state.soundBoxGroup.filter(
          group => group.id !== res.Data.id
        );
        this.setState({
          soundBoxGroup
        });
      } else {
        message.error("删除失败");
      }
    });
  };

  render() {
    const columns = [
      {
        title: "分组名",
        dataIndex: "name",
        key: "name",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "分组创建人",
        dataIndex: "userNick",
        key: "userNick"
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (text, record) => (
          <span>
            <Link
              to={`/admin/devicemanagement/devicegroup/devices/${record.id}`}
              replace
            >
              设备管理
            </Link>
            <Divider type="vertical" />
            <Link
              to={`/admin/devicemanagement/devicegroup/members/${record.id}`}
              replace
            >
              成员管理
            </Link>
            <Divider type="vertical" />
            <EditSoundBoxGroupModalForm
              record={record}
              postForm={renameSoundBoxGroup}
              orgId={this.state.orgId}
              editOrCreateGroup={this.editGroup}
            >
              <span className="defaultSpan">编辑</span>
            </EditSoundBoxGroupModalForm>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除 ${record.name} ?`}
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
      <div className="devicegroup">
        <BreadcrumbCustom
          first={first}
          pathname={this.props.location.pathname}
        />
        <div
          className="devicegroupButton"
          style={{
            display: "flex",
            background: "#fff",
            padding: "12px 24px",
            justifyContent: "space-between"
          }}
        >
          <div className="pageName">分组管理</div>
          <EditSoundBoxGroupModalForm
            record={{}}
            postForm={creatGroup}
            orgId={this.state.orgId}
            editOrCreateGroup={this.createGroup}
          >
            <Button type="primary" className="defaultSpan">
              新建分组
            </Button>
          </EditSoundBoxGroupModalForm>
        </div>
        <div
          style={{
            margin: "24px",
            padding: "24px 32px",
            background: "#fff"
          }}
        >
          <Table
            dataSource={this.state.soundBoxGroup}
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
const mapStateToProps = (state, ownProps) => {
  const { manageOrgsId } = state;
  return {
    orgId: manageOrgsId
  };
};

export default connect(mapStateToProps)(DeviceGroup);
