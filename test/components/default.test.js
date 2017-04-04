var chai = require('chai');
var expect = chai.expect;
var authasher = require('../../index');
var DEFAULT = require('../../components/default');

describe('authasher::defaults', function() {
	it('is correct', function() {
		expect(DEFAULT.ALGORITHM).to.eq('aes192');
		expect(DEFAULT.INPUT_ENCODING).to.eq('utf8');
		expect(DEFAULT.ITERATIONS).to.eq(8192);
		expect(DEFAULT.HASHING).to.eq('sha512');
		expect(DEFAULT.KEY_LENGTH).to.eq(32);
		expect(DEFAULT.OUTPUT_ENCODING).to.eq('hex');
	});
});