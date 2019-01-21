import React, { Component } from "react";
import { Form, Input, Button, Row, Col, Icon, message, Tabs } from "antd";
import actions from "../../axios/loginModule";
import Footer from "../../components/Footer";
import PropTypes from "prop-types";
// import Utils from '../../utils'
import "./index.scss";

const { sendSMSCode, SmsCodeLogin, passwordLogin } = actions;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class codeOrpasswordLogin extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    phone: "",
    count: 0,
    counting: false,
    key: 1
  };
  componentDidMount() {
    //每次进入登录页清除之前的登录信息
    // this.clearToken();
    window.localStorage.clear();
  }

  /**
   * 清楚登录信息
   */

  clearToken = () => {
    window.localStorage.clear();
  };

  /**
   * 验证码 or 密码 登录
   * @param {
   *    phone, code
   * }
   * 储存 profile organization token 信息
   */

  handleSubmit = e => {
    const { postForm } = this.props;
    e.preventDefault();
    const phone = this.props.form.getFieldValue("phone");
    const password = this.props.form.getFieldValue("password");
    const code = this.props.form.getFieldValue("code");
    postForm(phone, password || code).then(res => {
      if (res.Result === 200 && res.Data.user.org) {
        window.localStorage.setItem("profile", JSON.stringify(res.Data.user));
        window.localStorage.setItem(
          "organization",
          JSON.stringify(res.Data.user.org)
        );
        window.localStorage.setItem("token", res.Data.token);
        window.localStorage.setItem("mzcloudToken", res.Data.mzcloudToken);
        this.context.router.history.push("/admin/devicemanagement/devicegroup");
      } else {
        message.warning(" 不好意思，你还没有访问权限！");
      }
    });
  };

  /**
   * 检测电话号码
   */

  checkPhone = (rule, value, callback) => {
    const val = value.trim();
    var reg = /^[1][0-9]{10}$/;
    if (!value) {
      callback("请输入电话号码!");
    } else if (!reg.test(val)) {
      callback("请输入正确的电话号码");
    } else {
      this.setState({
        phone: val
      });
    }
  };

  /**
   * 检测验证码
   */

  checkCode = (rule, value, callback) => {
    if (!value) {
      callback("请输入验证码!");
    } else {
      callback();
    }
  };

  /**
   * 计时器
   */

  setInterval = () => {
    this.timer = setInterval(this.countDown, 1000);
  };

  countDown = () => {
    const { count } = this.state;
    if (count === 1) {
      this.clearInterval();
      this.setState({ counting: false });
    } else {
      this.setState({ counting: true, count: count - 1 });
    }
  };
  clearInterval = () => {
    clearInterval(this.timer);
  };

  /**
   * 根据手机号获取验证码
   * @param {
   *    phone, flag: 4
   * }
   */

  getSMSCode = () => {
    const { phone } = this.state;
    sendSMSCode(phone).then(res => {
      if (res.Result === 200) {
        this.setState({ counting: true, count: 60 });
        this.setInterval();
      } else {
        message.warning("验证码发送失败");
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { code } = this.props;
    const { count, counting } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator("phone", {
            initialValue: "",
            rules: [{ validator: this.checkPhone }]
          })(
            <Input
              prefix={
                <Icon type="mobile" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="电话号码"
            />
          )}
        </FormItem>
        {code === "password" ? (
          <FormItem>
            {getFieldDecorator("password", {
              rules: []
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="密码"
              />
            )}
          </FormItem>
        ) : (
          <FormItem>
            <Row gutter={6}>
              <Col span={16}>
                {getFieldDecorator("code", {
                  rules: [{ validator: this.checkCode }]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="mail"
                        style={{
                          color: "rgba(0,0,0,.25)"
                        }}
                      />
                    }
                    placeholder="获取验证码"
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  style={{ color: counting ? "#f20" : "" }}
                  disabled={counting}
                  onClick={this.getSMSCode}
                >
                  {counting ? `${count}秒后重发` : "获取验证码"}
                </Button>
              </Col>
            </Row>
          </FormItem>
        )}

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedDemo = Form.create()(codeOrpasswordLogin);

class Login extends Component {
  state = {
    key: "password"
  };

  callback = key => {
    this.setState({
      key: key
    });
  };

  render() {
    return (
      <div className="login-page">
        <div className="login-content-wrap">
          <div className="login-box">
            <Tabs
              defaultActiveKey="password"
              onChange={this.callback}
              tabBarStyle={{ display: "flex" }}
            >
              <TabPane tab="密码登录" key="password">
                <WrappedDemo code={this.state.key} postForm={passwordLogin} />
              </TabPane>
              <TabPane tab="验证码登录" key="code">
                <WrappedDemo code={this.state.key} postForm={SmsCodeLogin} />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Login;
