@ECHO OFF
:: This file can now be deleted!
:: It was used when setting up the package solution (using https://github.com/LottePitcher/opinionated-package-starter)

:: set up git
git init
git branch -M main
git remote add origin https://github.com/Zeegaan/UnusedMedia.git

:: ensure latest Umbraco templates used
dotnet new install Umbraco.Templates --force

:: use the umbraco-extension dotnet template to add the package project
cd src
dotnet new umbraco-extension -n "UnusedMedia" --site-domain 'https://localhost:44342' --include-example --allow-scripts Yes

:: replace package .csproj with the one from the template so has nuget info
cd UnusedMedia
del UnusedMedia.csproj
ren UnusedMedia_nuget.csproj UnusedMedia.csproj

:: add project to solution
cd..
dotnet sln add "UnusedMedia"

:: add reference to project from test site
dotnet add "UnusedMedia.TestSite/UnusedMedia.TestSite.csproj" reference "UnusedMedia/UnusedMedia.csproj"