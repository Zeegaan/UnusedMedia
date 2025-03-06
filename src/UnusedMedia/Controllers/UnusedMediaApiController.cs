using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Services;
using UnusedMedia.ViewModels;

namespace UnusedMedia.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "EnhancedMedia")]
    public class UnusedMediaApiController : EnhancedMediaApiControllerBase
    {
        private readonly IEntityService _entityService;
        private readonly IMediaEditingService _mediaEditingService;
        private readonly IRelationService _relationService;

        public UnusedMediaApiController(
            IEntityService entityService,
            IMediaEditingService mediaEditingService,
            IRelationService relationService)
        {
            _entityService = entityService;
            _mediaEditingService = mediaEditingService;
            _relationService = relationService;
        }

        [HttpGet("all")]
        [ProducesResponseType<UnusedMediaViewModel>(StatusCodes.Status200OK)]
        public IActionResult UnusedMedia()
        {
            IEnumerable<IMediaEntitySlim> media = _entityService
                .GetAll(UmbracoObjectTypes.Media, Array.Empty<int>())
                .OfType<IMediaEntitySlim>()
                .ToArray();

            var unrelatedMedia = media.Where(x => _relationService.IsRelated(x.Id) is false);

            return Ok(new PagedViewModel<UnusedMediaViewModel>() { Items = unrelatedMedia.Select(Map) });
        }

        private UnusedMediaViewModel Map(IMediaEntitySlim source)
        {
            return new UnusedMediaViewModel
            {
                Key = source.Key,
                Name = source.Name ?? "Could not find name",
                Icon = source.ContentTypeIcon ?? Umbraco.Cms.Core.Constants.Icons.MediaType
            };
        }

        [HttpPost("delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(List<UnusedMediaViewModel> mediaKeys)
        {
            foreach (var key in mediaKeys.Select(x => x.Key))
            {
                await _mediaEditingService.MoveToRecycleBinAsync(key, Umbraco.Cms.Core.Constants.Security.SuperUserKey);
            }

            return Ok();
        }

        [HttpPut("restore")]
        [ProducesResponseType<UnusedMediaViewModel>(StatusCodes.Status200OK)]
        public async Task<IActionResult> RestoreAll(List<UnusedMediaViewModel> medias)
        {
            foreach (var key in medias.Select(x => x.Key))
            {
                await _mediaEditingService.RestoreAsync(key, null, Umbraco.Cms.Core.Constants.Security.SuperUserKey);
            }

            return Ok();
        }

        [HttpGet("get-recycle-bin")]
        [ProducesResponseType<UnusedMediaViewModel>(StatusCodes.Status200OK)]
        public async Task<IActionResult> RecycleBinMedia()
        {
            IEntitySlim[] rootEntities = _entityService
                .GetPagedTrashedChildren(Umbraco.Cms.Core.Constants.System.RecycleBinMediaKey, UmbracoObjectTypes.Media, 0, 100, out var totalItems)
                .ToArray();

            return Ok(new PagedViewModel<UnusedMediaViewModel>() { Items = rootEntities.Select(x => (IMediaEntitySlim)x).Select(Map) });
        }
    }
}
