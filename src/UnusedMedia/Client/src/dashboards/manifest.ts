export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: 'dashboard',
    js: () => import("./dashboard.element"),
    meta: {
      label: "Unused Media",
      pathname: "unused-media"
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Media',
      }
    ],
  }
];
