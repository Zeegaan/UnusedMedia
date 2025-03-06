const a = [
  {
    name: "Unused Media Entrypoint",
    alias: "UnusedMedia.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-B0ka2_S3.js")
  }
], n = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-BMDrlC0t.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], e = [
  ...a,
  ...n
];
export {
  e as manifests
};
//# sourceMappingURL=unused-media.js.map
