# Web/Node.js SDK
[![Build Status](https://travis-ci.com/nomadeducation/nomadeducation-sdk-js.svg?branch=master)](https://travis-ci.com/nomadeducation/nomadeducation-sdk-js)
[![Coverage Status](https://coveralls.io/repos/github/nomadeducation/nomadeducation-sdk-js/badge.svg?branch=master)](https://coveralls.io/github/nomadeducation/nomadeducation-sdk-js?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/nomadeducation/badge.svg)](https://snyk.io/test/npm/nomadeducation)

This package is used to call our latest API.

## Installation

Execute the following in your favorite terminal:
```bash
# yarn
yarn add nomadeducation
# npm
npm install --save nomadeducation
```

## Usage

The SDK is exporting its object `Nomad` using the UMD format. In the browser context, it'll therefore be attached to the `window` object.

### Example

```js
const Nomad = require("nomadeducation");
// even though this SDK is primarily targeting the browser
// you can also use it on Node.js by using the following line instead
// const Nomad = require("nomadeducation/dist/node");

const client = new Nomad({
    // the client uses our latest endpoint by default
    base_url: "https://api.nomadeducation.com/v2",
    // you can (optionally) use your own API key.
    // Note that you won't have to log into our system then
    api_key: "d6921bc91cd2470e6a265974d4d9c47a",
    // sometimes your request can take more time than estimated
    disable_timeout: true
});

async function publicMethods () {
    // if you don't use your API key, you can still login using your credentials
    // Beware that this must be the first action before calling any other methods
    // you can extend your session up to 5 days if you pass `true` as the third parameter
    await client.login("myUsername", "myPassword", extendedSession = true);

    // now you can consume the API
    // the library will throw errors if you don't have enough permissions

    // once you've finished, you can explicitely logged out
    const isLoggedOut = await client.logout();
}

// the library also exposes utility functions:
// - determine the version used
const version = Nomad.version();
// - monitor the API status
const status = Nomad.health();
```

### Reference

Check the [documentation](https://docs.nomadeducation.com/?language=JavaScript) to get the entire reference.

### Testing

Prerequisites: you'll have to add your API key (Travis CI will use the "test" account):
```bash
echo '{"username": "test", "password": "TEST_PW", "apiKey": "TEST_TOKEN"}' > test/account.json
```

Do **not** forget to launch Kane APIs locally before testing!

Then execute the following commands to test the SDK:
```bash
yarn install --frozen-lockfile
yarn test
```

This will launch tests directly on the production API. If you want to launch your tests locally, you can use:
```bash
yarn test:dev
```

You can also invoke the debugger. It'll wait on the first line while you're not attached:
```bash
# you can debug either using the production...
yarn test:debug
# ...or locally!
yarn test:dev:debug
```

### Linting

Made using `eslint`. To enforce rules to be applied, use `yarn lint:fix`.
