/**
 * The Crossway API for us in a <scripture-passage>
 */
const ESV_TEXT_ONLY = {
        'include-passage-references': false,
        'include-verse-numbers': false,
        'include-first-verse-numbers': false,
        'include-footnotes': false,
        'include-footnote-body': false,
        'include-headings': false,
        'include-chapter-numbers': false,
        'include-audio-link': false,
        'wrapping-div': true,
    };

class Crossway {


    constructor(authorizationToken) {
        this.authorizationToken = authorizationToken;
    }

    linkTo(reference) {
        const aTag = document.createElement('a');
        aTag.href = `//esv.to/${reference}`;
        aTag.target = "_blank";
        return aTag;
    }

    query(reference) {
        function htmlStringToElement(htmlString) {
            const tmplt = document.createElement('template');
            tmplt.innerHTML = htmlString.trim();
            return tmplt.content.firstChild;
        }

        const params = new URLSearchParams({
            ...ESV_TEXT_ONLY,
            q: reference
        });
        console.debug(`Crossway API: fetching ${reference}`);
        return fetch('https://api.esv.org/v3/passage/html/?' + params.toString(), {
                method: 'GET',
                headers: new Headers({
                    'Authorization': `Token ${this.authorizationToken}`
                })
            })
            .then(response => {
                return response.json();
            })
            .then(esvJson => {
                return esvJson.passages.map(htmlStringToElement);
            });
    }

}