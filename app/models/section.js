/**
 * Copyright (c) 2015, Davyapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * The model class for class sections.
 */

var Joi = require('joi');

module.exports = function(bookshelf, models) {
	return bookshelf.Model.extend({
		tableName: 'sections',
		group: function() {
			var relation = this.belongsTo(models.group);
			relation.relatedData.parentTableName = 'groupId';
			return relation;
		},
		meetings: function() {
			return this.hasMany(models.meeting, 'sectionId');
		}
	}, {
        validator: Joi.object({
        	groupId: Joi.number(),
            addConsent: Joi.string().allow('').default(''),
            addConsentDescr: Joi.string().allow('').default(''),
            campus: Joi.string().allow('').default(''),
            campusDescr: Joi.string().allow('').default(''),
            classNbr: Joi.number().required(),
            endDt: Joi.string().allow('').default(''),
            instructionMode: Joi.string().allow('').default(''),
            instrModeDescr: Joi.string().allow('').default(''),
            instrModeDescrshort: Joi.string().allow('').default(''),
            isComponentGraded: Joi.boolean().default(true),
            location : Joi.string().allow('').default(''),
            locationDescr : Joi.string().allow('').default(''),
            notes: Joi.string().default('[]'),
            section : Joi.string().allow('').default(''),
            ssrComponent : Joi.string().allow('').default(''),
            ssrComponentLong : Joi.string().allow('').default(''),
            startDt : Joi.string().allow('').default(''),
            topicDescription : Joi.string().allow('').default('')
        }).options({ stripUnknown: true })
    });
}
