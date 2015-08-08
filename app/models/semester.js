/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for semesters.
 */

var Joi = require('joi');

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'semesters',
		courses: function() {
			var relation = this.hasMany(models.course, 'strm');
			relation.relatedData.parentTableName = 'strm';
			return relation;
		}
	}, {
        validator: Joi.object({
            descr: Joi.string().required(),
            lastModifiedDttm: Joi.string().required(),
            slug: Joi.string().required(),
            strm: Joi.number().required()
        }).options({ stripUnknown: true })
    });
}
