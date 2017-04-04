# Authasher

[![Code Climate](https://codeclimate.com/github/zephinzer/authasher/badges/gpa.svg)](https://codeclimate.com/github/zephinzer/authasher)
[![Build Status](https://travis-ci.org/zephinzer/authasher.svg?branch=master)](https://travis-ci.org/zephinzer/authasher)

## Compatibility
Authasher is tested to be compatible with the following versions of Node: `0.10.42`, `0.12.13`, `4`, `5`, `6`, `7`.

## Installation & Usage
Install authasher with NPM 

```bash
# npm install authasher --save
```

Or install it with Yarn

```bash
# yarn add authasher
```

Include and use it in your project:

```javascript
const authasher = require('authasher');
const password = 'p@ssw0rd';
const hashedToken = authasher.create(password);
const result = authasher.validate(password, hashedToken);
console.log(result);
/**
 * result = {
 *   valid: true,
 *   expired: false,
 *   corrupt: false	 
 * }
 **/
```

## Options
The available options to modify the hashing are:
- `algorithm`
  - changes the encryption algorithm
  - defaults to `aes192`
- `hashing`
  - changes the hashing algorithm
  - defaults to `sha512`
- `timeValidity`
  - time that the hashed token should be valid for
- `iterations`
	- number of PBKDF2 iterations
	- defaults to `8192`
- `keyLength`
	- length of generated keys
	- defaults to `32`

## API
### `authasher::create(password, options)`
- `password` : String
  - the password you wish to hash
- `options` : Object
  - options

This function creates a hash token from the provided password. Returns a hash token of type `String`.

### `authasher::validate(password, storedToken, options)`
- `password` : String
  - the challenging password to validate
- `storedToken` : String
  - a stored token generated from `authasher::create`
- `options` : Object
  - options

This function validates a hash token generated from `authasher::create` (`:storedToken`) with a challenge password (`password`). Returns an object of the following structure:

```json
{
	valid : Boolean,
	expired : Boolean,
	corrupt : Boolean
}
```

## Contributing

### Overview
Fork it, make your changes and raise a pull request. Please include the relevant tests in the `/test` folder.

### Installing the devDependencies
After forking the repository and cloning it locally, run the following command to install the devDependencies with NPM:

```bash
# npm install --only=dev
```

Or run the analogous command to install it with Yarn:

```bash
# yarn install 
```
### Testing
Tests are written with the `mocha` testing framework and the `chai` assertion library.

## Changelog

- Version 1.0.0
  - Initial release