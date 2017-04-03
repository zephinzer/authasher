var crypto = require('crypto');

var DEFAULT_ALGORITHM = 'aes192',
		DEFAULT_HASHING = 'sha512',
		DEFAULT_INPUT_ENCODING = 'utf8',
		DEFAULT_ITERATIONS = 8192,
		DEFAULT_OUTPUT_ENCODING = 'hex',
		DEFAULT_KEY_LENGTH = 32;


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
		_options = _options || {};
		var options = {
			algorithm: _options.algorithm || DEFAULT_ALGORITHM,
			hashingFunction: DEFAULT_HASHING,
			inputEncoding: _options.inputEncoding || DEFAULT_INPUT_ENCODING,
			iterations: _options.iterations || DEFAULT_ITERATIONS,
			outputEncoding: _options.outputEncoding || DEFAULT_OUTPUT_ENCODING,
			keyLength: _options.keyLength || DEFAULT_KEY_LENGTH
		};
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
		_options = _options || {};
		var options = {
			algorithm: _options.algorithm || DEFAULT_ALGORITHM,
			hashingFunction: DEFAULT_HASHING,
			inputEncoding: _options.inputEncoding || DEFAULT_INPUT_ENCODING,
			iterations: _options.iterations || DEFAULT_ITERATIONS,
			keyLength: _options.keyLength || DEFAULT_KEY_LENGTH,
			outputEncoding: _options.outputEncoding || DEFAULT_OUTPUT_ENCODING,
			timeValidity: _options.timeValidity
		};

		var valid, expired, corrupt = null;
		var passwordSections = storedKeyWrapper.split('@');
		if(passwordSections.length !== 2) {
			valid = false;
			corrupt = true;
			return { valid, expired, corrupt };
		}

		var hashSegments = passwordSections[0];
		var lengthSegments = passwordSections[1].split('.');
		if(lengthSegments.length !== 4) {
			valid = false;
			corrupt = true;
			return { valid, expired, corrupt };
		}

		var saltLength = lengthSegments[1] - 0;
		var hashLength = lengthSegments[2] - 0;
		var dateLength = lengthSegments[3] - 0;
		var saltAndSaltedHash = hashSegments.slice(0, saltLength + hashLength);
		var storedSalt, storedHash, storedDate;
		try {
			storedSalt = hashSegments.slice(0, saltLength);
			storedHash = hashSegments.slice(saltLength, saltLength + hashLength);
			storedDate = hashSegments.slice(saltLength + hashLength, saltLength + hashLength + dateLength);
		} catch(ex) {
			valid = false;
			corrupt = true;
			return { valid, expired, corrupt };
		}

		var dateDecipher, storedTime, timeNow;
		try {
			dateDecipher =  crypto.createDecipher(options.algorithm, saltAndSaltedHash);
			storedTime = dateDecipher.update(storedDate, options.outputEncoding, options.inputEncoding);
			storedTime = (storedTime + dateDecipher.final(options.inputEncoding)).replace(/\//gi,'');
		} catch(ex) {
			valid = false;
			corrupt = true;
			return { valid, expired, corrupt };
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
