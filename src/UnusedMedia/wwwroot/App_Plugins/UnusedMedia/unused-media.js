const a = [
  {
    name: "Unused Media Entrypoint",
    alias: "UnusedMedia.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-B8FalLxl.js")
  }
], e = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: "dashboard",
    js: () => import("./unused-media-dashboard.element-DViXDEia.js"),
    meta: {
      label: "Unused Media",
      pathname: "unused-media"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Media"
      }
    ]
  }
], n = [
  {
    name: "Recycle bin dashboard",
    alias: "EnhancedRecycleBin.Dashboard",
    type: "dashboard",
    js: () => import("./recycle-bin-dashboard.element-Dp6x0KXC.js"),
    meta: {
      label: "Enhanced Recycle Bin",
      pathname: "enhanced-recycle-bin"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Media"
      }
    ]
  }
], i = [
  ...a,
  ...e,
  ...n
];
export {
  i as manifests
};
//# sourceMappingURL=unused-media.js.map
