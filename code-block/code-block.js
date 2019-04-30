(function (ace) {

    const tmpl = document.createElement('template');
    tmpl.innerHTML = `
<div>
<slot></slot>
</div>
`;

    class CodeBlock extends HTMLElement {

        constructor() {
            super();
            console.group("CodeBlock Constructor:");

            //can be overridden by 'user styles
            this.style.fontFamily = 'monospace';
            this.style.display = 'contents';


            console.debug("initializing ace for", this);

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(tmpl.content.cloneNode(true));

            console.groupEnd();
        }
        connectedCallback() {
            console.group("CodeBlock ConnectedCallback:");
            this.editor = ace.edit(this.firstElementChild, {
                readOnly: this.readOnly,
                maxLines: this.maxLines, //make sure the editor has a height
                theme: `ace/theme/${this.theme}`,
                mode: `ace/mode/${this.lang}`,
            });
            console.debug("ace initialized", this.editor);
            console.groupEnd();
        }

        // noinspection JSUnusedGlobalSymbols
        static get observedAttributes() {
            return ['lang'];
        }

        // noinspection JSUnusedGlobalSymbols
        attributeChangedCallback(name, oldValue, newValue) {
            if (this.editor && name === "lang") {
                this.editor.mode = `/ace/mode/${newValue}`;
            }
        }

        get lang() {
            return this.getAttribute("lang") || "";
        }

        set lang(val) {
            this.setAttribute("lang", val);
        }

        get theme() {
            return this.getAttribute("theme") || 'monokai';
        }

        set theme(val) {
            this.setAttribute("theme", val);
        }

        get readOnly() {
            return this.hasAttribute("readOnly") && this.getAttribute("readOnly") !== 'false';
        }

        set readOnly(val) {
            if (val) {
                this.setAttribute("readOnly", "true");
            } else {
                this.removeAttribute("readOnly");
            }
        }

        get maxLines() {
            return +(this.getAttribute("maxLines") || "30");
        }

        set maxLines(val) {
            this.setAttribute("maxLines", val);
        }
    }

    window.customElements.define('code-block', CodeBlock);
})(window.ace || {});