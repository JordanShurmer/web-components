# Scripture Web Components

This is a set of web components for dealing with Scripture passages (i.e. the Christian bible).

## Scripture Passage

`<scripture-passage> class: ScripturePassage`

Used to wrap a passage of scripture. It contains several child elements, and some optional behavior as well

### Child Elements

* [`<scripture-reference>`](#scripture-reference) - The reference (e.g. Acts 17:24-25)
* [`<scripture-text>`](#scripture-text) - The actual text 
* [`<scripture-version>`](#scripture-version) - The version of scripture (e.g. `<a href="www.esv.org">ESV</a>`)

### Usage

```html
    <scripture-passage>
        <scripture-reference>Acts 17:24-25</scripture-reference>
        <scripture-text>
            The God who made the world and everything in it, being Lord of heaven and earth, does not live in temples made by man, nor is he served by human hands, as though he needed anything, since he himself gives to all mankind life and breath and everything.
        </scripture-text>
        <scripture-version><a href="//www.esv.org">ESV</a></scripture-version>
    </scripture-passage>
```

### Examples

TODO

## Scripture Reference

The reference to the passage of scripture being dealt with. Should be a child of [`<scripture-passage`](#scripture-passage).

### Usage

```html
<scripture-reference>Acts 17:24-25</scripture-reference>
```

## Scripture Text

The actual text of scripture. Should be a child of [`scripture-passage`](#scripture-passage).

### Usage

```html
<scripture-text>
        The God who made the world and everything in it, being Lord of heaven and earth, does not live in temples made by man, nor is he served by human hands, as though he needed anything, since he himself gives to all mankind life and breath and everything.
</scripture-text>
```

## Scripture Version

The version of scripture being used (e.g. to meet copyright criteria).

### Usage

```html
<scripture-version><a href="//www.esv.org">ESV</a></scripture-version>
```
