var chai = require('chai');
var expect = chai.expect;
var authasher = require('../../index');
var utility = require('../../components/utility');
var DEFAULT = require('../../components/default');

describe('authasher::utility', function() {
	context('generateCorruptedReturnObject', function() {
		it('returns the correct structure', function() {
			expect(Object.keys(utility.generateCorruptedReturnObject())).to.deep.eq([
				'valid',
				'expired',
				'corrupt'
			]);
		});
		it('returns the correct content', function() {
			var corruptedResponse = utility.generateCorruptedReturnObject();
			expect(corruptedResponse.valid).to.deep.eq(false);
			expect(corruptedResponse.expired).to.deep.eq(false);
			expect(corruptedResponse.corrupt).to.deep.eq(true);
		});
	});

	context('generateDefaultOptions', function() {
		it('returns the correct structure', function() {
			var defaultOptions = utility.generateDefaultOptions();
			expect(Object.keys(defaultOptions)).to.deep.eq([
				'algorithm',
				'hashingFunction',
				'inputEncoding',
				'iterations',
				'outputEncoding',
				'keyLength'
			]);
		});
		it('returns the correct content', function() {
			var defaultOptions = utility.generateDefaultOptions();
			expect(defaultOptions.algorithm).to.eq(DEFAULT.ALGORITHM);
			expect(defaultOptions.hashingFunction).to.eq(DEFAULT.HASHING);
			expect(defaultOptions.iterations).to.eq(DEFAULT.ITERATIONS);
			expect(defaultOptions.keyLength).to.eq(DEFAULT.KEY_LENGTH);
			expect(defaultOptions.inputEncoding).to.eq(DEFAULT.INPUT_ENCODING);
			expect(defaultOptions.outputEncoding).to.eq(DEFAULT.OUTPUT_ENCODING);
		})
	});

	context('getSegments', function() {
		it('works as expected', function() {
			expect(function() {
				var segmentedResult = utility.getSegments('a.b.c.d', '.', 4);
			}).to.not.throw();
		});
		it('throws EvalError on wrong length', function() {
			expect(function() {
				var segmentedResult = utility.getSegments('a.b.c.d', '.', 3);
			}).to.throw(EvalError);
			expect(function() {
				var segmentedResult = utility.getSegments('a.b.c.d', '.', 5);
			}).to.throw(EvalError);
		});
		it('returns an array of the split text', function() {
			var segmentedResult = utility.getSegments('a.b.c.d', '.', 4);
			expect(segmentedResult instanceof Array).to.be.true;
			expect(segmentedResult).to.have.length(4);
		});
	});
});
