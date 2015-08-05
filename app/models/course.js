/**
 * Copyright (c) 2015, Davyhoy.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for courses.
 */

var Joi = require('joi')

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'courses',
		semester: function() {
			var relation = this.belongsTo(models.semester, 'strm');
			relation.relatedData.parentTableName = 'strm';
			return relation;
		},
		groups: function() {
			return this.hasMany(models.group, 'courseId');
		}
	}, {
		joi: Joi.object({
			crseId: Joi.number().required(),
			crseOfferNbr: Joi.number().required(),
			strm: Joi.number().required(),
			subject: Joi.string().required(),
			titleLong: Joi.string().required(),
			titleShort: Joi.string().required(),
			description: Joi.string().default(''),
			acadCareer: Joi.string().default(''),
			acadGroup: Joi.string().default(''),
			catalogBreadth: Joi.string().default(''),
			catalogAttribute: Joi.string().default(''),
			catalogComments: Joi.string().default(''),
			catalogCourseSubfield: Joi.string().default(''),
			catalogDistr: Joi.string().default(''),
			catalogFee: Joi.string().default(''),
			catalogForbiddenOverlaps: Joi.string().default(''),
			catalogLang: Joi.string().default(''),
			catalogNbr: Joi.number().default(''),
			catalogOutcomes: Joi.string().default('[]'),
			catalogPermission: Joi.string().default(''),
			catalogPrereqCoreq: Joi.string().default(''),
			catalogSatisfiesReq: Joi.string().default(''),
			catalogWhenOffered: Joi.string().default(''),
		}).unknown(false)
	});
}
