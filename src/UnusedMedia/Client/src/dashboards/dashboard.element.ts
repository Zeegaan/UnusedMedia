import { LitElement, css, html, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UnusedMediaService } from "../api";
import { UUIButtonElement } from "@umbraco-cms/backoffice/external/uui";
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from "@umbraco-cms/backoffice/notification";

@customElement('unused-media-dashboard')
export class ExampleDashboardElement extends UmbElementMixin(LitElement) {

  @state()
  private _unusedImages: Array<string>;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });

    this._unusedImages = [];
    this.getUnusedMedia();
  }

  #notificationContext: UmbNotificationContext | undefined = undefined;

  getUnusedMedia = async () => {

    const { data, error } = await UnusedMediaService.unusedMedia();

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.peek("warning", {
          data: {
            headline: `Could not get unused media`,
            message: `Something went wrong when trying to get the unused media.`,
          }
        })
      }
      return;
    }

    if (data !== undefined) {
      // @ts-ignore
      this._unusedImages = data.keys;
    }
  }

  #onClickDeleteUnusedMedia = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    buttonElement.state = "waiting";

    await UnusedMediaService.delete({body: this._unusedImages});
    await this.getUnusedMedia();

    if (this.#notificationContext) {
      this.#notificationContext.peek("positive", {
        data: {
          headline: `Deleted unused media`,
          message: `Successfully deleted ${this._unusedImages.length} unused media items.`,
        }
      })
    }
    buttonElement.state = "success";
  }

  render() {
    return html`

      <uui-box>
        <div style="padding: 10px">
          <h1>Welcome to the improved media dashboard</h1>
          <p>This will show unused media by the click of a button</p>
          <uui-button look="primary" color="danger" label="Delete ALL unused media" id="clickMe" look="secondary"
                      @click="${this.#onClickDeleteUnusedMedia}"></uui-button>
        </div>

        <div id="grid">
          ${this._unusedImages.map((image) => {
            return html`
                            <div>
                                <umb-imaging-thumbnail unique="${image}"
                                                       style="width: 300px;height: 300px; display:block"></umb-imaging-thumbnail>
                            </div>`
          })}
        </div>
      </uui-box>
    `;
  }

  static styles = css`
        :host {
            padding: 20px;
            display: block;
            box-sizing: border-box;
        }

        #grid {
            display: grid;
            grid-template-columns: auto auto auto auto auto;
            gap: 10px;

        }`
}

export default ExampleDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    'example-dashboard': ExampleDashboardElement;
  }
}
