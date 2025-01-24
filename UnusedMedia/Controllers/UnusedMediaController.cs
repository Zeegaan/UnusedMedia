using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Services;

namespace ImprovedMedia.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Filters")]
public class UnusedMediaController : UmbracoUnusedMediaControllerBase
{
    private readonly IEntityService _entityService;
    private readonly IMediaEditingService _mediaEditingService;
    private readonly IRelationService _relationService;

    public UnusedMediaController(IEntityService entityService, IMediaEditingService mediaEditingService, IRelationService relationService)
    {
        _entityService = entityService;
        _mediaEditingService = mediaEditingService;
        _relationService = relationService;
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Get()
    {
        IEnumerable<IMediaEntitySlim> media = _entityService
            .GetAll(UmbracoObjectTypes.Media, Array.Empty<int>())
            .OfType<IMediaEntitySlim>()
            .ToArray();
        
        var unrelatedMedia = media.Where(x => _relationService.IsRelated(x.Id) is false);
        return Ok(new { Items = unrelatedMedia.Select(x => x.Key) });
    }

    [HttpPost("delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(List<Guid> mediaKeys)
    {
        foreach (var key in mediaKeys)
        {
            await _mediaEditingService.MoveToRecycleBinAsync(key, Constants.Security.SuperUserKey);
        }

        return Ok();
    }
}