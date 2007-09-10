# Resizeable splitter

A resizeable splitter panel manager

## How to use

Please, view the file [index.htm](index.htm).

This code was built to with the intention of loading the layout from JSON data, so the [Container](container.js) object has a build method for it. The Container also has a property "structure", which is a tree of [Nodes](node.js), updated as the panels are splitted/added/removed.

[Block](block.js) = each panel is a Block object.

[Splitter](splitter.js) = unite blocks with a resizer

[Resizer](resizer.js) = the divisor line.