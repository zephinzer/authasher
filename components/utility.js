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

	getSegments: function(segmentedBlock, delimiter, correctLength) {
		var segments = segmentedBlock.split(delimiter);
		if(segments.length !== correctLength) {
			throw EvalError();
		} else {
			return segments;
		}
	}
};