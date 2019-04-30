const ace = window.ace || {};

let tmpl = document.createElement('template');
tmpl.innerHTML = `
<slot></slot>
`;

class CodeBlock extends HTMLElement {

    constructor() {
        super();

        //can be overridden by 'user styles
        this.style.fontFamily = 'monospace';
        this.style.display = 'contents';


        console.group("CodeBlock Constructor:");
        console.debug("initializing ace for", this);

        const mode = `ace/mode/${this.lang}` || undefined;
        console.trace({mode});

        this.editor = ace.edit(this.children[0], {
            readOnly: this.readOnly,
            maxLines: this.maxLines, //make sure the editor has a height
            theme: `ace/theme/${this.theme}`,
            mode: mode,
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
        if (name === "lang") {
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