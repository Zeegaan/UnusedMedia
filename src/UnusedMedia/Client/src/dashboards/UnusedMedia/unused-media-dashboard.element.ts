import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { EnhancedMediaService, MediaViewModel } from "../../api";
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from "@umbraco-cms/backoffice/notification";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent } from "@umbraco-cms/backoffice/entity-action";


@customElement('unused-media-dashboard')
export class UnusedMediaDashboardElement extends UmbLitElement {

  @state()
  private _unusedImages: Array<MediaViewModel>;

  @state()
  private _selection: Array<MediaViewModel>;

  @state()
  private _searchQuery: string = '';

  private get _filteredImages(): Array<MediaViewModel> {
    if (!this._searchQuery.trim()) {
      return this._unusedImages;
    }
    const query = this._searchQuery.toLowerCase();
    return this._unusedImages.filter(image =>
      image.name.toLowerCase().includes(query)
    );
  }

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
    const buttonElement = ev.target as HTMLElement & { state: string };
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
    eventContext?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: "media-root",
      unique: null,
    }));

    await this.getUnusedMedia();

    buttonElement.state = "success";
  }

  #onClickDeleteSelectedUnusedMedia = async (ev: Event) => {
    const buttonElement = ev.target as HTMLElement & { state: string };
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

    eventContext?.dispatchEvent(new UmbRequestReloadChildrenOfEntityEvent({
      entityType: "media-root",
      unique: null,
    }));

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

  #onSearchInput(e: InputEvent) {
    this._searchQuery = (e.target as HTMLInputElement).value;
  }

  render() {
    return html`

      <uui-box>
        <div id="header">
          <h1>Welcome to the unused media dashboard</h1>
          <p>This will show unused media by the click of a button</p>
          <div id="toolbar">
            <uui-input
              id="search"
              placeholder="Search media..."
              label="Search media"
              @input="${this.#onSearchInput}">
              <uui-icon name="icon-search" slot="prepend"></uui-icon>
            </uui-input>
            <uui-button look="primary" color="danger" label="Delete ALL unused media"
                        @click="${this.#onClickDeleteAllUnusedMedia}"></uui-button>
            <uui-button look="primary" color="positive" label="Delete selected"
                        @click="${this.#onClickDeleteSelectedUnusedMedia}"></uui-button>
          </div>
        </div>

        <div id="grid">
          ${this._filteredImages.map((image) => {
            return html`
              <uui-card-media
                .name="${image.name}"
                selectable
                select-only
                @selected=${() => this.#onSelected(image)}
                @deselected=${() => this.#onDeselected(image)}
                ?selected=${this._selection.includes(image)}>
                <umb-imaging-thumbnail
                  .unique="${image.key}"
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

export default UnusedMediaDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    'example-dashboard': UnusedMediaDashboardElement;
  }
}
