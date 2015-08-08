/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for enroll groups.
 */

var Joi = require('joi');

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'groups',
		course: function() {
			var relation = this.belongsTo(models.course);
			relation.relatedData.parentTableName = 'courseId';
			return relation;
		},
		sections: function() {
			return this.hasMany(models.section, 'groupId');
		}
	}, {
	validator: Joi.object({
			courseId: Joi.number(),
			componentsOptional: Joi.string().default('[]'),
			componentsRequired: Joi.string().default('[]'),
			gradingBasis: Joi.string().allow('').default(''),
			gradingBasisLong: Joi.string().allow('').default(''),
			gradingBasisShort: Joi.string().allow('').default(''),
			sessionBeginDt: Joi.string().allow('').default(''),
			sessionEndDt: Joi.string().allow('').default(''),
			sessionCode: Joi.string().allow('').default(''),
			sessionLong: Joi.string().allow('').default(''),
			simpleCombinations: Joi.string().default('[]'),
			unitsMaximum: Joi.number().precision(2),
			unitsMinimum: Joi.number().precision(2)
		}).options({ stripUnknown: true })
	});
}
