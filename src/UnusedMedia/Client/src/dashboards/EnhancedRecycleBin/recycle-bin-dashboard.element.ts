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

  @state()
  private _searchQuery: string = '';

  private get _filteredMedia(): Array<MediaViewModel> {
    if (!this._searchQuery.trim()) {
      return this._trashedMedia;
    }
    const query = this._searchQuery.toLowerCase();
    return this._trashedMedia.filter(media =>
      media.name.toLowerCase().includes(query)
    );
  }

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

  #onSearchInput(e: InputEvent) {
    this._searchQuery = (e.target as HTMLInputElement).value;
  }

  render() {
    return html`

      <uui-box>
        <div id="header">
          <h1>Welcome to the enhanced recycle bin dashboard</h1>
          <p>This will allow you to browse trashed content, much like you know the media section, and choose which to restore</p>
          <div id="toolbar">
            <uui-input
              id="search"
              placeholder="Search media..."
              label="Search media"
              @input="${this.#onSearchInput}">
              <uui-icon name="icon-search" slot="prepend"></uui-icon>
            </uui-input>
            <uui-button look="primary" color="warning" label="Restore ALL trashed media"
                        @click="${this.#onClickRestoreAll}"></uui-button>
            <uui-button look="primary" color="positive" label="Restore selected"
                        @click="${this.#onClickRestoreSelected}"></uui-button>
          </div>
        </div>

        <div id="grid">
          ${this._filteredMedia.map((media) => {
            return html`
              <uui-card-media
                .name="${media.name}"
                selectable
                select-only
                @selected=${() => this.#onSelected(media)}
                @deselected=${() => this.#onDeselected(media)}
                ?selected=${this._selection.includes(media)}>
                <umb-imaging-thumbnail
                  .unique="${media.key}"
                  .icon=${media.icon}></umb-imaging-thumbnail>
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

    #header {
      padding: 10px;
    }

    #toolbar {
      display: flex;
      gap: var(--uui-size-space-3, 12px);
      align-items: center;
      flex-wrap: wrap;
      margin-top: var(--uui-size-space-4, 15px);
    }

    #search {
      width: 300px;
    }

    #grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 200px));
      gap: var(--uui-size-space-5, 18px);
    }

    uui-card-media {
      width: 200px;
      height: 200px;
    }
  `
}

export default EnhancedRecycleBinDashboardElement;
