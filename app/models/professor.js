/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for professors.
 */

var Joi = require('joi');

var professor = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'professors'
    }, {
        /**
         * Instance creation object parameter validation schema.
         */
        validator: Joi.object({
            label: Joi.string().allow('').default(''),
            netid: Joi.string().allow('').default(''),
            firstName: Joi.string().allow('').default(''),
            middleName: Joi.string().allow('').default(''),
            lastName: Joi.string().allow('').default(''),
        }).options({ stripUnknown: true })
    });
};

module.exports = professor;
