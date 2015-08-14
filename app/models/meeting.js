/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for meetings.
 */

var Joi = require('joi');

var meeting = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'meetings',
		section: function() {
			var relation = this.belongsTo(models.section);
			relation.relatedData.parentTableName = 'sectionId';
			return relation;
		},
		professors: function() {
			var relation = this.hasMany(models.professor, 'meetingId')
				.through(models.meetingprofessorsjoin, 'id', 'meetingId');
			relation.relatedData.throughIdAttribute = 'professorLabel';
			relation.relatedData.throughForeignKey = 'label';
			return relation;
		}
	}, {
        /**
         * Instance creation object parameter validation schema.
         */
        validator: Joi.object({
            sectionId: Joi.number(),
            bldgDescr: Joi.string().allow('').default(''),
            classMtgNbr: Joi.number().default(1),
            facilityDescr: Joi.string().allow('').default(''),
            facilityDescrshort: Joi.string().allow('').default(''),
            pattern: Joi.string().allow('').default(''),
            timeEnd: Joi.string().allow('').default(''),
            timeStart: Joi.string().allow('').default(''),
            startDt: Joi.string().allow('').default(''),
            endDt: Joi.string().allow('').default(''),
            meetingTopicDescription: Joi.string().allow('').default('')
        }).options({ stripUnknown: true })
    });
};

module.exports = meeting;
