# Safen

[![NPM](https://nodei.co/npm/safen.png)](https://nodei.co/npm/safen/)

Validator Library

## Install

```
npm install safen --save
```

## Usage

```js
import safen from "safen"

const validator = safen.create(/* rules */)

validator.assert(/* any values! */) // if it succeeds, nothing happens. if it failes, an exception occurs.
validator.validate(/* any values! */) // return boolean
 
```

## Rule Examples

@code("./test/index.test.ts@sample1", "typescript")
