/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Test file for the strutil.js util module.
 */

var assert = require('assert'),
	strutil = require('../../app/utils/strutil'),
	alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234' +
					'656789';

describe('strutil', function() {
	// isAlphanumeric method
	it('should have an isAlphanumeric method', function() {
		assert.equal(typeof strutil, 'object');
		assert.equal(typeof strutil.isAlphanumeric, 'function');
	});
	it('isAlphanumeric(\'\') should equal true', function() {
		assert.equal(strutil.isAlphanumeric(''), true);
	});
	it('isAlphanumeric(\'' + alphanumeric + '\') should equal true',
		function() {
			assert.equal(strutil.isAlphanumeric(alphanumeric), true);
		});
	it('isAlphanumeric(\'a29zsje21l\') should equal true', function() {
		assert.equal(strutil.isAlphanumeric('a29zsje21l'), true);
	});
	it('isAlphanumeric(\'a2j-1l\') should equal false', function() {
		assert.equal(strutil.isAlphanumeric('a2j-1l'), false);
	});
	it('isAlphanumeric(\'&@)9dz2\') should equal false', function() {
		assert.equal(strutil.isAlphanumeric('&@)9dz2'), false);
	});

	// isEmpty method
	it('should have an isWhiteEmpty method', function() {
		assert.equal(typeof strutil, 'object');
		assert.equal(typeof strutil.isWhiteEmpty, 'function');
	});
	it('isWhiteEmpty(\'\') should equal true', function(){
		assert.equal(strutil.isWhiteEmpty(''), true);
	});
	it('isWhiteEmpty(\'  \') should equal true', function(){
		assert.equal(strutil.isWhiteEmpty('  '), true);
	});
	it('isWhiteEmpty(\' 13 \') should equal false', function(){
		assert.equal(strutil.isWhiteEmpty(' 13 '), false);
	});
	it('isWhiteEmpty(\'3410\') should equal false', function(){
		assert.equal(strutil.isWhiteEmpty('3410'), false);
	});
});

