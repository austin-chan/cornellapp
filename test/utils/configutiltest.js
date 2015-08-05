/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Test file for the configutil.js util module.
 */

var assert = require('assert'),
	config = require('config'),
	configutil = require('../../app/utils/configutil')(config);

describe('config', function() {
	it('should have available semesters set', function() {
		assert.equal(typeof config.semesters, 'object');
	});
	it('should have an active semester slug set', function() {
		assert.equal(typeof config.semester, 'string');
	});
});

describe('configutil', function() {
	// getSemester method
	it('should have an available semesters set', function() {
		assert.equal(typeof configutil, 'object');
		assert.equal(typeof configutil.getSemester, 'function');
	});
	it('getSemester(\'\') should return a valid semester', function() {
		assert.notEqual(configutil.getSemester(), undefined);
	});
});
