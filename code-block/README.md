# Code Block

A Web Component to render a block of code. Currently Uses the Ace editor, and assumes you've already loaded it in

## Install

```html
<script src="/path/to/ace.js"></script>
<script src="/path/to/code-block.js"></script>
```

## usage

```html
<code-block lang="scss" readOnly maxlines="30">
.foo {
  display: block;
  
  .bar {
    color: red;
  }
}
</code-block>
```

## Examples

TODO

## TODO

- [] Improve the `editor` usage.. allow passing it your own, or non editor, etc.
- [] examples.
