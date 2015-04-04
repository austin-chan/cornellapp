'use strict';

exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', function(table) {
			table.increments();
			table.string('netid', 16);
			table.string('name');
		}),
		knex.schema.createTable('semesters', function(table) {
			table.string('descr');
			table.string('lastModifiedDttm');
			table.string('slug');
			table.string('strm');
		}),
		knex.schema.createTable('courses', function(table) {
			table.increments();
			table.integer('crseId').unsigned();
			table.integer('crseOfferNbr').unsigned();
			table.integer('strm').unsigned();
			table.string('subject', 16);
			table.string('titleLong');
			table.string('titleShort');
			table.string('description', 2048);
			table.string('acadCareer');
			table.string('acadGroup');
			table.string('catalogBreadth');
			table.string('catalogComments');
			table.string('catalogCourseSubfield');
			table.string('catalogDistr');
			table.string('catalogFee');
			table.string('catalogForbiddenOverlaps');
			table.string('catalogLang');
			table.string('catalogNbr');
			table.string('catalogOutcomes');
			table.string('catalogPermission');
			table.string('catalogPrereqCoreq');
			table.string('catalogSatisfiesReq');
			table.string('catalogWhenOffered');
		}),
		knex.schema.createTable('groups', function(table) {
			table.increments();
			table.integer('courseId').unsigned();
			table.string('componentsOptional');
			table.string('componentsRequired');
			table.string('gradingBasis');
			table.string('gradingBasisLong');
			table.string('gradingBasisShort');
			table.string('sessionBeginDt');
			table.string('sessionEndDt');
			table.string('sessionCode');
			table.string('sessionLong');
			table.string('simpleCombinations');
			table.integer('unitsMaximum');
			table.integer('unitsMinimum');
		}),
		knex.schema.createTable('sections', function(table) {
			table.increments();
			table.integer('groupId').unsigned();
			table.string('addConsent');
			table.string('addConsentDescr');
			table.string('campus');
			table.string('campusDescr');
			table.integer('classNbr');
			table.string('endDt');
			table.string('instructionMode');
			table.string('instrModeDescr');
			table.string('instrModeDescrshort');
			table.boolean('isComponentGraded');
			table.string('location');
			table.string('locationDescr');
			table.string('notes');
			table.string('section');
			table.string('ssrComponent');
			table.string('ssrComponentLong');
			table.string('startDt');
			table.string('topicDescription');
		}),
		knex.schema.createTable('meetings', function(table) {
			table.increments();
			table.integer('sectionId').unsigned();
			table.string('bldgDescr');
			table.string('classMtgNbr');
			table.string('facilityDescr');
			table.string('facilityDescrshort');
			table.string('pattern');
			table.string('timeEnd');
			table.string('timeStart');
			table.string('startDt');
			table.string('endDt');
			table.string('meetingTopicDescription');
		}),
		knex.schema.createTable('meeting_professors', function(table) {
			table.integer('meetingId').unsigned();
			table.string('professorNetid');
		}),
		knex.schema.createTable('professors', function(table) {
			table.string('netid');
			table.string('firstName');
			table.string('middleName');
			table.string('lastName');
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
		knex.schema.dropTable('meeting_professors'),
		knex.schema.dropTable('professors')
	]);
};
