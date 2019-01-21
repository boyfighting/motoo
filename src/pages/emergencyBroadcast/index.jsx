import React from "react";
import { Map, MouseTool, Markers, Polygon, PolyEditor } from "react-amap";
import { connect } from "react-redux";
import {
  Button,
  message,
  Modal,
  Input,
  Table,
  Tabs,
  Pagination,
  Icon
} from "antd";
import _ from "lodash";
import actions from "../../../src/axios/deviceModule";
import "./index.scss";

// 39.9071027057,116.3956832886 北京
const TabPane = Tabs.TabPane;
let areaName = "";
let areaPosition = [];
let pageIndex = 1;
let selectMarks = {};
let soundsDatas = [];
let boxs = [];
let filterData = [];
let mp3Url = "";
const {
  createArea,
  getArea,
  deleteArea,
  getMzVoiceList,
  getMzVoices,
  getMzVoiceListPublic,
  pushRadio,
  getSoundBox
} = actions;

class EmergencyBroadcast extends React.Component {
  constructor() {
    super();
    const self = this;
    this.state = {
      getAreaList: [],
      polygonActive: false,
      isEdit: false,
      isDraw: false,
      markers: [],
      visible: false,
      random: 1,
      drawDown: false,
      tableModal: false,
      btnDis: false,
      drawPath: [],
      saveModal: false,
      noMark: true,
      emptyVoice: true,
      listCount: 0,
      voiceList: [],
      selectedVoices: [],
      voiceListPublic: [],
      listenVisible: false
    };
    this.toolEvents = {
      created: tool => {
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      }
    };
    this.editorEvents = {
      created: () => {},
      addnode: () => {},
      adjust: e => {
        // console.log("----------编辑后端点坐标----------");
        // console.log(e.target.Ig.path);
        const editMarks = e.target.Ig.path;
        this.setArea(editMarks);
        areaPosition = editMarks;
        // console.log(areaPosition);
      },
      removenode: () => {},
      end: () => {}
    };
    this.markerEvents = {
      mouseover: (e, marker) => {},
      mouseout: (e, marker) => {},
      click: e => {
        // console.log(e);
      },
      created: markerInstance => {
        // console.log("高德地图 Marker 实例创建成功。");
      }
    };
    this.polygonEvents = {
      click: () => {},
      created: () => {},
      mouseover: () => {},
      dblclick: () => {}
    };

    this.mapPlugins = ["ToolBar"];
    this.mapCenter = { longitude: 120, latitude: 35 };
  }

  MapPlugins = () => {
    return [
      "Scale",
      "OverView",
      {
        name: "ToolBar",
        options: {
          visible: true,
          onCreated(ins) {},
          autoPosition: true
        }
      }
    ];
  };

  drawCircle() {
    this.setState({ drawPath: [] });
    this.setState({ drawDown: false });
    message.warn("请按住鼠标左键拖拽框选...");
    if (this.tool) {
      this.tool.rectangle();
    }
    this.setState({ isDraw: true, btnDis: true });
  }

  closeDraw() {
    if (this.tool) {
      this.tool.close();
    }
    this.setState({ isDraw: false, btnDis: false });
  }

  cleanDraw() {
    // this.tool.close(true);
    this.setState({ drawPath: [] });
    this.setState({ drawDown: false, btnDis: false });
  }

  // 编辑
  togglePolygon() {
    this.setState({
      polygonActive: !this.state.polygonActive,
      isEdit: !this.state.isEdit
    });
  }

  handleCancel() {
    this.setState({ saveModal: false });
    this.setState({ tableModal: false });
  }

  handleCancel2() {
    this.setState({ listenVisible: false });
    let audioPauew = document.getElementById("audio");
    audioPauew.pause();
  }

  inputName(e) {
    areaName = e.target.value;
  }

  drawWhat(obj) {
    this.setState({ mapObj: obj });
    const ln1 = _.get(obj.getPath()[0], "lng");
    const ln2 = _.get(obj.getPath()[1], "lng");
    const ln3 = _.get(obj.getPath()[2], "lng");
    const ln4 = _.get(obj.getPath()[3], "lng");
    const la1 = _.get(obj.getPath()[0], "lat");
    const la2 = _.get(obj.getPath()[1], "lat");
    const la3 = _.get(obj.getPath()[2], "lat");
    const la4 = _.get(obj.getPath()[3], "lat");
    const d1 = [ln1, la1];
    const d2 = [ln2, la2];
    const d3 = [ln3, la3];
    const d4 = [ln4, la4];
    const selectedMarks = [d1, d2, d3, d4];
    this.setState({ drawPath: obj.getPath() });
    console.log("--------------画图结束--------------");
    if (ln2 === undefined) {
      message.warn("请按住鼠标左键拖拽框选...", 5);
      this.setState({ drawDown: false });
      this.setState({ visible: true, btnDis: false });
    } else {
      this.setState({ drawDown: true });
      this.closeDraw();
      this.setState({ visible: false });
      this.setArea(selectedMarks);
      areaPosition = obj.getPath();
    }
  }
  setArea(resMarks) {
    let polyCount = 0;
    let json = [];
    const mapMarker = this.state.markers;
    mapMarker.map((ele, i) => {
      const longitude = _.get(ele, "position.lng", 0);
      const latitude = _.get(ele, "position.lat", 0);
      const marks = [longitude, latitude];
      if (AMap.GeometryUtil.isPointInRing(marks, resMarks) === true) {
        polyCount = polyCount++ + 1;
        const lng = marks[0];
        const lat = marks[1];
        const positionObj = { lng: lng, lat: lat };
        json.push(positionObj);
        const openJson = [...json];
        selectMarks = openJson;
      }
      return i;
    });
    if (polyCount === 0) {
      this.tool.close(true);
      this.setState({ noMark: true, emptyVoice: true });
    } else {
      const data = selectMarks;
      this.setState({ noMark: true, btnDis: true, emptyVoice: false });
      message.success(
        `您选中了 ${polyCount} 个广播`,
        3,
        this.mapDataSubmit(data)
      );
    }
  }

  playVoice() {
    getMzVoiceList().then(res => {
      if (res.Result === 200) {
        this.setState({ voiceList: res.Data.items });
        const id = res.Data.items[0].id;
        getMzVoices(id).then(res => {
          if (res.Result === 200) {
            this.setState({ selectedVoices: res.Data.items });
          } else {
            message.error("网络请求错误,请刷新重试...");
          }
        });
      } else {
        message.error("网络请求错误,请刷新重试...");
      }
    });

    //这里的200毫秒延迟是为了让第一个tab先请求，之后请求第二个，让第一个tab标签默认永远在第一位置。
    getMzVoiceListPublic().then(res => {
      if (res.Result === 200) {
        setTimeout(() => {
          this.setState({ voiceListPublic: res.Data.items });
        }, 200);
      } else {
        message.error("网络请求错误,请刷新重试...");
      }
    });

    if (this.state.emptyVoice) {
      message.warn("您未选择任何内容");
    } else {
      this.setState({ tableModal: true });
    }
  }

  mapDataSubmit(data) {
    let mapLat = NaN;
    let mapLng = NaN;
    let mapArrs = [];
    let soundArrs = [];
    this.tool.close(true);
    data.map((res, index) => {
      mapLat = parseFloat(res.lat);
      mapLng = parseFloat(res.lng);
      let mapP = { lng: mapLng, lat: mapLat };
      mapArrs.push(mapP);
      return index;
    });
    const datas = soundsDatas[0].Data.items;
    datas.map((res, index) => {
      const soundPositionLat = parseFloat(_.get(res, "location.latitude", 0));
      const soundPositionLng = parseFloat(_.get(res, "location.longitude", 0));
      if (soundPositionLat !== 0 && soundPositionLng !== 0) {
        let soundP = { lng: soundPositionLng, lat: soundPositionLat };
        soundArrs.push(soundP);
        let same = soundArrs.filter(item =>
          mapArrs.some(ele => ele.lng === item.lng)
        );
        datas.filter(item => {
          same.map(res => {
            if (res.lng === parseFloat(_.get(item, "location.longitude"))) {
              boxs.push(item);
              return (filterData = Array.from(new Set(boxs)));
            } else {
              return index;
            }
          });
          return index;
        });
      }
      return index;
    });
    // console.log(mapArrs);
    // console.log(soundArrs);
    // console.log(datas);
    // console.log(filterData);
  }

  changePages(index) {
    pageIndex = index;
    this.getAreasFun(pageIndex);
  }

  getAreasFun(res) {
    const params = {
      orgId: this.props.orgsId,
      pageIndex: res,
      pageSize: 5
    };
    getArea(params).then(res => {
      if (res.Result === 200) {
        const datas = res.Data.items;
        this.setState({ getAreaList: datas });
        this.setState({ listCount: res.Data.count });
      } else {
        message.error("网络请求错误,请刷新重试...");
      }
    });
  }

  componentDidMount() {
    let json = [];
    setTimeout(() => {
      pageIndex = 1;
      this.getAreasFun(pageIndex);
      getSoundBox(this.props.orgsId).then(res => {
        soundsDatas.push(res);
        res.Data.items.map((res, index) => {
          const longitude = _.get(res, "location.longitude", 0.0);
          const latitude = _.get(res, "location.latitude", 0.0);
          const positionObj = {
            position: {
              lng: parseFloat(longitude),
              lat: parseFloat(latitude)
            }
          };
          json.push(positionObj);
          const openJson = [...json];
          selectMarks = openJson;
          this.setState({ markers: selectMarks });
          return index;
        });
      });
    }, 1000);
  }

  saveBtn() {
    this.setState({ saveModal: true });
  }

  submitArea() {
    if (areaName === "") {
      message.error("请输入名称");
    } else {
      const params = {
        orgId: this.props.orgsId,
        name: areaName,
        mapData: areaPosition
      };
      createArea(params)
        .then(res => {
          if (res.Result === 200) {
            message.success("保存成功");
            this.setState({ saveModal: false });
            this.getAreasFun(pageIndex);
            this.cleanDraw();
          } else {
            message.error("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  deleteAreaFn(id) {
    deleteArea(id).then(res => {
      if (res.Result === 200) {
        message.success("删除成功");
        this.getAreasFun(pageIndex);
      } else {
        message.error("删除失败");
      }
    });
  }

  showArea(res) {
    const paths = res.mapData;
    this.setState({ drawPath: paths, isEdit: false, polygonActive: false });
    this.setState({
      noMark: true,
      emptyVoice: false,
      drawDown: true
    });
    areaPosition = paths;
    this.setArea([paths]);
  }

  editThisItem(res) {
    console.log(res);
  }

  changeTab(id) {
    getMzVoices(id).then(res => {
      if (res.Result === 200) {
        this.setState({ selectedVoices: res.Data.items });
      } else {
        message.error("网络请求错误,请刷新重试...");
      }
    });
  }
  pushVoice(res) {
    let soundBoxId = "";
    let name = "";
    let soundBoxKey = "";
    let url = res.url;
    let paramsArr = [];
    filterData.map((res, index) => {
      soundBoxId = _.get(res, "soundBoxId");
      name = _.get(res, "name", "empty name");
      soundBoxKey = _.get(res, "soundBoxKey");
      let datas = {
        soundBoxId: soundBoxId,
        name: name,
        soundBoxKey: soundBoxKey
      };
      paramsArr.push(datas);
      return index;
    });
    const params = {
      audioUrl: url,
      soundBoxs: paramsArr
    };
    pushRadio(params).then(res => {
      if (res.Result === 200) {
        message.success("插播成功");
      } else {
        message.error("网络异常请重试...");
      }
    });
  }

  playMusic(res) {
    console.log(res);
    this.setState({ listenVisible: true });
    mp3Url = res.url;
  }

  render() {
    let Plugins = this.MapPlugins();
    const columns = [
      {
        title: "预览",
        width: 50,
        key: Math.random(),
        render: res => {
          return (
            <Icon
              type="caret-right"
              className={"playIcon"}
              onClick={this.playMusic.bind(this, res)}
            />
          );
        }
      },
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        width: 200
      },
      {
        title: "日期",
        dataIndex: "createDateTime",
        key: "createDateTime"
      },
      {
        title: "发布者",
        dataIndex: "creatorName",
        key: "creatorName"
      },
      {
        title: "操作",
        render: res => {
          return (
            <div>
              <Button onClick={this.pushVoice.bind(this, res)}>插播</Button>
            </div>
          );
        }
      }
    ];

    const areaList = this.state.getAreaList;
    const areaListItem = areaList.map((res, index) => {
      return (
        <div
          className={"areaList"}
          key={res.id}
          onClick={() => {
            this.showArea(res);
          }}
        >
          <p className={"alp fl"}>
            名称: <span>{res.name}</span>
          </p>
          <p className={"fr"}>
            {/* <Button
              type="primary"
              size={"small"}
              onClick={() => {
                this.editThisItem(res);
              }}
              className={"listButton"}
            >
              XXX
            </Button> */}
            <Button
              type="danger"
              size={"small"}
              onClick={() => {
                this.deleteAreaFn(res.id);
              }}
            >
              删除
            </Button>
          </p>
        </div>
      );
    });

    const Cbname = this.state.voiceList.map((res, index) => {
      const datas = this.state.selectedVoices;
      return (
        <TabPane tab={res.name} key={res.id}>
          <Table
            dataSource={datas}
            columns={columns}
            pagination={true}
            size="small"
            rowKey={res => {
              return res.id;
            }}
          />
        </TabPane>
      );
    });
    const CbNamePublic = this.state.voiceListPublic.map((res, index) => {
      const datasPub = this.state.selectedVoices;
      return (
        <TabPane tab={res.name} key={res.id}>
          <Table
            dataSource={datasPub}
            columns={columns}
            pagination={true}
            size="small"
            rowKey={res => {
              return res.id;
            }}
          />
        </TabPane>
      );
    });
    return (
      <div id="app" className={"map"}>
        <Map
          key={this.state.random}
          amapkey={"8b233fd5d16183fcdf2497c574cd2f4b"}
          version={"1.4.7"}
          zoom={11}
          ref="map"
          plugins={Plugins}
          className={"mapPosi"}
        >
          <div className={"floatDiv"}>
            <div className={"newAreaBtn"}>
              <Button
                type="primary"
                onClick={() => {
                  this.drawCircle();
                }}
                disabled={this.state.btnDis}
              >
                新建区域
              </Button>
            </div>
            {areaListItem}
            <Pagination
              className={"pagi"}
              defaultCurrent={1}
              size={"small"}
              current={pageIndex}
              pageSize={5}
              total={this.state.listCount}
              onChange={this.changePages.bind(this)}
            />
          </div>
          <Polygon
            style={{
              strokeWeight: 1,
              fillOpacity: 0.4,
              fillColor: "#0081cc",
              strokeColor: "#0081cc",
              strokeOpacity: 0.8
            }}
            events={this.polygonEvents}
            path={this.state.drawPath}
          >
            <PolyEditor
              active={this.state.polygonActive}
              events={this.editorEvents}
            />
          </Polygon>
          <Markers markers={this.state.markers} events={this.markerEvents} />
          <MouseTool events={this.toolEvents} />

          {this.state.isDraw === true ? (
            <Button
              className={"closeDrawBtn"}
              onClick={() => {
                this.closeDraw();
              }}
            >
              关闭画图
            </Button>
          ) : (
            ""
          )}
          {this.state.drawDown === true && this.state.noMark === true ? (
            <div>
              <Button
                className={"clean"}
                onClick={() => {
                  this.cleanDraw();
                }}
                type="danger"
              >
                关闭
              </Button>
              <Button
                className={"play"}
                onClick={() => {
                  this.playVoice();
                }}
              >
                音频插播
              </Button>
              <Button
                className={"save"}
                onClick={() => {
                  this.saveBtn();
                }}
                type="primary"
              >
                保存
              </Button>
              <Button
                className={"edit"}
                onClick={() => {
                  this.togglePolygon();
                }}
              >
                {this.state.isEdit ? "关闭编辑" : "编辑"}
              </Button>
            </div>
          ) : (
            ""
          )}
        </Map>
        <Modal
          title="是否确认提交"
          visible={this.state.saveModal}
          onOk={this.submitArea.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          key={Math.random()}
          width={360}
        >
          <p>
            名称:
            <Input
              className={"modalInp"}
              onChange={this.inputName}
              placeholder={"请输入名称"}
              autoFocus
            />
          </p>
        </Modal>

        <Modal
          title="音频插播"
          className={"voiceModal"}
          visible={this.state.tableModal}
          onOk={this.handleCancel.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          style={{ top: 20 }}
        >
          <Tabs tabPosition={"left"} onChange={this.changeTab.bind(this)}>
            {Cbname}
            {CbNamePublic}
          </Tabs>
        </Modal>
        <Modal
          title="试听预览"
          className={"playModal"}
          visible={this.state.listenVisible}
          onOk={this.handleCancel.bind(this)}
          onCancel={this.handleCancel2.bind(this)}
          style={{ top: 20 }}
          footer={null}
        >
          <audio src={mp3Url} controls={"controls"} id={"audio"}>
            您的浏览器不支持h5播放器插件...
          </audio>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    orgsId: state.manageOrgsId
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmergencyBroadcast);
