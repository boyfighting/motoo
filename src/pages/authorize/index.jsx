import React, { Component } from "react";
import { Input, Table } from "antd";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import "./index.scss";
const Search = Input.Search;

class Authorize extends Component {
  render() {
    const columns = [
      {
        title: "",
        dataIndex: "index",
        render(text) {
          return (
            <img
              src={text}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "32px"
              }}
              alt="authorImg"
            />
          );
        }
      },
      {
        title: "用户名",
        dataIndex: "authorName",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "电话号码",
        dataIndex: "phoneNumber",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "角色",
        dataIndex: "role",
        render(text) {
          return <div className="code">{text}</div>;
        }
      },
      {
        title: "授权",
        dataIndex: "authorize",
        render: (text, record) => (
          <span>
            <span className="defaultSpan">取消授权</span>
          </span>
        )
      }
    ];

    const data = [
      {
        key: "1",
        index: "/assets/logo.png",
        authorName: "半辈子",
        phoneNumber: "18321355730",
        role: "shop_biz",
        authorize: "删除"
      }
    ];
    return (
      <div>
        <BreadcrumbCustom first="用户授权" />
        <div
          style={{
            margin: "24px",
            padding: "24px 32px",
            background: "#fff"
          }}
        >
          <Search
            placeholder="输入电话号码"
            enterButton="搜索"
            size="large"
            onSearch={value => console.log(value)}
          />
          <Table dataSource={data} columns={columns} pagination={false} />
        </div>
      </div>
    );
  }
}
export default Authorize;
