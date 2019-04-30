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
            position: relative;
        }
        :host[hidden] {
            display: none;
        }

        :host #reference::before {
            content: '⏵';
            display: inline-block;
            width: 25px;
            margin-bottom: 1em;
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
            console.log(this);

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

            console.groupEnd();
        }

        connectedCallback() {
            console.group("ScripturePassage ConnectedCallback:");

            this.addEventListener('click', this._onClick);
            console.groupEnd();
        }

        disconnectedCallback() {
            this.api = null;
        }



        _onClick(event) {
            console.group("onClick");
            console.log(event.path[0].tagName);
            if ('SUMMARY' === event.path[0].tagName) {
                console.log("toggling [open]");
                this.open = !this.open;
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

        set api(val) {
            if (typeof val === 'function') {
                this.api = new val();
            }
        }
    }


    window.customElements.define('scripture-passage', ScripturePassage);
})();

