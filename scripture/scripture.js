(function () {
    function debug() {
        return localStorage.getItem('debug')
            || ((new URL(document.location)).searchParams).get('debug')
            || false;
    }
    function callIfDebug(method) {
        return new Proxy(method, {
            apply: function (target, thisArg, argumentsList) {
                if (debug()) {
                    target(...argumentsList);
                }
            }
        });
    }
    for (let name in console) {
        const method = console[name];
        if (typeof method === 'function') {
            console[name] = callIfDebug(method);
        }
    }


    const tmpl = document.createElement('template');
    tmpl.innerHTML = `<div></div>
    <style lang="css">
        :host {
            display: block;
        }
        :host[hidden] {
            display: none;
        }
        scripture-passage:not(:first-of-type) {
            border-top: 1px solid rgba(0, 0, 0, 0.2);
        }
        :host::before {
            content: 'expand all';
            font-size: .825rem;
            opacity: .8;
            display: block;
            float: right;
          }
          :host([open])::before {
              content: 'collapse all';
          }
    </style>
    `;

    class ScriptureList extends HTMLElement {
        constructor() {
            super();
            console.group("ScriptureList Constructor:");
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
            console.groupEnd();
        }

        connectedCallback() {
            console.group("ScriptureList ConnectedCallback:");
            const api = eval(this.getAttribute("api"));
            this.addEventListener('click', this._click);
            for (let reference of this.referenceList) {
                console.debug({
                    reference
                })
                const passage = document.createElement('scripture-passage');
                passage.api = api;
                passage.reference = reference;

                console.debug("Adding a new passage", {
                    passage,
                    "firstChild": this.shadowRoot.firstChild
                });
                this.shadowRoot.firstChild.appendChild(passage);
            }
            console.groupEnd();
        }

        _click(event) {
            console.group("ScriptureList click");
            console.debug({
                event
            });
            if (this === event.composedPath()[0]) {
                this.open = !this.open;
                this.shadowRoot.querySelectorAll('scripture-passage').forEach((passage) => {
                    passage.open = this.open
                });
            }
            console.groupEnd();
        }

        get referenceList() {
            let list = this.getAttribute('reference-list');
            try {
                list = JSON.parse(list);
            } catch (err) {
                console.error("scripture-list: could not be parse", {
                    list,
                    err
                })
                list = [];
            }
            if (!Array.isArray(list)) {
                list = [list];
            }
            return list;
        }

        set referenceList(list) {
            this.setAttribute('reference-list', JSON.stringify(list));
        }

        get open() {
            return this.hasAttribute('open');
        }

        set open(val) {
            if (val) {
                this.setAttribute("open", "");
            } else {
                this.removeAttribute("open");
            }
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

        :host([open]) #text {
            display: block;
            padding-left: 25px;
        }

        :host #text:empty::after {
            content: 'Loading...';
        }

        summary {
            cursor: pointer;
        }

        .context {
            display: none;
            text-decoration: none;
            padding-left: 12px;
            font-size: small;
            vertical-align: baseline;
        }

        :host([open]) .context {
            display: inline;
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
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            console.groupEnd();
        }

        connectedCallback() {
            console.group("ScripturePassage ConnectedCallback:");

            if (!this.api && this.hasAttribute("api")) {
                this.api = eval(this.getAttribute("api"));
            }

            this.passages = undefined;
            if (this.open) {
                this._query();
            }
            this.addEventListener('mousedown', this._mouseDown);

            const summary = this.shadowRoot.querySelector('summary');
            const contextLink = this.api.linkTo(this.reference);
            contextLink.classList.add('context');
            contextLink.innerText = ' see context';
            summary.appendChild(contextLink);

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
            console.group("mouseDown");

            //only responde to left mouse click on the <summary>
            if (event.button === 0 && 'SUMMARY' === event.composedPath()[0].tagName) {
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
                //initialize our passages when needed
                if (this.passages.length === 0) this._query();
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