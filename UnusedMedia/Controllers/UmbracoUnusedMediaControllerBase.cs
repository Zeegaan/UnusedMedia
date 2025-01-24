using Microsoft.AspNetCore.Authorization;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Web.Common.Authorization;

namespace ImprovedMedia.Controllers;

[VersionedApiBackOfficeRoute("UnusedMedia")]
[MapToApi("UnusedMedia")]
[Authorize(Policy = AuthorizationPolicies.SectionAccessMedia)]
public class UmbracoUnusedMediaControllerBase : ManagementApiControllerBase
{
}