const a = [
  {
    name: "Unused Media Entrypoint",
    alias: "UnusedMedia.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-Ck-h-HB4.js")
  }
], e = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-Dai8AUme.js"),
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
  ...a,
  ...e
];
export {
  n as manifests
};
//# sourceMappingURL=unused-media.js.map
