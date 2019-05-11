# Scripture Web Components

This is a set of web components for dealing with Scripture passages (i.e. the Christian bible). These web components rely on the existence of an API for looking up scripture passages. An implementation which uses Crossway's ESV Api exists in [crossway.js](./crossway.js) (see [the api](#the-api) section for details). 

```html
A specific passage of scripture:
<scripture-passage api="crosswayApi" reference="Acts 17:24-25"><scripture->
  ```

![scripture-passage](./scripture-passage-open.JPG?raw=true)

```html
A list of scripture passages:
<scripture-list
  api="crosswayApi"
  reference-list='["2 Timothy 1:9", "James 1:18"]'
></scripture-list>
```

![scripture-list](./scripture-list-open.JPG?raw=true)

## Usage

```html
<scripture-passage api="crosswayApi" reference="Isaiah 48:9-11"></scripture-passage>

<scripture-list api="crosswayApi" reference-list='["Isaiah 48:9-11", "John 3:16"]'"></scripture->

<!-- Load the crossway API (or provide your own, see below) -->
<script src="https://cdn.jsdelivr.net/npm/web-components-scripture@1/crossway.js"></script>
<script>
    //create the 'crosswayApi' object being referenced
    const crosswayApi = new Crossway('your-token-here');
</script>
<!-- Load the web components -->
<script src="https://cdn.jsdelivr.net/npm/web-components-scripture@1/scripture.js"></script>
```



## Scripture Passage

`<scripture-passage> class: ScripturePassage`

Render a passage of scripture. 

```html
<scripture-passage open api="crosswayApi" reference="Acts 17:24-25"><scripture-passage>
```

## Attributes

* api (required)
  * a reference to [an api](#the-api) object available
* reference (required)
  * the reference to the scripture passage (in a format the api will understand)
  * e.g. Isaiah 45:22
* open 
  * whether the passage is open (i.e. expanded) or not.
  * The scripture text will be fetched the first time it's opened
  * clicking the reference summary toggle the open state

## JS Usage

```javascript
const passage = document.querySelector('scripture-passage.some-class');
passage.open = true;
```

### Properties 

* `passage.open`: toggle the open state
* `passage.reference`: the scripture reference for this element
* `passage.passages`: the actual scripture text for this element. can be a String, Element, or Array of Elements.

## Scripture List

`<scripture-list> class: ScriptureList`

Render a list scripture passages. With an expand/collapse all link.

```html
A list of scripture passages:
<scripture-list
  open
  api="crosswayApi"
  reference-list='["2 Timothy 1:9", "James 1:18"]'
></scripture-list>
```

### Attributes

* api (required)
  * a reference to [an api](#the-api) object availabe
* reference-list (required)
  * a (JSON.parse-able) array of scripture references (in a format the api will understand) 
  * e.g. ["Psalm 33:10-11", "Jeremah 10:12-13"]
  * note: probably need to use single quotes around the value, rather than double
* open
  * whether ALL passages in the list should be open or not
  * toggles when clicking the expand/collapse all text

### JS Usage

```javascript
const list = document.querySelector('scripture-list.some-class');
list.open = true;
```

### Properties

* `list.open`: toggle the open state of all scripture passages
* `list.referenceList`: an array of scripture references


# The API

These web components rely on an API for looking up scripture passage. The API is an object (or class, etc.) which provides 2 methods: `query`, and `linkTo`.

```javascript
const myApi = {
    query(reference) {
        //looks up the text for the given reference.
        //may return a String of text, or any HTML Element.
    }

    linkTo(reference) {
        //return an A tag linking to the given reference.
        //this is used for the 'see context' link on <scripture-passage>
    }
}
```

## Crossway API

[crossway.js](./crossway.js) provides an implementation which uses Crossway's ESV api. Their api requires a token to use, so you must create an instance of Crossway by providing your token.

```html
<scripture-passage api="crosswayApi" reference="Isaiah 48:9-11"></scripture-passage>

<script src="./crossway.js"></script>
<script>
    //create the 'crosswayApi' object being referenced
    const crosswayApi = new Crossway('your-token-here');
</script>
<script src="./scripture.js"></script>
```