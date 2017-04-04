var DEFAULT = require('./default');

module.exports = {
	generateDefaultOptions: function(options) {
		return {
			algorithm: options.algorithm || DEFAULT.ALGORITHM,
			hashingFunction: options.hashing || DEFAULT.HASHING,
			inputEncoding: options.inputEncoding || DEFAULT.INPUT_ENCODING,
			iterations: options.iterations || DEFAULT.ITERATIONS,
			outputEncoding: options.outputEncoding || DEFAULT.OUTPUT_ENCODING,
			keyLength: options.keyLength || DEFAULT.KEY_LENGTH
		}
	},

	generateCorruptedReturnObject: function() {
		return {
			valid: false,
			expired: false,
			corrupt: true
		};
	},

	getPasswordSections: function(storedKeyWrapper) {
		var passwordSections = storedKeyWrapper.split('@');
		if(passwordSections.length !== 2) {
			throw EvalError();
		} else {
			return passwordSections;
		}
	},

	getLengthSegments: function(lengthSegment) {
		var lengthSegments = lengthSegment.split('.');
		if(lengthSegments.length !== 4) {
			throw EvalError();
		} else {
			return lengthSegments;
		}
	}
};