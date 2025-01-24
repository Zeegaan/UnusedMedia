using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace ImprovedMedia;

public class UnusedMediaComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.ConfigureOptions<ConfigureSwaggerGenOptions>();
    }
    
    private class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
    {
        public void Configure(SwaggerGenOptions options)
        {
            options.SwaggerDoc(
                "UnusedMedia",
                new OpenApiInfo { Title = "Unused Media API", Version = "1.0" }
            );
            
            // enable Umbraco authentication for the "my-item-api" Swagger document
            options.OperationFilter<UnusedMediaApiOperationSecurityFilter>();
        }
    }

    private class UnusedMediaApiOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
    {
        protected override string ApiName => "UnusedMedia";
    }
}

