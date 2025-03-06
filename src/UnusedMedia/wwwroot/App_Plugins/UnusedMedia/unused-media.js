const a = [
  {
    name: "Unused Media Entrypoint",
    alias: "UnusedMedia.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-DManBCJP.js")
  }
], e = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: "dashboard",
    js: () => import("./unused-media-dashboard.element-Bgi-6Qze.js"),
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
    js: () => import("./recycle-bin-dashboard.element-xKiwf-Gl.js"),
    meta: {
      label: "EnhancedRecycleBin",
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
