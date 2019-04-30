(function () {
    const template = document.createElement('template');
    template.innerHTML = `
    <style lang="css">
        :host {
            display: block;
        }
        :host[hidden] {
            display: none;
        }
    </style>
    <slot name="list"></slot>
    `;

    class ScriptureList extends HTMLElement {
        constructor() {
            super();

            console.group("ScriptureList Constructor:");

            this.attachShadow({mode: 'open'});
            console.trace("attaching shadowRoot", {"shadowRoot": this.shadowRoot, template});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            console.groupEnd();
        }

    }

    window.customElements.define('scripture-list', ScriptureList);
})();

(function () {
    const styleString = `
    <style>
        :host {
            display: block;
        }
        :host[hidden] {
            display: none;
        }

        :host #reference::before {
            content: '❯';
            display: inline-block;
            width: 25px;
        }
        :host([open]) #reference::before {
            content: '⏷';
        }

        :host #text {
            display: none;
        }

        :host #text:empty::after {
            content: 'Loading...';
        }

        :host([open]) #text {
            display: block;
            padding-left: 25px;
        }
    </style>
    `;

    class ScripturePassage extends HTMLElement {

        constructor() {
            super();
            console.group("ScripturePassage Constructor:");
            console.debug(this);

            const template = document.createElement('template');
            template.innerHTML += `
                ${styleString}
                <summary id="reference">${this.reference}</summary>
                <div id="text"></div>
            `;
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            if (this.hasAttribute("api")) {
                this.api = eval(this.getAttribute("api"));
            }

            this.passages = undefined;
            if (this.open) {
                this._query();
            }
            console.groupEnd();
        }

        connectedCallback() {
            console.group("ScripturePassage ConnectedCallback:");

            console.debug("api attribute:", this.getAttribute("api"))
            this.addEventListener('mousedown', this._mouseDown);
            console.groupEnd();
        }

        disconnectedCallback() {
            this.api = null;
        }


        _query() {
            return this.api.query(this.reference)
                .then(passages => {
                    this.passages = passages;
                });
        }

        _mouseDown(event) {
            if (!this.api) return; //maybe toggle the .open??

            console.group("mouseDown", event);
            if (this.passages.length !== 0) {
                this.open = !this.open;
            } else {
                if ('SUMMARY' === event.path[0].tagName) {
                    this._query().then(() => this.open = !this.open);
                }
            }
            console.groupEnd();
        }


        
        get reference() {
            return this.getAttribute("reference");
        }

        set reference(val) {
            this.setAttribute("reference", val);
        }

        get open() {
            return this.hasAttribute('open');
        }

        set open(val) {
            if (val) {
                this.setAttribute('open', '');
            } else {
                this.removeAttribute('open');
            }
        }

        get passages() {
            return this.shadowRoot.querySelectorAll('#text > *');
        }

        set passages(val) {
            const textNode = this.shadowRoot.querySelector('#text');
            if (val instanceof String) {
                textNode.innerHTML = val;
            }

            if (val instanceof Element) {
                textNode.insertAdjacentElement('beforeend', val);
            }

            if (Array.isArray(val)) {
                val.forEach(passage => textNode.insertAdjacentElement('beforeend', passage));
            }
        }

    }

    window.customElements.define('scripture-passage', ScripturePassage);
})();

