import { LitElement, css, html, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {EnhancedMediaService, MediaViewModel} from "../../api";
import { UUIButtonElement } from "@umbraco-cms/backoffice/external/uui";
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from "@umbraco-cms/backoffice/notification";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";


@customElement('unused-media-dashboard')
export class UnusedMediaDashboardElement extends UmbElementMixin(LitElement) {

  @state()
  private _unusedImages: Array<MediaViewModel>;

  @state()
  private _selection: Array<MediaViewModel>;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });


    this._unusedImages = [];
    this._selection = [];
    this.getUnusedMedia();
  }

  #notificationContext: UmbNotificationContext | undefined = undefined;

  getUnusedMedia = async () => {

    this._unusedImages = [];
    const { data, error } = await EnhancedMediaService.unusedMedia();

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
      this._unusedImages = data.items;
    }
  }

  #onClickDeleteAllUnusedMedia = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    buttonElement.state = "waiting";

    await EnhancedMediaService.delete({body: this._unusedImages});
    if (this.#notificationContext) {
      this.#notificationContext.peek("positive", {
        data: {
          headline: `Deleted unused media`,
          message: `Successfully deleted ${this._unusedImages.length} unused media items.`,
        }
      })
    }

    const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
    eventContext.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: "media-root",
      unique: null,
    }));

    await this.getUnusedMedia();

    buttonElement.state = "success";
  }

  #onClickDeleteSelectedUnusedMedia = async (ev: Event) => {
    const buttonElement = ev.target as UUIButtonElement;
    buttonElement.state = "waiting";

    await EnhancedMediaService.delete({body: this._selection});

    if (this.#notificationContext) {
      this.#notificationContext.peek("positive", {
        data: {
          headline: `Deleted unused media`,
          message: `Successfully deleted ${this._selection.length} unused media items.`,
        }
      })
    }

    const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);

    eventContext.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: "media-root",
      unique: null,
    }))

    this._selection = [];
    await this.getUnusedMedia();
    buttonElement.state = "success";
  }

  #onSelected(item: MediaViewModel) {
    this._selection.push(item);
    this.requestUpdate("_selection");
  }

  #onDeselected(item: MediaViewModel) {
    this._selection = this._selection.filter((value) => value !== item);
  }

  render() {
    return html`

      <uui-box>
        <div style="padding: 10px">
          <h1>Welcome to the unused media dashboard</h1>
          <p>This will show unused media by the click of a button</p>
          <uui-button look="primary" color="danger" label="Delete ALL unused media" id="clickMe" look="secondary"
                      @click="${this.#onClickDeleteAllUnusedMedia}"></uui-button>
          <uui-button look="primary" color="positive" label="Delete selected" id="clickMe" look="secondary"
                      @click="${this.#onClickDeleteSelectedUnusedMedia}"></uui-button>
        </div>

        <div id="grid">
          ${this._unusedImages.map((image) => {
            return html`
                              <uui-card-media
                                .name="${image.name}"
                                selectable="true"
                                select-only="true"
                                @selected=${() => this.#onSelected(image)}
                                @deselected=${() => this.#onDeselected(image)}
                                ?selected=${this._selection.includes(image)}>
                              <umb-imaging-thumbnail
                                .unique="${image.key}"
                                width="300"
                                height="300"
                                style="width: 300px;height: 300px; display:block"
                                .icon=${image.icon}></umb-imaging-thumbnail>
                            </uui-card-media>`
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
            grid-template-columns: auto auto auto auto;
            gap: 10px;

        }`
}

export default UnusedMediaDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    'example-dashboard': UnusedMediaDashboardElement;
  }
}
