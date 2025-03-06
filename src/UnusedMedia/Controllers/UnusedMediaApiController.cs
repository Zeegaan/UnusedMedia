using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using UnusedMedia.ViewModels;

namespace UnusedMedia.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "UnusedMedia")]
    public class UnusedMediaApiController : UnusedMediaApiControllerBase
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
            return Ok(new UnusedMediaViewModel { Keys = unrelatedMedia.Select(x => x.Key) });
        }

        [HttpPost("delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(List<Guid> mediaKeys)
        {
            foreach (var key in mediaKeys)
            {
                await _mediaEditingService.MoveToRecycleBinAsync(key, Umbraco.Cms.Core.Constants.Security.SuperUserKey);
            }

            return Ok();
        }
    }
}
