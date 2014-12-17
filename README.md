# FxOS Build

Build and continuous integration scripts for FxOS application development.

## Filesystem Watcher

When you run ```gulp``` a filesystem watcher is initialized which will perform build steps when files are modified.

## Linters

This package contains linting currently performed by JSHint. I would like to consider using eslint and esprima for the ease of adding plugins, but it doesn't currently support ES6 as nicely as JSHint.

To use the linters locally, run:
```
gulp lint
```
