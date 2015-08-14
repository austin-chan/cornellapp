'use strict';

exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', function(table) {
			table.increments().unsigned();
			table.string('netid', 16).notNullable();
			table.string('name').notNullable();
			table.string('password').notNullable();
			table.boolean('active').notNullable();
			table.string('activation_key', 32).notNullable();
		}),
		knex.schema.createTable('semesters', function(table) {
			table.string('descr').notNullable();
			table.string('lastModifiedDttm').notNullable();
			table.string('slug').notNullable();
			table.integer('strm').notNullable();
		}),
		knex.schema.createTable('courses', function(table) {
			table.increments().unsigned();
			table.integer('crseId').unsigned().notNullable();
			table.integer('crseOfferNbr').unsigned().notNullable();
			table.integer('strm').unsigned().notNullable();
			table.string('subject', 16).notNullable();
			table.string('titleLong').notNullable();
			table.string('titleShort').notNullable();
			table.string('description', 4096).notNullable();
			table.string('acadCareer').notNullable();
			table.string('acadGroup').notNullable();
			table.string('catalogBreadth').notNullable();
			table.string('catalogAttribute').notNullable();
			table.string('catalogComments', 2048).notNullable();
			table.string('catalogCourseSubfield').notNullable();
			table.string('catalogDistr').notNullable();
			table.string('catalogFee').notNullable();
			table.string('catalogForbiddenOverlaps', 2048).notNullable();
			table.string('catalogLang').notNullable();
			table.integer('catalogNbr').notNullable();
			table.string('catalogOutcomes', 4096).notNullable();
			table.string('catalogPermission', 2048).notNullable();
			table.string('catalogPrereqCoreq', 2048).notNullable();
			table.string('catalogSatisfiesReq', 2048).notNullable();
			table.string('catalogWhenOffered').notNullable();
		}),
		knex.schema.createTable('groups', function(table) {
			table.increments().unsigned();
			table.integer('courseId').unsigned().notNullable();
			table.string('componentsOptional', 2048).notNullable();
			table.string('componentsRequired', 2048).notNullable();
			table.string('gradingBasis').notNullable();
			table.string('gradingBasisLong').notNullable();
			table.string('gradingBasisShort').notNullable();
			table.string('sessionBeginDt').notNullable();
			table.string('sessionEndDt').notNullable();
			table.string('sessionCode').notNullable();
			table.string('sessionLong').notNullable();
			table.string('simpleCombinations', 2048).notNullable();
			table.float('unitsMaximum').notNullable();
			table.float('unitsMinimum').notNullable();
		}),
		knex.schema.createTable('sections', function(table) {
			table.increments();
			table.integer('groupId').unsigned().notNullable();
			table.string('addConsent').notNullable();
			table.string('addConsentDescr').notNullable();
			table.string('campus').notNullable();
			table.string('campusDescr').notNullable();
			table.integer('classNbr').notNullable();
			table.string('endDt').notNullable();
			table.string('instructionMode').notNullable();
			table.string('instrModeDescr').notNullable();
			table.string('instrModeDescrshort').notNullable();
			table.boolean('isComponentGraded').notNullable();
			table.string('location').notNullable();
			table.string('locationDescr').notNullable();
			table.string('notes', 4096).notNullable();
			table.string('section').notNullable();
			table.string('ssrComponent').notNullable();
			table.string('ssrComponentLong').notNullable();
			table.string('startDt').notNullable();
			table.string('topicDescription').notNullable();
		}),
		knex.schema.createTable('meetings', function(table) {
			table.increments().unsigned();
			table.integer('sectionId').unsigned().notNullable();
			table.string('bldgDescr').notNullable();
			table.integer('classMtgNbr').notNullable();
			table.string('facilityDescr').notNullable();
			table.string('facilityDescrshort').notNullable();
			table.string('pattern').notNullable();
			table.string('timeEnd').notNullable();
			table.string('timeStart').notNullable();
			table.string('startDt').notNullable();
			table.string('endDt').notNullable();
			table.string('meetingTopicDescription', 2048).notNullable();
		}),
		knex.schema.createTable('meeting_professors_joins', function(table) {
			table.integer('meetingId').unsigned();
			table.string('professorLabel');
		}),
		knex.schema.createTable('professors', function(table) {
			table.string('label').primary().notNullable();
			table.string('netid').notNullable();
			table.string('firstName').notNullable();
			table.string('middleName').notNullable();
			table.string('lastName').notNullable();
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('users'),
		knex.schema.dropTable('semesters'),
		knex.schema.dropTable('courses'),
		knex.schema.dropTable('groups'),
		knex.schema.dropTable('sections'),
		knex.schema.dropTable('meetings'),
		knex.schema.dropTable('meeting_professors_joins'),
		knex.schema.dropTable('professors')
	]);
};
