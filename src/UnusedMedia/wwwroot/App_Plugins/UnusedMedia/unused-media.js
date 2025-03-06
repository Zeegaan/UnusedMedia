const a = [
  {
    name: "Unused Media Entrypoint",
    alias: "UnusedMedia.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-B6uDc8CJ.js")
  }
], e = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: "dashboard",
    js: () => import("./unused-media-dashboard.element-CBZ3UlHJ.js"),
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
    js: () => import("./recycle-bin-dashboard.element-kazV3Vve.js"),
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
