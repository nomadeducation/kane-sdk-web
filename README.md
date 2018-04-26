# Web/Node.js SDK
[![Build Status](https://travis-ci.org/nomadeducation/nomadeducation-sdk-js.svg?branch=master)](https://travis-ci.org/nomadeducation/nomadeducation-sdk-js)

This package is used to call our latest API.

## Installation

Execute the following in your favorite terminal:
```bash
# yarn
yarn add nomadeducation
# npm
npm install --save nomadeducation
```

This package is using `docker` (and `docker-compose`) to run its tests so if you want to contribute and do the same you can install it using the [official guide](https://docs.docker.com/compose/install/).

## Usage

### Browser

```html
<!-- TODO -->
```

### Node.js

```js
const nomad = require("nomadeducation");

// TODO
```

### Testing

Launch the following commands to test the SDK:
```bash
yarn install --frozen-lockfile
yarn test
```

If you want to use `docker` you can execute:
```bash
docker-compose up
```


You can also invoke the debugger (it'll wait on the first line while you're not attached):
```bash
# look at the exposed port in `docker-compose.yml`
docker-compose run sdk yarn test:debug
```

### Linting

Made using `eslint`. To enforce rules to be applied, use `docker-compose run sdk yarn lint:fix`.

### Packaging

To add a new package, you **can** use docker using `docker-compose run sdk yarn add ...`
because it's using the right version of both `node` and `yarn`.
Don't forget to rebuild the "web" image once you've added new packages using `docker-compose build`.

### Publishing

```bash
# Note: we're using this command to publish new versions
# the password is stored in 1password ("npm account")
docker-compose run sdk yarn publish --no-git-tag-version
```
