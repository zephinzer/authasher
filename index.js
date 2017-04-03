var crypto = require('crypto');

var DEFAULT_ALGORITHM = 'aes192',
		DEFAULT_HASHING = 'sha512',
		DEFAULT_INPUT_ENCODING = 'utf8',
		DEFAULT_ITERATIONS = 8192,
		DEFAULT_OUTPUT_ENCODING = 'hex',
		DEFAULT_KEY_LENGTH = 32;

function generateDefaultOptions(options) {
	return {
		algorithm: options.algorithm || DEFAULT_ALGORITHM,
		hashingFunction: options.hashing || DEFAULT_HASHING,
		inputEncoding: options.inputEncoding || DEFAULT_INPUT_ENCODING,
		iterations: options.iterations || DEFAULT_ITERATIONS,
		outputEncoding: options.outputEncoding || DEFAULT_OUTPUT_ENCODING,
		keyLength: options.keyLength || DEFAULT_KEY_LENGTH
	}
};

function generateCorruptedReturnObject() {
	return {
		valid: false,
		expired: false,
		corrupt: true
	};
}

function getPasswordSections(storedKeyWrapper) {
	var passwordSections = storedKeyWrapper.split('@');
	if(passwordSections.length !== 2) {
		throw EvalError();
	} else {
		return passwordSections;
	}
}

function getLengthSegments(lengthSegment) {
	var lengthSegments = lengthSegment.split('.');
	if(lengthSegments.length !== 4) {
		throw EvalError();
	} else {
		return lengthSegments;
	}
}

module.exports = {
	DEFAULT: {
		ALGORITHM: DEFAULT_ALGORITHM,
		HASHING: DEFAULT_HASHING,
		INPUT_ENCODING: DEFAULT_INPUT_ENCODING,
		ITERATIONS: DEFAULT_ITERATIONS,
		OUTPUT_ENCODING: DEFAULT_OUTPUT_ENCODING,
		KEY_LENGTH: DEFAULT_KEY_LENGTH
	},
	create: function(password, _options) {
		var options = generateDefaultOptions(_options || {});
		var salt = crypto.randomBytes(options.keyLength).toString(options.outputEncoding);
		var saltedHash = crypto.pbkdf2Sync(
			password, salt, options.iterations, options.keyLength, options.hashingFunction
		).toString(options.outputEncoding);
		var saltAndSaltedHash = salt.concat(saltedHash);
		var dateCipher = crypto.createCipher(options.algorithm, saltAndSaltedHash);
		var timeString = (new Date()).getTime().toString();
		while(timeString.length < (options.keyLength / 2)) { timeString += '/' }
		var date = dateCipher.update(timeString, options.inputEncoding, options.outputEncoding);
		date += dateCipher.final(options.outputEncoding);
		var random = Math.floor(Math.random() * 255);
		return `${salt}${saltedHash}${date}@${random}.${salt.length}.${saltedHash.length}.${date.length}`;
	},
	validate: function(challengeKey, storedKeyWrapper, _options) {
		var options = generateDefaultOptions(_options || {});
		options.timeValidity = options.timeValidity;

		var passwordSections;
		var lengthSegments;
		try {
			passwordSections = getPasswordSections(storedKeyWrapper);
			lengthSegments = getLengthSegments(passwordSections[1]);
		} catch(ex) {
			return generateCorruptedReturnObject();
		}

		var saltLength = lengthSegments[1] - 0;
		var hashLength = lengthSegments[2] - 0;
		var dateLength = lengthSegments[3] - 0;

		var hashSegments = passwordSections[0];
		var saltAndSaltedHash = hashSegments.slice(0, saltLength + hashLength);
		var storedSalt, storedHash, storedDate;
		try {
			storedSalt = hashSegments.slice(0, saltLength);
			storedHash = hashSegments.slice(saltLength, saltLength + hashLength);
			storedDate = hashSegments.slice(saltLength + hashLength, saltLength + hashLength + dateLength);
		} catch(ex) {
			return generateCorruptedReturnObject();
		}

		var dateDecipher, storedTime;
		try {
			dateDecipher =  crypto.createDecipher(options.algorithm, saltAndSaltedHash);
			storedTime = dateDecipher.update(storedDate, options.outputEncoding, options.inputEncoding);
			storedTime = (storedTime + dateDecipher.final(options.inputEncoding)).replace(/\//gi,'');
		} catch(ex) {
			return generateCorruptedReturnObject();
		}
		
		var challengeHash = crypto.pbkdf2Sync(
			challengeKey, storedSalt, options.iterations, options.keyLength, options.hashingFunction
		).toString(options.outputEncoding);
		valid = (challengeHash === storedHash);
		expired = (
				(options.timeValidity === null) || (typeof options.timeValidity === 'undefined')
			) ? false : ((new Date()).getTime() - storedtime < options.timeValidity)
		corrupt = false;
		return { valid, expired, corrupt };
	}
};
