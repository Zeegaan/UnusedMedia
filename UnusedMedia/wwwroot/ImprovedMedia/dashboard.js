import {UmbLitElement} from "@umbraco-cms/backoffice/lit-element";
import {html, css} from "@umbraco-cms/backoffice/external/lit";
import {UMB_NOTIFICATION_CONTEXT} from "@umbraco-cms/backoffice/notification";
import {UMB_CURRENT_USER_CONTEXT} from "@umbraco-cms/backoffice/current-user";

export default class MyDashboardElement extends UmbLitElement {
    /** @type {import('@umbraco-cms/backoffice/notification').UmbNotificationContext} */
    #notificationContext;
    static styles = css`
        :host {
            padding: 20px;
            display: block;
            box-sizing: border-box;
        }
        #grid{
            display: grid;
            grid-template-columns: auto auto auto auto auto;
            gap: 10px;
            
        }`
    static properties = {_unusedImages: {state: true, type: Array}}

    constructor() {
        super();
        this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
            this._observeCurrentUser(instance);
        });
        this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
            this.#notificationContext = instance;
        });

        this._unusedImages = {items: []};
        this.getUnusedImages();
        
    }

    render() {
        return html`
            <uui-box>
                <div style="padding: 10px" >
                    <h1>Welcome to the improved media dashboard</h1>
                    <p>This will show unused media by the click of a button</p>
                    <uui-button look="primary" color="danger" label="Delete unused media" id="clickMe" look="secondary" @click="${this.deleteUnusedImages}"></uui-button>
                </div>

                <div id="grid">
                    ${this._unusedImages.items.map((image) => {
                        return html`
                            <div>
                                <umb-imaging-thumbnail unique="${image}" style="width: 300px;height: 300px; display:block"></umb-imaging-thumbnail>
<!--                                <uui-button label="Delete media" id="clickMe" look="secondary" @click="${() => this.deleteSingleMedia(image)}"></uui-button>-->
                            </div>`
                    })}
                </div>
            </uui-box>
        `;
    }

    async _observeCurrentUser(instance) {
        this.observe(instance.currentUser, (currentUser) => {
            this._currentUser = currentUser;
        });
    };

    async getUnusedImages() {
        const response = await fetch('https://localhost:44344/UnusedMedia/Get');
        this._unusedImages = await response.json();
    }    
    
    async deleteUnusedImages() {
        const payload = JSON.stringify(this._unusedImages.items);
        await fetch('https://localhost:44344/UnusedMedia/Delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        });
        this._unusedImages = {items: []};
        this.#notificationContext?.peek("positive", {
            data: { headline: "Unused Media deleted" },
        });
    }
}

customElements.define("improved-media", MyDashboardElement);