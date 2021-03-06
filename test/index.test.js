var chai = require('chai');
var expect = chai.expect;
var authasher = require('../index');

describe('authasher', function() {
	var password = 'p@ssw0rd';

	context('hash creation', function() {
		it('can create a hash', function() {
			expect(function() {
				var hashedToken = authasher.create(password);
			}).to.not.throw();
		});

		context('performance', function() {
			it('creates a hash in less than 20ms with default settings', function(done) {
				this.timeout(400);
				for(var i = 0; i < 20; ++i) {
					authasher.create(password);
				}
				done();
			});
		});
	});

	context('hash validation', function() {
		it('can validate a hash', function() {
			expect(function() {
				var hashedToken = '';
				var validationResult = authasher.validate(password, hashedToken);
			}).to.not.throw();
		});
		
		it('validates hashes correctly', function() {
			var expectedResult = {
				valid: true,
				expired: false,
				corrupt: false
			}
			var hashedToken = authasher.create(password);
			var validationResult = authasher.validate(password, hashedToken);
			expect(validationResult).to.deep.eq(expectedResult);
		});

		context('performance', function() {
			var hashedToken = authasher.create(password);
			
			it('validates a hash in less than 20ms on average with default settings', function(done) {
				this.timeout(400);
				for(var i = 0; i < 20; ++i) {
					authasher.validate(password, hashedToken);
				}
				done();
			});
		});
	});



	context('options', function() {
		const validResult = {
			valid: true,
			expired: false,
			corrupt: false
		};

		it('can include encryption algorithm', function() {
			var options = { algorithm: 'aes256' };
			var hashedToken = authasher.create(password, options);
			var result = authasher.validate(password, hashedToken, options);
			expect(result).to.deep.eq(validResult);
		});

		it('can include a hashing algorithm', function() {
			var options = { hashing: 'sha256' };
			var hashedToken = authasher.create(password, options);
			var result = authasher.validate(password, hashedToken, options);
			expect(result).to.deep.eq(validResult);
		});

		it('can include the number of iterations', function() {
			var options = { iterations: 16 };
			var hashedToken = authasher.create(password, options);
			var result = authasher.validate(password, hashedToken, options);
			expect(result).to.deep.eq(validResult);
		});

		it('can include the key length', function() {
			var options = { keyLength: 16 };
			var hashedToken = authasher.create(password, options);
			var result = authasher.validate(password, hashedToken, options);
			expect(result).to.deep.eq(validResult);
		});
	});
});