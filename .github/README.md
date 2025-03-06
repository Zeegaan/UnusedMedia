# Enhanced Media

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.UnusedMedia?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.UnusedMedia/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.UnusedMedia?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.UnusedMedia)
[![GitHub license](https://img.shields.io/github/license/Zeegaan/UnusedMedia?color=8AB803)](../LICENSE)

This package enhances the media section in Umbraco by adding a new dashboard to the media section that shows all media items that are not used in the content of the website.
<img alt="Unused media dashboard" src="https://github.com/Zeegaan/UnusedMedia/blob/main/.github/img.png">
It also has a dashboard to see trashed media items, and the functionality to choose multiple media to restore, or restore all of the trashed media.



<!--
Including screenshots is a really good idea! 

If you put images into /docs/screenshots, then you would reference them in this readme as, for example:

<img alt="..." src="https://github.com/Zeegaan/UnusedMedia/blob/develop/docs/screenshots/screenshot.png">
-->

## Installation

Add the package to an existing Umbraco website (v15+) from nuget:

`dotnet add package Umbraco.Community.EnhancedMedia`

Add some Media do your site, ensure it's not referenced somewhere.
Navigate to the media section in the backoffice, and you will see a new dashboard called "Unused Media", and also a "Enhanced Recycling Bin" dashboard
.

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).