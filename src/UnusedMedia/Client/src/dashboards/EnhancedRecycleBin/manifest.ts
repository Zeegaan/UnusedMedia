export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Recycle bin dashboard",
    alias: "EnhancedRecycleBin.Dashboard",
    type: 'dashboard',
    js: () => import("./recycle-bin-dashboard.element.ts"),
    meta: {
      label: "EnhancedRecycleBin",
      pathname: "enhanced-recycle-bin"
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Media',
      }
    ],
  }
];
