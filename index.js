var crypto = require('crypto');
var utility = require('./components/utility');
var DEFAULT = require('./components/default');

module.exports = {
	DEFAULT: DEFAULT,
	create: function(password, _options) {
		var options = utility.generateDefaultOptions(_options || {});
		var salt = crypto.randomBytes(options.keyLength).toString(options.outputEncoding);
		var saltedHash = utility.generatedSaltedHash(
			password, salt, options.iterations, options.keyLength, options.hashingFunction, options.outputEncoding
		);
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
		var options = utility.generateDefaultOptions(_options || {});
		options.timeValidity = options.timeValidity;

		var passwordSections, lengthSegments, saltLength, hashLength, dateLength, hashSegments, saltAndSaltedHash,
				storedSalt, storedHash, storedDate, dateDecipher, storedTime;
		try {
			passwordSections = utility.getSegments(storedKeyWrapper, '@', 2);
			lengthSegments = utility.getSegments(passwordSections[1], '.', 4);
			saltLength = lengthSegments[1] - 0;
			hashLength = lengthSegments[2] - 0;
			dateLength = lengthSegments[3] - 0;
			hashSegments = passwordSections[0];
			saltAndSaltedHash = hashSegments.slice(0, saltLength + hashLength);
			storedSalt = hashSegments.slice(0, saltLength);
			storedHash = hashSegments.slice(saltLength, saltLength + hashLength);
			storedDate = hashSegments.slice(saltLength + hashLength, saltLength + hashLength + dateLength);
			dateDecipher =  crypto.createDecipher(options.algorithm, saltAndSaltedHash);
			storedTime = dateDecipher.update(storedDate, options.outputEncoding, options.inputEncoding);
			storedTime = (storedTime + dateDecipher.final(options.inputEncoding)).replace(/\//gi,'');
		} catch(ex) {
			return utility.generateCorruptedReturnObject();
		}
		
		var challengeHash = utility.generatedSaltedHash(
			challengeKey, storedSalt, options.iterations, options.keyLength, options.hashingFunction, options.outputEncoding
		);
		valid = (challengeHash === storedHash);
		expired = (
				(options.timeValidity === null) || (typeof options.timeValidity === 'undefined')
			) ? false : ((new Date()).getTime() - storedtime < options.timeValidity)
		corrupt = false;
		return { valid, expired, corrupt };
	}
};
