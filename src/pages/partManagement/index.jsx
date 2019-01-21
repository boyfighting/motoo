/**
 * @Author 白晓波
 */
import React, { Component } from "react";
import {
  Table,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Icon,
  Popconfirm,
  message
} from "antd";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import actions from "../../axios/partModule";
// import PropTypes from "prop-types";
import "./index.scss";

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const FormItem = Form.Item;
const { getRegion, establishRegion, deleteRegion, renameRegion } = actions;
class RegionModal extends Component {
  state = {
    visible: false,
    newRegion: ""
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  /**
   * 编辑区域 || 新建区域
   * @param {
   *    id: 区域id,
   *    name: 修改后的区域名
   * }
   */

  handleOk = () => {
    const { record, postForm, orgId } = this.props;
    const _this = this;
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
      values.orgId = orgId;
      values.id = record.id;
      postForm(values);
      _this.props.handelAdd(values);
      this.setState({
        visible: false
      });
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
  /**
   * 关闭 modal
   */
  handleCancel = () => {
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
    const { name, organizationId } = record;
    const firstStr = organizationId ? "编辑" : "新建";
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
          title={`${firstStr}区域`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="区域名" {...formItemLayout}>
              {getFieldDecorator("name", {
                initialValue: name,
                rules: [{ required: true, message: "请输入正确的区域名称!" }]
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

const RegionModalForm = Form.create()(RegionModal);

class PartManagement extends Component {
  state = {
    regions: [],
    isFetching: false,
    count: 2
  };

  componentDidMount() {
    // console.log(this.props);
    // const organization = this.context.organization;
    // const { id } = organization;
    setTimeout(() => {
      this.getRegion(this.props.orgId);
    }, 1000);
    // this.getRegion(id);
    // const { actions: { partAction: { getPart } } } = this.props;
    // getPart(id, 1, 10)
  }

  componentWillReceiveProps(nextProps) {}

  /**
   * 删除区域
   * @param {
   *    id: 区域id
   * }
   * */

  handleDelete = (id, orgId) => {
    const regions = this.state.regions.filter(region => region.id !== id);
    this.setState({
      regions
    });
    deleteRegion(id, orgId).then(res => {
      console.log(res);
    });
  };

  /**
   * 获取当前机构下的区域
   * @param {
   *    organization.organizationGuid
   * }
   */

  getRegion = organizationGuid => {
    this.setState({
      isFetching: true
    });

    getRegion(organizationGuid, 1, 10).then(res => {
      if (res.Result === 200) {
        const data = res.Data.items;
        this.setState({
          regions: data,
          isFetching: false
        });
      } else {
        message.error("网络请求失败");
        this.setState({
          isFetching: false
        });
      }
    });
  };

  /**
   * 编辑或添加新的区域
   * 判断values.id是否有值  得到是编辑区域还是添加区域
   */

  handelAdd = values => {
    const { count, regions } = this.state;
    if (values.id) {
      const data = regions.filter(region =>
        region.id === values.id ? (region.name = values.name) : region.name
      );
      this.setState({
        regions: data
      });
    } else {
      const data = {
        name: values.name,
        id: count
      };
      this.setState({
        regions: [data, ...regions],
        count: count + 1
      });
    }
  };
  render() {
    // const organization = this.context.organization;
    // const { id } = organization;
    const paginationProps = {
      defaultPageSize: 5,
      hideOnSinglePage: true,
      showQuickJumper: true
    };
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => (
          <span>
            <RegionModalForm
              orgId={this.props.orgId}
              regions={this.state.regions}
              record={record}
              postForm={renameRegion}
              handelAdd={this.handelAdd}
            >
              <span className="defaultSpan">编辑</span>
            </RegionModalForm>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除 ${record.name} ?`}
              onConfirm={() => this.handleDelete(record.id, this.props.orgId)}
            >
              <span className="defaultSpan">删除</span>
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <div className="partManagement">
        <BreadcrumbCustom first="区域管理" />
        <div className="partManage">
          <div className="pageName">区域管理</div>
          <RegionModalForm
            record={{}}
            postForm={establishRegion}
            regions={this.state.regions}
            handelAdd={this.handelAdd}
            orgId={this.props.orgId}
          >
            <Button type="primary">新建区域</Button>
          </RegionModalForm>
        </div>
        <div
          style={{ margin: "24px", padding: "24px 32px", background: "#fff" }}
        >
          <Table
            dataSource={this.state.regions}
            rowKey={record => record.id}
            columns={columns}
            pagination={paginationProps}
            loading={this.state.isFetching}
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

const mapDispatchToProps = dispatch => {
  const actions = {};
  return {
    actions
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartManagement);
