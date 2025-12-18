import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { EnhancedMediaService, MediaViewModel } from "../../api";
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from "@umbraco-cms/backoffice/notification";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";


@customElement('enhanced-recycle-bin-dashboard')
export class EnhancedRecycleBinDashboardElement extends UmbLitElement {

  @state()
  private _trashedMedia: Array<MediaViewModel>;

  @state()
  private _selection: Array<MediaViewModel>;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });


    this._trashedMedia = [];
    this._selection = [];
    this.getRecycleBinMedia();
  }

  #notificationContext: UmbNotificationContext | undefined = undefined;

  getRecycleBinMedia = async () => {

    this._trashedMedia = [];
    const { data, error } = await EnhancedMediaService.recycleBinMedia();

    if (error) {
      if (this.#notificationContext) {
        this.#notificationContext.peek("warning", {
          data: {
            headline: `Could not get media from recycle bin`,
            message: `Something went wrong when trying to get the media from the recycle bin.`,
          }
        })
      }
      return;
    }

    if (data !== undefined) {
      // @ts-ignore
      this._trashedMedia = data.items;
    }
  }

  #onClickRestoreAll = async (ev: Event) => {
    const buttonElement = ev.target as HTMLElement & { state: string };
    buttonElement.state = "waiting";

    await EnhancedMediaService.restoreAll({body: this._trashedMedia});
    if (this.#notificationContext) {
      this.#notificationContext.peek("positive", {
        data: {
          headline: `Restored all trashed media`,
          message: `Successfully restored ${this._trashedMedia.length} trashed media items.`,
        }
      })
    }

    const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
    eventContext?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: "media-root",
      unique: null,
    }));

    await this.getRecycleBinMedia();

    buttonElement.state = "success";
  }

  #onClickRestoreSelected = async (ev: Event) => {
    const buttonElement = ev.target as HTMLElement & { state: string };
    buttonElement.state = "waiting";

    await EnhancedMediaService.restoreAll({body: this._selection});

    if (this.#notificationContext) {
      this.#notificationContext.peek("positive", {
        data: {
          headline: `Restored selected media`,
          message: `Successfully restored ${this._selection.length} trashed media items.`,
        }
      })
    }

    const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);

    eventContext?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: "media-root",
      unique: null,
    }));

    this._selection = [];
    await this.getRecycleBinMedia();
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
          <h1>Welcome to the enhanced recycle bin dashboard</h1>
          <p>This will allow you to browse trashed content, much like you know the media section, and choose which to restore</p>
          <uui-button look="primary" color="warning" label="Restore ALL trashed media" id="clickMe" look="secondary"
                      @click="${this.#onClickRestoreAll}"></uui-button>
          <uui-button look="primary" color="positive" label="Restore selected" id="clickMe" look="secondary"
                      @click="${this.#onClickRestoreSelected}"></uui-button>
        </div>

        <div id="grid">
          ${this._trashedMedia.map((image) => {
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
                                icon=${image.icon}></umb-imaging-thumbnail>
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

export default EnhancedRecycleBinDashboardElement;
