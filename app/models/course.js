/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for courses.
 */

var Joi = require('joi');

var course = function(bookshelf, models) {
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
        /**
         * Instance creation object parameter validation schema.
         */
		validator: Joi.object({
			crseId: Joi.number().required(),
			crseOfferNbr: Joi.number().required(),
			strm: Joi.number().required(),
			subject: Joi.string().required(),
			titleLong: Joi.string().required(),
			titleShort: Joi.string().required(),
			description: Joi.string().allow('').default(''),
			acadCareer: Joi.string().allow('').default(''),
			acadGroup: Joi.string().allow('').default(''),
			catalogBreadth: Joi.string().allow('').default(''),
			catalogAttribute: Joi.string().allow('').default(''),
			catalogComments: Joi.string().allow('').default(''),
			catalogCourseSubfield: Joi.string().allow('').default(''),
			catalogDistr: Joi.string().allow('').default(''),
			catalogFee: Joi.string().allow('').default(''),
			catalogForbiddenOverlaps: Joi.string().allow('').default(''),
			catalogLang: Joi.string().allow('').default(''),
			catalogNbr: Joi.number().required(),
			catalogOutcomes: Joi.string().default('[]'),
			catalogPermission: Joi.string().allow('').default(''),
			catalogPrereqCoreq: Joi.string().allow('').default(''),
			catalogSatisfiesReq: Joi.string().allow('').default(''),
			catalogWhenOffered: Joi.string().allow('').default(''),
		}).options({ stripUnknown: true })
	});
};

module.exports = course;
