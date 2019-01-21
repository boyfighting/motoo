import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import Router from "./router";
import { Provider } from "react-redux";
import createStore from "./redux/store/configureStore";
import registerServiceWorker from "./registerServiceWorker";
// Redux Store对象，管理所有的Redux状态
// const store = configureStore;
const store = createStore();
ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <Router />
    </LocaleProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
