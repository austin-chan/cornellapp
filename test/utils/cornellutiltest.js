/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Test file for the cornellutil.js util module.
 */

var assert = require('assert'),
	cornellutil = require('../../app/utils/cornellutil');

describe('cornellutil', function() {
	// fetchName method
	it('should have an fetchName method', function() {
		assert.equal(typeof cornellutil, 'object');
		assert.equal(typeof cornellutil.fetchName, 'function');
	});
	it('fetchName(\'\') should equal null', function(done) {
		cornellutil.fetchName('', function(name) {
			assert.equal(name, null);
			done();
		});
	});
	it('fetchName(\'8s2dw\') should equal null', function(done) {
		cornellutil.fetchName('8s2dw', function(name) {
			assert.equal(name, null);
			done();
		});
	});
	it('fetchName(\'adc237\') should equal \'Austin Dzan-Hei Chan\'',
		function(done) {
			cornellutil.fetchName('adc237', function(name) {
				assert.equal(name, 'Austin Dzan-Hei Chan');
				done();
			});
		});
	it('fetchName(\'jar475\') should equal \'Joshua Austin Richardson\'',
		function(done) {
			cornellutil.fetchName('jar475', function(name) {
				assert.equal(name, 'Joshua Austin Richardson');
				done();
			});
		});
});
