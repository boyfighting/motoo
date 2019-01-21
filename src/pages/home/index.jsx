import React from "react";
import BreadcrumbCustom from "../../components/Curmb/BreadcrumbCustom";
import "./index.scss";
export default class Home extends React.Component {
    render() {
        return (
            <div className="home-wrap">
                <BreadcrumbCustom first="" />
                <p
                    style={{
                        background: "#fff",
                        padding: "24px",
                        fontSize: "30px",
                        textAlign: "center",
                        lineHeight: "400px"
                    }}
                >
                    欢迎进入魔图音箱后台管理系统
                </p>
            </div>
        );
    }
}
