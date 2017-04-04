var crypto = require('crypto');
var DEFAULT = require('./default');

module.exports = {
	generateCorruptedReturnObject: function() {
		return {
			valid: false,
			expired: false,
			corrupt: true
		};
	},

	generateDefaultOptions: function(_options) {
		var options = _options || {};
		return {
			algorithm: options.algorithm || DEFAULT.ALGORITHM,
			hashingFunction: options.hashing || DEFAULT.HASHING,
			inputEncoding: options.inputEncoding || DEFAULT.INPUT_ENCODING,
			iterations: options.iterations || DEFAULT.ITERATIONS,
			outputEncoding: options.outputEncoding || DEFAULT.OUTPUT_ENCODING,
			keyLength: options.keyLength || DEFAULT.KEY_LENGTH
		}
	},

	generatedSaltedHash: function(password, salt, iterations, keyLength, hashingFunction, outputEncoding) {
		return crypto.pbkdf2Sync(
			password, salt, iterations, keyLength, hashingFunction
		).toString(outputEncoding);
	},

	getSegments: function(segmentedBlock, delimiter, correctLength) {
		var segments = segmentedBlock.split(delimiter);
		if(segments.length !== correctLength) {
			throw EvalError();
		} else {
			return segments;
		}
	}
};