const menuList = [
  {
    title: "设备管理",
    key: "/admin/devicemanagement",
    icon: "appstore",
    children: [
      {
        title: "设备分组",
        key: "/admin/devicemanagement/devicegroup",
        icon: " "
      },
      {
        title: "未分组设备",
        key: "/admin/devicemanagement/unGroupDevice",
        icon: " "
      }
    ]
  },
  {
    title: "管理员授权",
    key: "/admin/authorize",
    icon: "team"
  },
  {
    title: "区域管理",
    key: "/admin/partManagement",
    icon: "area-chart"
  },
  {
    title: "授权码生成",
    key: "/admin/authorizationcode",
    icon: "barcode"
  },
  {
    title: "应急广播",
    key: "/admin/emergencyBroadcast",
    icon: "sound"
  }
];

export default menuList;
