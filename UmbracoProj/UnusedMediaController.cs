using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Services;

namespace UmbracoProj;

[ApiController]
[Route("[controller]/[action]")]
public class UnusedMediaController : Controller
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

    [HttpGet]
    public IActionResult Get()
    {
        IEnumerable<IMediaEntitySlim> media = _entityService
            .GetAll(UmbracoObjectTypes.Media, Array.Empty<int>())
            .OfType<IMediaEntitySlim>()
            .ToArray();
        
        var unrelatedMedia = media.Where(x => _relationService.IsRelated(x.Id) is false);
        return Ok(new { Items = unrelatedMedia.Select(x => x.Key) });
    }

    [HttpPost]
    public async Task<IActionResult> Delete(List<Guid> mediaKeys)
    {
        foreach (var key in mediaKeys)
        {
            await _mediaEditingService.MoveToRecycleBinAsync(key, Constants.Security.SuperUserKey);
        }

        return Ok();
    }
}